import { NextResponse } from "next/server"
import type { ModelId } from "@/features/agent/registry"
import { runAgent } from "@/features/agent/agent-core"
import { CMS_BASE_KNOWLEDGE } from "@/features/agent/base-knowledge"
import { CMS_FAQ_EXAMPLES } from "@/features/agent/faq"

export const dynamic = "force-dynamic"

const CHAT_SYSTEM = [
  "Anda adalah asisten percakapan untuk perancang halaman/CMS.",
  "Tujuan: berdiskusi dan menjawab pertanyaan tentang CMS builder. Ajukan klarifikasi saat perlu.",
  "Gunakan bahasa Indonesia jika pengguna berbahasa Indonesia. Jawab ringkas dan to the point.",
  "",
  "Knowledge:",
  CMS_BASE_KNOWLEDGE,
  "",
  "FAQ Contoh:",
  CMS_FAQ_EXAMPLES,
].join("\n")

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as { message: string }
    const modelId = (req.headers.get("x-model-id") as ModelId | null) || undefined
    const override = {
      modelName: req.headers.get("x-model-name") || undefined,
      apiKey: req.headers.get("x-api-key") || undefined,
    }

    const systemHeader = req.headers.get("x-system") || req.headers.get("X-System") || undefined
    const extraKnowledge = req.headers.get("x-knowledge") || req.headers.get("X-Knowledge") || undefined
    const EFFECTIVE_SYSTEM = systemHeader ? systemHeader : [CHAT_SYSTEM, extraKnowledge].filter(Boolean).join("\n")

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 })
    }

    console.log("[/api/ai/chat] start", {
      modelId,
      hasOverrideKey: Boolean(override.apiKey),
      hasOverrideModel: Boolean(override.modelName),
      messagePreview: message.slice(0, 160),
    })
    const { text } = await runAgent({
      modelId,
      override,
      system: EFFECTIVE_SYSTEM,
      prompt: message,
      // no tools; pure chat
      toolChoice: "none",
    })
    console.log("[/api/ai/chat] result", { textLen: (text || "").length })
    return NextResponse.json({ source: "ai", text })
  } catch (e) {
    console.error("[/api/ai/chat] error", e)
    return NextResponse.json({ source: "fallback", text: "Boleh, ceritakan dulu kebutuhan halaman yang ingin dibuat?" })
  }
}
