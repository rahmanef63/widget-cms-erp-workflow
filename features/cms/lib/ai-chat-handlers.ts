import { toast } from "@/shared/hooks/use-toast"
import { generateSchemaFromPrompt, retryPreferTool, generateVariant } from "@/features/cms/ai/client"
import { sendChatMessage, fetchFollowups } from "@/features/agent/lib/client"
import { clientFallbackHeuristic, tryParseSchemaJson } from "@/features/cms/ai/utils"
import { HOW_TO_ADJUST } from "@/features/cms/ai/constants"

export class AIChatHandlers {
  constructor(
    private cmsState: any,
    private chatState: any,
    private dialogState: any,
  ) {}

  isGreeting(text: string) {
    return /^(hi|hai|halo|hello|hey|ping|test|ok|oke|assalamualaikum|assalamu['']?alaikum)\b/i.test(text.trim())
  }

  isDescriptivePrompt(text: string) {
    const t = text.toLowerCase()
    const keywords = [
      "hero",
      "cta",
      "section",
      "row",
      "column",
      "card",
      "pricing",
      "testimonial",
      "faq",
      "image",
      "button",
      "landing",
      "navbar",
      "footer",
      "alert",
      "badge",
      "avatar",
      "separator",
      "widget",
      "json",
      "schema",
      "apply",
      "terapkan",
      "kirim",
      "two ways",
      "two-ways",
      "dua cara",
      "buatin",
      "buat",
      "bikin",
      "generate",
      "halaman",
      "page",
      "blog",
      "website",
      "landing page",
      "profil",
      "profile",
      "portofolio",
      "portfolio",
      "toko",
      "shop",
      "company",
      "perusahaan",
      "about",
      "tentang",
      "contact",
      "kontak",
    ]
    const hasKeyword = keywords.some((k) => t.includes(k))

    const generationPatterns = [
      /mau\s+(di\s+)?buatin/i,
      /tolong\s+buatin/i,
      /bikinin/i,
      /generate\s+.*page/i,
      /buat\s+.*page/i,
    ]
    const hasGenerationPattern = generationPatterns.some((pattern) => pattern.test(text))

    const words = t.split(/\s+/).filter(Boolean)
    return hasKeyword || hasGenerationPattern || words.length >= 6
  }

  getLastUserText = () =>
    [...this.chatState.chatMessages].reverse().find((m: any) => m.role === "user")?.content ||
    this.chatState.chatInput.trim()

  async sendChat() {
    const text = this.chatState.chatInput.trim()
    if (!text) return

    console.log("🚀 [CHAT] Starting chat flow with message:", text)

    // Stage 1: User sends message
    this.chatState.setChatMessages((m: any) => [...m, { role: "user", content: text }])
    this.chatState.setChatInput("")
    this.chatState.setSending(true)
    this.chatState.setAiTyping(true)

    try {
      // Stage 2: Check for local tool intents
      const t = text.toLowerCase()
      console.log("🔍 [CHAT] Checking for local tool intents...")

      if (
        /(apply|terapkan|kirim).*(json|schema)/i.test(t) ||
        /kirim json( ke)? canvas/i.test(t) ||
        /apply json/i.test(t)
      ) {
        console.log("🛠️ [CHAT] Local tool: Apply JSON from chat")
        this.applyJsonFromChat()
        this.chatState.setChatMessages((m: any) => [
          ...m,
          { role: "assistant", content: "JSON schema applied to canvas.", profile: "Assistant" },
        ])
        return
      }

      if (/(widget).*(json)/i.test(t) || /(buat|create).*(widget).*(json)/i.test(t)) {
        console.log("🛠️ [CHAT] Local tool: Open widget dialog")
        this.dialogState.openWidgetDialog()
        this.chatState.setChatMessages((m: any) => [
          ...m,
          { role: "assistant", content: "Widget dialog opened.", profile: "Assistant" },
        ])
        return
      }

      if (/two[-\s]?ways|dua cara/i.test(t)) {
        console.log("🛠️ [CHAT] Local tool: Generate two ways")
        await this.generateTwoWays()
        return
      }

      if (/(https?:\/\/|www\.)/i.test(text)) {
        throw new Error("Links and media are not allowed in this chat.")
      }

      // Stage 3: Handle interview mode
      if (this.chatState.interviewActive && this.chatState.interviewQuestions[this.chatState.currentQ]) {
        console.log("📝 [CHAT] Interview mode: Processing answer")
        this.chatState.setQaPairs((pairs: any) => [
          ...pairs,
          { q: this.chatState.interviewQuestions[this.chatState.currentQ], a: text },
        ])
        const nextIndex = this.chatState.currentQ + 1
        if (nextIndex < this.chatState.interviewQuestions.length) {
          setTimeout(() => {
            this.chatState.setChatMessages((m: any) => [
              ...m,
              { role: "assistant", content: this.chatState.interviewQuestions[nextIndex], profile: "Assistant" },
            ])
            this.chatState.setCurrentQ(nextIndex)
            this.chatState.setAiTyping(false)
          }, 400)
        } else {
          setTimeout(() => {
            this.chatState.setChatMessages((m: any) => [
              ...m,
              {
                role: "assistant",
                content:
                  "Terima kasih. Ketik 'generate' untuk membangun halaman dari jawaban Anda, atau tambah detail lain.",
                profile: "Assistant",
              },
            ])
            this.chatState.setInterviewActive(false)
            this.chatState.setAiTyping(false)
          }, 450)
        }
        return
      }

      // Stage 4: Generate from Q&A summary
      if (!this.chatState.interviewActive && this.chatState.qaPairs.length > 0 && /^generate$/i.test(text)) {
        console.log("🏗️ [CHAT] Generating from Q&A summary")
        const summary = this.chatState.qaPairs.map((p: any, i: number) => `${i + 1}. ${p.q}\n   - ${p.a}`).join("\n")
        const assist = [
          "Generate landing structure based on the following business details:",
          summary,
          "",
          "Constraints:",
          HOW_TO_ADJUST,
        ].join("\n")

        const schema = await generateSchemaFromPrompt(assist, this.chatState.settings, this.chatState.modelId)
        if (!schema) {
          console.log("❌ [CHAT] Schema generation failed, using fallback")
          this.cmsState.applySchema(clientFallbackHeuristic("landing"))
          this.chatState.setChatMessages((m: any) => [
            ...m,
            { role: "assistant", content: "Server unavailable. Saya terapkan fallback.", profile: "Assistant" },
          ])
        } else {
          console.log("✅ [CHAT] Schema generated successfully from Q&A")
          this.cmsState.applySchema(schema)
          this.chatState.setChatMessages((m: any) => [
            ...m,
            { role: "assistant", content: "Schema generated dari jawaban Anda.", profile: "Assistant" },
          ])
        }
        return
      }

      // Stage 5: Determine if it's a greeting or descriptive prompt
      const looksLikeGreeting = this.isGreeting(text)
      const descriptive = this.isDescriptivePrompt(text)

      console.log("🤔 [CHAT] Message analysis:", {
        looksLikeGreeting,
        descriptive,
        autoGenerate: this.chatState.autoGenerate,
      })

      if ((looksLikeGreeting || !descriptive) && !this.chatState.autoGenerate) {
        // Stage 6: Send to chat API for conversation
        console.log("💬 [CHAT] Sending to chat API for conversation")
        const res = await sendChatMessage({
          message: text,
          settings: this.chatState.settings,
          modelId: this.chatState.modelId,
        })
        console.log("💬 [CHAT] Chat API response:", res)
        this.chatState.setChatMessages((m: any) => [
          ...m,
          { role: "assistant", content: res?.text || "Sorry, I couldn't process that.", profile: "Assistant" },
        ])
        return
      }

      // Stage 7: Generate schema directly
      console.log("🏗️ [CHAT] Generating schema from prompt")
      const schema = await generateSchemaFromPrompt(text, this.chatState.settings, this.chatState.modelId)

      if (!schema) {
        console.log("❌ [CHAT] Schema generation failed, using fallback")
        const fallbackSchema = clientFallbackHeuristic(text)
        console.log("🔄 [CHAT] Applying fallback schema:", fallbackSchema)
        this.cmsState.applySchema(fallbackSchema)
        this.chatState.setChatMessages((m: any) => [
          ...m,
          {
            role: "assistant",
            content: "Server unavailable. Saya terapkan layout dasar sebagai fallback.",
            profile: "Assistant",
          },
        ])
      } else {
        console.log("✅ [CHAT] Schema generated successfully, applying to canvas:", schema)
        this.cmsState.applySchema(schema)
        this.chatState.setChatMessages((m: any) => [
          ...m,
          {
            role: "assistant",
            content: "Schema generated dan diterapkan. Silakan tweak di inspector.",
            profile: "Assistant",
          },
        ])
      }
    } catch (error: any) {
      console.error("❌ [CHAT] Error in chat flow:", error)
      this.chatState.setChatMessages((m: any) => [
        ...m,
        {
          role: "assistant",
          content: `Error: ${error.message || "Something went wrong. Please try again."}`,
          profile: "Assistant",
        },
      ])
      toast({
        title: "Chat Error",
        description: error.message || "Failed to process message",
        variant: "destructive",
      })
    } finally {
      console.log("🏁 [CHAT] Chat flow completed")
      this.chatState.setSending(false)
      this.chatState.setAiTyping(false)
    }
  }

  async generateTwoWays() {
    const base = this.chatState.chatInput.trim() || this.getLastUserText()
    if (!base) {
      toast({ title: "No prompt", description: "Ketik kebutuhan halaman dulu, mis. 'profile page sederhana'." })
      return
    }
    this.dialogState.setTwoBusy(true)
    this.dialogState.setTwoWaysOpen(true)
    this.dialogState.setTwoA(null)
    this.dialogState.setTwoB(null)

    try {
      console.log("🔄 [CHAT] Generating two variants for:", base)

      const [a, b] = await Promise.all([
        generateVariant(
          base,
          "Centered hero; single-column content; prominent avatar and CTA.",
          this.chatState.settings,
          this.chatState.modelId,
        ),
        generateVariant(
          base,
          "Two-column layout; sidebar profile card on left; content on right.",
          this.chatState.settings,
          this.chatState.modelId,
        ),
      ])

      console.log("✅ [CHAT] Two variants generated:", { variantA: !!a, variantB: !!b })

      this.dialogState.setTwoA(a)
      this.dialogState.setTwoB(b)

      this.chatState.setChatMessages((m: any) => [
        ...m,
        {
          role: "assistant",
          content: "Dua variasi layout telah dibuat. Silakan pilih yang Anda sukai.",
          profile: "Assistant",
        },
      ])
    } catch (error) {
      console.error("❌ [CHAT] Error generating two ways:", error)
      this.chatState.setChatMessages((m: any) => [
        ...m,
        {
          role: "assistant",
          content: "Maaf, gagal membuat dua variasi layout. Silakan coba lagi.",
          profile: "Assistant",
        },
      ])
      toast({
        title: "Generation Error",
        description: "Failed to generate layout variants",
        variant: "destructive",
      })
    } finally {
      this.dialogState.setTwoBusy(false)
    }
  }

  async retryWithTools() {
    const text = this.chatState.chatInput.trim() || this.getLastUserText()
    if (!text) {
      toast({ title: "Nothing to retry", description: "Kirim prompt terlebih dahulu." })
      return
    }

    console.log("🔄 [CHAT] Retrying with tool preference:", text)
    this.chatState.setSending(true)
    this.chatState.setAiTyping(true)

    try {
      const schema = await retryPreferTool(text, this.chatState.settings, this.chatState.modelId)

      if (!schema) {
        console.log("❌ [CHAT] Retry failed, using fallback")
        const fallbackSchema = clientFallbackHeuristic(text)
        console.log("🔄 [CHAT] Applying fallback schema:", fallbackSchema)
        this.cmsState.applySchema(fallbackSchema)
        this.chatState.setChatMessages((m: any) => [
          ...m,
          { role: "assistant", content: "Retry gagal. Fallback diterapkan.", profile: "Assistant" },
        ])
      } else {
        console.log("✅ [CHAT] Retry successful, applying schema:", schema)
        this.cmsState.applySchema(schema)
        this.chatState.setChatMessages((m: any) => [
          ...m,
          { role: "assistant", content: "Schema berhasil dibuat via tool (retry).", profile: "Assistant" },
        ])
      }
    } catch (error) {
      console.error("❌ [CHAT] Error in retry with tools:", error)
      this.chatState.setChatMessages((m: any) => [
        ...m,
        {
          role: "assistant",
          content: "Maaf, retry gagal. Silakan coba lagi dengan prompt yang berbeda.",
          profile: "Assistant",
        },
      ])
      toast({
        title: "Retry Error",
        description: "Failed to retry with tool preference",
        variant: "destructive",
      })
    } finally {
      this.chatState.setSending(false)
      this.chatState.setAiTyping(false)
    }
  }

  async askFollowups() {
    this.chatState.setChatOpen(true)
    this.chatState.setSending(true)
    this.chatState.setAiTyping(true)

    try {
      console.log("🔄 [CHAT] Asking followup questions")
      const lastUser = [...this.chatState.chatMessages].reverse().find((m: any) => m.role === "user")?.content || ""
      const data = await fetchFollowups(lastUser, this.chatState.settings, this.chatState.modelId)
      const questionsText =
        data?.questions || "1. What's the main purpose?\n2. Who's the target audience?\n3. What style do you prefer?"
      const qs = questionsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.replace(/^\d+\)\s*/, ""))

      console.log("✅ [CHAT] Followup questions received:", qs)

      if (!qs.length) {
        this.chatState.setChatMessages((m: any) => [
          ...m,
          { role: "assistant", content: "What would you like to know more about?", profile: "Assistant" },
        ])
        this.chatState.setInterviewActive(false)
      } else {
        this.chatState.setInterviewQuestions(qs)
        this.chatState.setQaPairs([])
        this.chatState.setCurrentQ(0)
        this.chatState.setInterviewActive(true)
        this.chatState.setChatMessages((m: any) => [
          ...m,
          { role: "assistant", content: "Baik, mari tanya jawab singkat. Jawab ringkas ya.", profile: "Assistant" },
          { role: "assistant", content: qs[0], profile: "Assistant" },
        ])
      }
    } catch (error) {
      console.error("❌ [CHAT] Error fetching followups:", error)
      this.chatState.setChatMessages((m: any) => [
        ...m,
        {
          role: "assistant",
          content: "Maaf, gagal mendapatkan pertanyaan lanjutan. Silakan coba lagi.",
          profile: "Assistant",
        },
      ])
      toast({
        title: "Followup Error",
        description: "Failed to fetch followup questions",
        variant: "destructive",
      })
    } finally {
      this.chatState.setSending(false)
      this.chatState.setAiTyping(false)
    }
  }

  endInterview() {
    if (!this.chatState.interviewActive) return
    this.chatState.setInterviewActive(false)
    this.chatState.setChatMessages((m: any) => [
      ...m,
      {
        role: "assistant",
        content: "Wawancara dihentikan. Anda bisa lanjut perintah bebas atau ketik 'generate' untuk membuat halaman.",
        profile: "Assistant",
      },
    ])
  }

  applyJsonFromChat() {
    try {
      console.log("🔄 [CHAT] Applying JSON from chat")
      const candidate = /^\s*[{[]/.test(this.chatState.chatInput.trim())
        ? this.chatState.chatInput
        : [...this.chatState.chatMessages].reverse().find((m: any) => m.role === "assistant")?.content || ""

      console.log("🔍 [CHAT] Looking for JSON in:", candidate.slice(0, 50) + "...")
      const parsed = tryParseSchemaJson(candidate)

      if (!parsed) {
        console.log("❌ [CHAT] No valid JSON found in chat")
        toast({
          title: "No valid JSON found",
          description: "Paste JSON into the input or ask the assistant to output a JSON schema.",
        })
        return
      }

      console.log("✅ [CHAT] Valid JSON found, applying to canvas:", parsed)
      this.cmsState.applySchema(parsed)
      this.chatState.setChatMessages((m: any) => [
        ...m,
        { role: "assistant", content: "JSON schema applied to canvas.", profile: "Assistant" },
      ])
    } catch (error) {
      console.error("❌ [CHAT] Error applying JSON from chat:", error)
      toast({
        title: "JSON Error",
        description: "Failed to apply JSON from chat",
        variant: "destructive",
      })
    }
  }
}
