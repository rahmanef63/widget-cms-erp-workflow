"use client"
import { useState, useCallback, useEffect } from "react"
import { DEFAULT_ASSISTANT_GREETING } from "@/features/agent/constants/ui"
import { loadChatSettings, saveChatSettings, getAgentConfig, setAgentConfig } from "@/shared/settings/chat"
import { fetchModels } from "@/features/agent/lib/client"
import type { ChatMsg, Attachment, ModelOption } from "@/features/agent/types"
import type { CMSSchema } from "@/shared/types/schema"
import { useToast } from "@/shared/hooks/use-toast"

export function useChatManager() {
  const { toast } = useToast()

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
  }, [toast])

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
  }, [settings, modelId, cfgModelName, cfgApiKey, toast])

  // Chat management functions
  const addMessage = useCallback((message: ChatMsg) => {
    setChatMessages(prev => [...prev, message])
  }, [])

  const clearChat = useCallback(() => {
    setChatMessages([{ role: "assistant", content: DEFAULT_ASSISTANT_GREETING, profile: "Assistant" }])
  }, [])

  const updateLastMessage = useCallback((updater: (msg: ChatMsg) => ChatMsg) => {
    setChatMessages(prev => {
      if (prev.length === 0) return prev
      const updated = [...prev]
      updated[updated.length - 1] = updater(updated[updated.length - 1])
      return updated
    })
  }, [])

  // Interview mode management
  const startInterview = useCallback((questions: string[]) => {
    setInterviewQuestions(questions)
    setCurrentQ(0)
    setQaPairs([])
    setInterviewActive(true)
  }, [])

  const endInterview = useCallback(() => {
    setInterviewActive(false)
    setInterviewQuestions([])
    setCurrentQ(0)
    setQaPairs([])
  }, [])

  const nextQuestion = useCallback(() => {
    if (currentQ < interviewQuestions.length - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      endInterview()
    }
  }, [currentQ, interviewQuestions.length, endInterview])

  const addAnswer = useCallback((question: string, answer: string) => {
    setQaPairs(prev => [...prev, { q: question, a: answer }])
    nextQuestion()
  }, [nextQuestion])

  // Attachment management
  const addAttachment = useCallback((attachment: Attachment) => {
    setAttachments(prev => [...prev, attachment])
  }, [])

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearAttachments = useCallback(() => {
    setAttachments([])
  }, [])

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
    startInterview,
    endInterview,
    nextQuestion,
    addAnswer,

    // Two ways
    twoA,
    setTwoA,
    twoB,
    setTwoB,

    // Chat management
    addMessage,
    clearChat,
    updateLastMessage,
    addAttachment,
    removeAttachment,
    clearAttachments,
  }
}
