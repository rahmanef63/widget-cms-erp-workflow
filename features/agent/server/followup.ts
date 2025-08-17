import { NextResponse } from "next/server"
import { runAgent } from "../agent-core"
import type { ModelId } from "../registry"
import { listModels } from "../registry"

export async function handleFollowup(req: Request, config: { system: string; fallback: string }) {
  try {
    const { context } = (await req.json().catch(() => ({}))) as { context?: string }
    const modelId = (req.headers.get("x-model-id") as ModelId | null) || undefined
    const override = {
      modelName: req.headers.get("x-model-name") || undefined,
      apiKey: req.headers.get("x-api-key") || undefined,
    }

    // Log start of the function
    console.log("[/api/ai/followup] start", {
      modelId,
      hasOverrideKey: Boolean(override.apiKey),
      hasOverrideModel: Boolean(override.modelName),
    })

    // If selected model is not available server-side and no override key, fallback.
    const catalog = listModels()
    const current = catalog.find((m) => m.id === modelId)
    if (modelId && current && !current.available && !override.apiKey) {
      console.warn("[/api/ai/followup] unavailable without key -> using fallback", { modelId })
      return NextResponse.json({ source: "fallback", questions: config.fallback })
    }

    const { text } = await runAgent({
      modelId,
      override,
      system: config.system,
      prompt: [
        "Konteks dari pengguna (opsional):",
        (context || "").slice(0, 2000),
        "",
        "Silakan ajukan 12–18 pertanyaan bernomor. Gunakan kalimat ringkas dan jelas.",
      ].join("\n"),
    })

    // Log summary after runAgent resolves
    console.log("[/api/ai/followup] result", { textLen: (text || "").length })

    return NextResponse.json({ source: "ai", questions: text })
  } catch {
    return NextResponse.json({ source: "fallback", questions: config.fallback })
  }
}
