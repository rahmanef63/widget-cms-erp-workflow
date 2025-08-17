"use client"

import type { ChatSettings } from "@/shared/settings/chat"
import { getAgentConfig } from "@/shared/settings/chat"
import type { ModelOption } from "@/features/agent/types"

export function authHeaders(settings: ChatSettings, modelId: string): HeadersInit {
  const cfg = getAgentConfig(settings, modelId) || {}
  return {
    "X-Model-Id": modelId,
    ...(cfg.modelName ? { "X-Model-Name": cfg.modelName } : {}),
    ...(cfg.apiKey ? { "X-Api-Key": cfg.apiKey } : {}),
  }
}

export async function fetchModels(): Promise<ModelOption[]> {
  let timeoutId: NodeJS.Timeout | undefined

  try {
    const controller = new AbortController()
    timeoutId = setTimeout(() => {
      console.warn("⚠️ [CLIENT] Models fetch timeout, aborting...")
      controller.abort()
    }, 5000) // Reduced to 5 second timeout

    const res = await fetch("/api/ai/models", {
      signal: controller.signal,
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch models: ${res.status} ${res.statusText}`)
    }

    const json = await res.json()
    const models = (json?.models || []).map((m: any) => ({
      id: m.id,
      label: m.label,
      available: m.available,
    }))

    console.log("✅ [CLIENT] Models fetched successfully:", models.length)
    return models
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn("⚠️ [CLIENT] Models fetch was aborted due to timeout")
      } else {
        console.warn("⚠️ [CLIENT] Failed to fetch models:", error.message)
      }
    } else {
      console.warn("⚠️ [CLIENT] Failed to fetch models with unknown error:", error)
    }

    // Return a comprehensive fallback list
    return [
      { id: "xai:grok-3", label: "Grok-3 (default)", available: true },
      { id: "openai:gpt-4o", label: "GPT-4o (OpenAI)", available: false },
      { id: "anthropic:claude-3-5-sonnet", label: "Claude 3.5 Sonnet", available: false },
    ]
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

// Generic chat call with optional system and extra knowledge overrides.
// Server will apply overrides if provided.
export async function sendChatMessage(params: {
  message: string
  settings: ChatSettings
  modelId: string
  systemOverride?: string
  extraKnowledge?: string
}) {
  const { message, settings, modelId, systemOverride, extraKnowledge } = params
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(settings, modelId),
    ...(systemOverride ? { "X-System": systemOverride } : {}),
    ...(extraKnowledge ? { "X-Knowledge": extraKnowledge } : {}),
  }
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers,
    body: JSON.stringify({ message }),
  })
  if (!res.ok) return { source: "fallback", text: "Boleh, ceritakan dulu kebutuhan Anda?" }
  return await res.json()
}

export async function fetchFollowups(context: string, settings: ChatSettings, modelId: string) {
  try {
    const res = await fetch("/api/ai/followup", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(settings, modelId) },
      body: JSON.stringify({ context }),
    })
    if (!res.ok) return { source: "fallback", questions: "" }
    return await res.json()
  } catch {
    return { source: "fallback", questions: "" }
  }
}
