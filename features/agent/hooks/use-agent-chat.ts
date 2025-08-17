"use client"
import { useState, useRef } from "react"
import { toast } from "@/shared/hooks/use-toast"

interface Message {
  role: "user" | "assistant"
  content: string
  profile?: string
}

interface UseAgentChatReturn {
  // State
  modelId: string
  setModelId: (id: string) => void
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  input: string
  setInput: (input: string) => void
  sending: boolean
  aiTyping: boolean
  attachments: Array<{ name: string }>
  setAttachments: React.Dispatch<React.SetStateAction<Array<{ name: string }>>>
  error: string | null
  setError: (error: string | null) => void
  success: string | null
  setSuccess: (success: string | null) => void
  aiStage: string
  aiProgress: number
  isProcessing: boolean
  retryWithToolsLoading: boolean
  
  // Refs
  scrollAreaRef: React.RefObject<HTMLDivElement>
  inputRef: React.RefObject<HTMLInputElement>
  fileInputRef: React.RefObject<HTMLInputElement>
  
  // Actions
  handleSend: (eventOrConfig?: any) => Promise<void>
  copyMessage: (content: string) => void
  applyJsonFromMessage: (content: string) => void
  onRemoveAttachment: (index: number) => void
  onRetryWithTools: () => void
}

// Mock data for demonstration
const mockModels = [
  { id: "grok-beta", label: "Grok Beta", available: true },
  { id: "groq-llama", label: "Groq Llama", available: true },
  { id: "gpt-4", label: "GPT-4", available: false },
]

const mockMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Hello! I'm your AI assistant. I can help you with page generation, component building, and various development tasks. What would you like to create today?",
    profile: "Builder Agent",
  },
]

export function useAgentChat(): UseAgentChatReturn {
  // State
  const [modelId, setModelId] = useState("grok-beta")
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [aiTyping, setAiTyping] = useState(false)
  const [attachments, setAttachments] = useState<Array<{ name: string }>>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [aiStage, setAiStage] = useState<string>("")
  const [aiProgress, setAiProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [retryWithToolsLoading, setRetryWithToolsLoading] = useState(false)

  // Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Actions
  const handleSend = async (eventOrConfig?: any) => {
    if (!input.trim() || sending) return

    setError(null)
    setSuccess(null)
    setSending(true)
    setIsProcessing(true)
    setAiStage("Processing your request...")
    setAiProgress(30)

    // Add user message
    const userMessage: Message = { role: "user", content: input, profile: "You" }
    setMessages((prev) => [...prev, userMessage])

    setInput("")

    try {
      // Simulate AI processing
      setAiTyping(true)
      setAiStage("AI is thinking...")
      setAiProgress(70)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add AI response
      const aiResponse: Message = {
        role: "assistant",
        content: `I understand you want to: "${userMessage.content}". I can help you with that!`,
        profile: "Builder Agent",
      }

      setMessages((prev) => [...prev, aiResponse])
      setSuccess("Message sent successfully!")
      setAiProgress(100)
    } catch (err: any) {
      setError("Failed to send message. Please try again.")
    } finally {
      setSending(false)
      setAiTyping(false)
      setIsProcessing(false)
      setAiStage("")
      setAiProgress(0)
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard?.writeText(content)
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    })
  }

  const applyJsonFromMessage = (content: string) => {
    try {
      JSON.parse(content)
      toast({
        title: "Applied",
        description: "JSON schema applied to canvas",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid JSON content",
        variant: "destructive",
      })
    }
  }

  const onRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const onRetryWithTools = async () => {
    setRetryWithToolsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Retry",
        description: "Retrying with enhanced tools",
      })
    } finally {
      setRetryWithToolsLoading(false)
    }
  }

  return {
    // State
    modelId,
    setModelId,
    messages,
    setMessages,
    input,
    setInput,
    sending,
    aiTyping,
    attachments,
    setAttachments,
    error,
    setError,
    success,
    setSuccess,
    aiStage,
    aiProgress,
    isProcessing,
    retryWithToolsLoading,
    
    // Refs
    scrollAreaRef,
    inputRef,
    fileInputRef,
    
    // Actions
    handleSend,
    copyMessage,
    applyJsonFromMessage,
    onRemoveAttachment,
    onRetryWithTools,
  }
}
