"use client"
import { useState, useCallback, useEffect } from "react"
import { DEFAULT_ASSISTANT_GREETING } from "@/features/agent/constants/ui"
import { loadChatSettings, saveChatSettings, getAgentConfig, setAgentConfig } from "@/shared/settings/chat"
import { fetchModels } from "@/features/agent/lib/client"
import type { ChatMsg, Attachment, ModelOption } from "@/features/agent/types"
import type { CMSSchema } from "@/shared/types/schema"
import { toast } from "@/hooks/use-toast"

export function useChatState() {
  // Chat state
  const [aiTyping, setAiTyping] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: DEFAULT_ASSISTANT_GREETING, profile: "Assistant" },
  ])
  const [chatInput, setChatInput] = useState("")
  const [sending, setSending] = useState(false)
  const [autoGenerate, setAutoGenerate] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])

  // Model settings
  const [settings, setSettings] = useState(() => loadChatSettings())
  const [modelId, setModelId] = useState<string>(settings.selectedModelId || "xai:grok-3")
  const [models, setModels] = useState<ModelOption[]>([])
  const [inlineConfigOpen, setInlineConfigOpen] = useState(false)
  const currentCfg = getAgentConfig(settings, modelId) || { id: modelId }
  const [cfgModelName, setCfgModelName] = useState<string>(currentCfg.modelName || "")
  const [cfgApiKey, setCfgApiKey] = useState<string>(currentCfg.apiKey || "")

  // Interview mode
  const [interviewActive, setInterviewActive] = useState(false)
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [qaPairs, setQaPairs] = useState<Array<{ q: string; a: string }>>([])

  // Two ways
  const [twoA, setTwoA] = useState<CMSSchema | null>(null)
  const [twoB, setTwoB] = useState<CMSSchema | null>(null)

  // Models data
  useEffect(() => {
    fetchModels()
      .then(setModels)
      .catch((error) => {
        console.warn("⚠️ [CHAT] Model fetch failed, using fallback:", error)
        setModels([{ id: "xai:grok-3", label: "Grok-3 (default)", available: true }])
        if (error.name !== "AbortError") {
          toast({
            title: "Using default model",
            description: "Could not load all available models, using Grok-3 as default",
            variant: "default",
          })
        }
      })
  }, [])

  const effectiveModels = (
    models.length ? models : [{ id: "xai:grok-3", label: "Grok-3 (default)", available: true }]
  ).map((m) => ({ ...m, available: m.available || Boolean(getAgentConfig(settings, m.id)?.apiKey) }))

  const handlePickModel = useCallback(
    (id: string) => {
      setModelId(id)
      const next = { ...settings, selectedModelId: id }
      setSettings(next)
      saveChatSettings(next)
      const available = effectiveModels.find((m) => m.id === id)?.available || false
      const localKey = Boolean(getAgentConfig(next, id)?.apiKey)
      setInlineConfigOpen(!available && !localKey)
      setCfgModelName(getAgentConfig(next, id)?.modelName || "")
      setCfgApiKey(getAgentConfig(next, id)?.apiKey || "")
    },
    [settings, effectiveModels],
  )

  const persistInlineConfig = useCallback(() => {
    const next = { ...settings }
    setAgentConfig(next, modelId, { modelName: cfgModelName || undefined, apiKey: cfgApiKey || undefined })
    setSettings(next)
    saveChatSettings(next)
    setInlineConfigOpen(false)
    toast({ title: "Saved", description: "Model configuration saved." })
  }, [settings, modelId, cfgModelName, cfgApiKey])

  return {
    // Chat state
    aiTyping,
    setAiTyping,
    chatOpen,
    setChatOpen,
    chatMessages,
    setChatMessages,
    chatInput,
    setChatInput,
    sending,
    setSending,
    autoGenerate,
    setAutoGenerate,
    attachments,
    setAttachments,

    // Model settings
    settings,
    setSettings,
    modelId,
    setModelId,
    models,
    setModels,
    effectiveModels,
    inlineConfigOpen,
    setInlineConfigOpen,
    cfgModelName,
    setCfgModelName,
    cfgApiKey,
    setCfgApiKey,
    handlePickModel,
    persistInlineConfig,

    // Interview mode
    interviewActive,
    setInterviewActive,
    interviewQuestions,
    setInterviewQuestions,
    currentQ,
    setCurrentQ,
    qaPairs,
    setQaPairs,

    // Two ways
    twoA,
    setTwoA,
    twoB,
    setTwoB,
  }
}
