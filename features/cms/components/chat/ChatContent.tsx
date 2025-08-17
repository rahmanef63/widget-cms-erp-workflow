"use client"
import { useState, useRef, useEffect } from "react"
import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, Send, Settings, Paperclip, Bot, User, Copy, Code, Component, Layers } from "lucide-react"
import { useToast } from "@/shared/hooks/use-toast"

interface CMSAgentChatContentProps {
  selectedNode?: Node<CompNodeData>
  includeChildren?: boolean
  onIncludeChildrenChange?: (value: boolean) => void
  onSend?: (context?: { selectedNode?: Node<CompNodeData>; includeChildren: boolean }) => void
}

// Mock data for demonstration
const mockModels = [
  { id: "grok-beta", label: "Grok Beta", available: true },
  { id: "groq-llama", label: "Groq Llama", available: true },
  { id: "gpt-4", label: "GPT-4", available: false },
]

const mockMessages = [
  {
    role: "assistant" as const,
    content:
      "Hello! I'm your CMS AI assistant. I can help you build and modify your CMS components with context awareness. What would you like to create today?",
    profile: "CMS Assistant",
  },
]

// Loading skeleton component
function MessageSkeleton() {
  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-lg px-3 py-2 max-w-[80%]">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 animate-pulse" />
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Function to detect JSON in a message
function hasJsonContent(content: string): boolean {
  return /^\s*[{[]/.test(content) && /[}\]]\s*$/.test(content)
}

// CMS Agent utility functions
class CMSAgentUtils {
  static createContextPrompt(selectedNode: CompNodeData | null, includeChildren = false): string {
    if (!selectedNode) {
      return "You are helping with a CMS page builder. No specific component is selected."
    }

    let context = `You are helping with a CMS page builder. Currently selected component:
- Type: ${selectedNode.type}
- Label: ${selectedNode.label}
- Properties: ${JSON.stringify(selectedNode.props, null, 2)}`

    if (
      includeChildren &&
      selectedNode.children &&
      Array.isArray(selectedNode.children) &&
      selectedNode.children.length > 0
    ) {
      context += `\n- Children components: ${selectedNode.children.length} items`
      selectedNode.children.forEach((child, index) => {
        if (child && child.type && child.label) {
          context += `\n  ${index + 1}. ${child.type} (${child.label})`
        }
      })
    }

    context += "\n\nPlease provide assistance specific to this component and its context within the CMS."
    return context
  }

  static enhancePrompt(originalPrompt: string, contextPrompt: string): string {
    return `${contextPrompt}\n\nUser request: ${originalPrompt}`
  }
}

export function CMSAgentChatContent({
  selectedNode,
  includeChildren = false,
  onIncludeChildrenChange = () => {},
  onSend = () => {},
}: CMSAgentChatContentProps) {
  const [modelId, setModelId] = useState("grok-beta")
  const [messages, setMessages] = useState(mockMessages)
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [aiTyping, setAiTyping] = useState(false)
  const [attachments, setAttachments] = useState<Array<{ name: string }>>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [aiStage, setAiStage] = useState<string>("")
  const [aiProgress, setAiProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, aiTyping])

  // Enhanced send function with context
  const handleSend = async () => {
    if (!input.trim() || sending) return

    setError(null)
    setSuccess(null)
    setSending(true)
    setIsProcessing(true)
    setAiStage("Processing your request...")
    setAiProgress(30)

    // Add user message
    const userMessage = { role: "user" as const, content: input, profile: "You" }
    setMessages((prev) => [...prev, userMessage])

    // Create context for the AI using CMSAgentUtils
    const contextPrompt = selectedNode
      ? CMSAgentUtils.createContextPrompt(selectedNode.data, includeChildren)
      : "You are helping with a CMS page builder. No specific component is selected."

    const enhancedPrompt = CMSAgentUtils.enhancePrompt(input, contextPrompt)

    setInput("")

    try {
      // Simulate AI processing
      setAiTyping(true)
      setAiStage("CMS AI is analyzing context...")
      setAiProgress(70)

      // Call the context-aware send function
      const context = selectedNode ? { selectedNode, includeChildren } : undefined
      await onSend(context)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add AI response with context awareness
      const contextInfo = selectedNode
        ? `Working with ${selectedNode.data.componentType || selectedNode.data.type} "${selectedNode.data.label}"${includeChildren ? " (including children)" : ""}`
        : "Global CMS context"

      const aiResponse = {
        role: "assistant" as const,
        content: `I understand you want to: "${input}". Context: ${contextInfo}. I can help you create or modify CMS components with this context in mind.`,
        profile: "CMS Assistant",
      }

      setMessages((prev) => [...prev, aiResponse])
      setSuccess("Message sent with context!")
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

  // Copy message content
  const copyMessage = (content: string) => {
    navigator.clipboard?.writeText(content)
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    })
  }

  const selectedModel = mockModels.find((m) => m.id === modelId)
  const isModelAvailable = selectedModel?.available ?? false

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Model Selection */}
      <div className="flex items-center gap-2 pb-3">
        <Select value={modelId} onValueChange={setModelId}>
          <SelectTrigger className="flex-1 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mockModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex items-center gap-2">
                  <span className="text-xs">{model.label}</span>
                  {model.available ? (
                    <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-800">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      Config Needed
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
          <Settings className="h-3 w-3" />
        </Button>
      </div>

      {/* Context Display */}
      {selectedNode && (
        <Card className="mb-3">
          <CardContent className="p-2">
            <div className="flex items-center gap-2 mb-2">
              <Component className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium">
                Context: {selectedNode.data.componentType || selectedNode.data.type}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {selectedNode.data.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="include-children"
                checked={includeChildren}
                onCheckedChange={onIncludeChildrenChange}
                className="scale-75"
              />
              <Label htmlFor="include-children" className="text-[10px] text-muted-foreground">
                Include children components
              </Label>
              <Layers className="h-2 w-2 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 pr-2" ref={scrollAreaRef}>
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] group relative`}>
                <div
                  className={`rounded-lg px-2 py-1.5 text-xs ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border"
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    {msg.role === "assistant" && <Bot className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                    {msg.role === "user" && <User className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap">
                        {hasJsonContent(msg.content) ? (
                          <div className="font-mono text-[10px] overflow-x-auto">
                            <div className="flex items-center gap-1 mb-1 text-muted-foreground">
                              <Code className="h-2 w-2" />
                              <span>JSON Schema</span>
                            </div>
                            {msg.content}
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                      {msg.profile && <div className="text-[10px] opacity-70 mt-0.5">{msg.profile}</div>}
                    </div>
                  </div>
                </div>

                {/* Message Actions */}
                <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => copyMessage(msg.content)}>
                    <Copy className="h-2 w-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* AI Typing Indicator */}
          {aiTyping && <MessageSkeleton />}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="pt-2 border-t">
        <div className="flex items-end gap-1">
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isProcessing
                  ? "CMS AI is processing..."
                  : selectedNode
                    ? `Ask about ${selectedNode.data.componentType || selectedNode.data.type}...`
                    : "Type your message..."
              }
              disabled={sending || isProcessing || !isModelAvailable}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              className="h-8 text-xs resize-none"
            />
            <div className="text-[10px] text-muted-foreground mt-0.5">{input.length}/2000</div>
          </div>

          <input type="file" className="hidden" ref={fileInputRef} accept=".json,.txt" />
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            <Paperclip className="h-3 w-3" />
          </Button>

          <Button
            onClick={handleSend}
            disabled={sending || isProcessing || !input.trim() || !isModelAvailable}
            className="h-8 w-8 p-0"
          >
            {sending || isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
