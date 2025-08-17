import { NextResponse } from "next/server"
import type { Edge, Node } from "reactflow"
import type { CompNodeData, CMSSchema } from "@/shared/types/schema"
import { runAgent } from "@/features/agent/lib/agent-runner"
import type { ModelId } from "@/features/agent/lib/model-registry"
import { CMS_CREATE_SCHEMA_SYSTEM, CMS_CREATE_SCHEMA_INSTRUCTIONS } from "@/features/agent/knowledge/system-prompts"
import { CMS_BASE_KNOWLEDGE } from "@/features/agent/knowledge/base-knowledge"
import { CMS_TOOL_MANIFEST } from "@/features/agent/tool-manifest"
import { getCmsTools, PageSchema } from "@/features/agent/tools"

// (removed hasToolCall import)

import { generateFallbackSchema } from "@/features/agent/lib/fallback-generator"

export async function handleAIGenerate(req: Request) {
  try {
    const { prompt } = (await req.json()) as { prompt: string }
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }

    const modelId = (req.headers.get("x-model-id") as ModelId | null) || undefined
    const override = {
      modelName: req.headers.get("x-model-name") || undefined,
      apiKey: req.headers.get("x-api-key") || undefined,
    }
    const tools = getCmsTools()

    const promptPreview = (prompt || "").slice(0, 160)
    console.log("[/api/ai] handleAIGenerate", {
      modelId,
      hasModelOverride: Boolean(override.modelName),
      hasApiKeyOverride: Boolean(override.apiKey),
      promptLen: (prompt || "").length,
      promptPreview,
    })
    console.time("[/api/ai] generate")

    const { toolResults } = await runAgent({
      modelId,
      override,
      system: [CMS_CREATE_SCHEMA_SYSTEM, CMS_BASE_KNOWLEDGE, CMS_TOOL_MANIFEST].join("\n\n"),
      tools,
      toolChoice: "auto",
      prompt: [
        CMS_CREATE_SCHEMA_INSTRUCTIONS,
        "Return ONLY via createSchema tool call.",
        "If unsure, still propose a minimal valid schema (section > column > text) and connect section -> preview.",
        `User prompt: ${prompt}`,
      ].join("\n"),
    })

    console.timeEnd("[/api/ai] generate")
    console.log("[/api/ai] toolResults", {
      count: toolResults?.length || 0,
      firstType: typeof toolResults?.[0]?.result,
    })

    if (!toolResults || toolResults.length === 0) {
      console.warn("[/api/ai] No tool results received, using fallback")
      const schema = generateFallbackSchema(prompt)
      return NextResponse.json({ source: "fallback", schema })
    }

    const toolResult = toolResults[0]?.result
    console.log("[/api/ai] Raw tool result:", JSON.stringify(toolResult, null, 2))

    if (!toolResult || typeof toolResult !== "object") {
      console.warn("[/api/ai] Invalid tool result format, using fallback")
      const schema = generateFallbackSchema(prompt)
      return NextResponse.json({ source: "fallback", schema })
    }

    const parsed = PageSchema.safeParse(toolResult)
    if (!parsed.success) {
      console.warn("[/api/ai] Zod parse failed, applying fallback", {
        error: parsed.error?.toString?.() || String(parsed.error || "unknown"),
        toolResult: JSON.stringify(toolResult, null, 2),
      })
      const schema = generateFallbackSchema(prompt)
      return NextResponse.json({ source: "fallback", schema })
    }

    console.log("[/api/ai] Successfully parsed schema:", JSON.stringify(parsed.data, null, 2))
    return NextResponse.json({ source: "tool", schema: parsed.data })
  } catch (e: any) {
    console.error("/api/ai error", e)
    const schema = fallbackHeuristic("error")
    return NextResponse.json({ source: "fallback", schema })
  }
}
