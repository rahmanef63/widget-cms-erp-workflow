import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Fallback models list to avoid AI SDK dependency issues
const FALLBACK_MODELS = [
  { id: "xai:grok-3", label: "Grok-3", provider: "xai", available: false },
  { id: "xai:grok-3-mini", label: "Grok-3 Mini", provider: "xai", available: false },
  { id: "groq:llama-3.1-70b", label: "Llama 3.1 70B (Groq)", provider: "groq", available: false },
  { id: "groq:llama-3.1-8b", label: "Llama 3.1 8B (Groq)", provider: "groq", available: false },
  { id: "deepinfra:meta-llama-3-70b-instruct", label: "Llama 3 70B (DeepInfra)", provider: "deepinfra", available: false },
  { id: "openai:gpt-4o", label: "GPT-4o (OpenAI)", provider: "openai", available: false },
  { id: "openai:gpt-4o-mini", label: "GPT-4o mini (OpenAI)", provider: "openai", available: false },
  { id: "anthropic:claude-3-5-sonnet", label: "Claude 3.5 Sonnet", provider: "anthropic", available: false },
  { id: "anthropic:claude-3-5-haiku", label: "Claude 3.5 Haiku", provider: "anthropic", available: false },
  { id: "google:gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "google", available: false },
  { id: "google:gemini-1.5-flash", label: "Gemini 1.5 Flash", provider: "google", available: false },
]

export async function GET() {
  try {
    // Try to load the registry dynamically, fall back to static list if it fails
    const { listModels } = await import("@/features/agent/lib/model-registry")
    const models = listModels()
    return NextResponse.json({ models, source: "dynamic" })
  } catch (error) {
    console.warn("Using fallback models due to registry error:", error)
    return NextResponse.json({ models: FALLBACK_MODELS, source: "fallback" })
  }
}
