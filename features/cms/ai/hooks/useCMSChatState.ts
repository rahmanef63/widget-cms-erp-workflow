"use client"

import { useState, useCallback } from "react"
import type { CMSChatState } from "../types"

export function useCMSChatState(): CMSChatState & {
  setIncludeChildren: (value: boolean) => void
  setChatOpen: (value: boolean) => void
  setChatInput: (value: string) => void
  setSending: (value: boolean) => void
  setAiTyping: (value: boolean) => void
  addMessage: (message: any) => void
  clearMessages: () => void
  setAutoGenerate: (value: boolean) => void
  setInterviewActive: (value: boolean) => void
} {
  const [state, setState] = useState<CMSChatState>({
    // Chat state
    aiTyping: false,
    chatOpen: false,
    chatMessages: [],
    chatInput: "",
    sending: false,
    autoGenerate: false,
    attachments: [],

    // Context-aware features
    includeChildren: false,
    contextMode: "global",

    // Model settings
    settings: {},
    modelId: "grok-beta",
    models: [],
    effectiveModels: [],
    inlineConfigOpen: false,
    cfgModelName: "",
    cfgApiKey: "",

    // Interview mode
    interviewActive: false,
    interviewQuestions: [],
    currentQ: 0,
    qaPairs: [],

    // Two ways
    twoA: null,
    twoB: null,
  })

  const setIncludeChildren = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, includeChildren: value }))
  }, [])

  const setChatOpen = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, chatOpen: value }))
  }, [])

  const setChatInput = useCallback((value: string) => {
    setState((prev) => ({ ...prev, chatInput: value }))
  }, [])

  const setSending = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, sending: value }))
  }, [])

  const setAiTyping = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, aiTyping: value }))
  }, [])

  const addMessage = useCallback((message: any) => {
    setState((prev) => ({ ...prev, chatMessages: [...prev.chatMessages, message] }))
  }, [])

  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, chatMessages: [] }))
  }, [])

  const setAutoGenerate = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, autoGenerate: value }))
  }, [])

  const setInterviewActive = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, interviewActive: value }))
  }, [])

  return {
    ...state,
    setIncludeChildren,
    setChatOpen,
    setChatInput,
    setSending,
    setAiTyping,
    addMessage,
    clearMessages,
    setAutoGenerate,
    setInterviewActive,
  }
}
