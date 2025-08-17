"use client"

import { useState, useCallback } from "react"

export interface CMSChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function useCMSChat() {
  const [messages, setMessages] = useState<CMSChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: CMSChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // AI chat logic would go here
      const assistantMessage: CMSChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "AI response placeholder",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  }
}
