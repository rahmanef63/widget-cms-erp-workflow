"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  Send,
  Settings,
  Paperclip,
  Bot,
  User,
  AlertCircle,
  CheckCircle,
  Copy,
  Sparkles,
  Zap,
  RefreshCw,
  MessageSquare,
  StopCircle,
  Code,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

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

// Progress indicator for AI processing
function AIProgressIndicator({ stage, progress }: { stage: string; progress: number }) {
  return (
    <Card className="mb-4">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
          <span className="text-sm font-medium">AI Processing</span>
        </div>
        <div className="text-xs text-muted-foreground mb-2">{stage}</div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  )
}

// Error display component
function ErrorAlert({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Success indicator
function SuccessAlert({ message }: { message: string }) {
  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">{message}</AlertDescription>
    </Alert>
  )
}

// Function to detect JSON in a message
function hasJsonContent(content: string): boolean {
  return /^\s*[{[]/.test(content) && /[}\]]\s*$/.test(content)
}

export function AgentChatPanel({
  title,
  description,
  modelId,
  models = [],
  onPickModel,
  onOpenConfig,
  prompts = [],
  tools,
  menuGroups = [],
  messages = [],
  aiTyping,
  sending,
  input,
  onChangeInput,
  onSend,
  attachments = [],
  onRemoveAttachment,
  onFilePicked,
  controls,
}: any) {
  const [showPrompts, setShowPrompts] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [aiStage, setAiStage] = useState<string>("")
  const [aiProgress, setAiProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
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

  // Clear error/success after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // Enhanced send function with proper error handling and progress
  const handleSend = async () => {
    if (!input.trim() || sending) return

    setError(null)
    setSuccess(null)
    setIsProcessing(true)
    setAiStage("Preparing request...")
    setAiProgress(10)

    try {
      // Validate input
      if (input.length > 2000) {
        throw new Error("Message too long. Please keep it under 2000 characters.")
      }

      // Check for prohibited content
      if (/(https?:\/\/|www\.)/i.test(input)) {
        throw new Error("Links are not allowed in this chat.")
      }

      setAiStage("Sending to AI model...")
      setAiProgress(30)

      // Call the actual send function
      await onSend()

      setAiStage("Processing response...")
      setAiProgress(70)

      // Simulate processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      setAiStage("Applying to canvas...")
      setAiProgress(90)

      await new Promise((resolve) => setTimeout(resolve, 300))

      setAiProgress(100)
      setSuccess("Message sent successfully!")
    } catch (err: any) {
      console.error("Chat send error:", err)
      setError(err.message || "Failed to send message. Please try again.")
      toast({
        title: "Error",
        description: err.message || "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setAiStage("")
      setAiProgress(0)
    }
  }

  // Enhanced file picker with validation
  const handleFilePicked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10MB.")
      return
    }

    // Validate file type
    const allowedTypes = ["application/json", "text/plain", "text/json"]
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".json")) {
      setError("Only JSON and text files are allowed.")
      return
    }

    try {
      onFilePicked(event)
      setSuccess(`File "${file.name}" attached successfully!`)
    } catch (err: any) {
      setError(`Failed to attach file: ${err.message}`)
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

  // Apply JSON from message
  const applyJsonFromMessage = (content: string) => {
    try {
      setAiStage("Applying JSON to canvas...")
      setAiProgress(50)
      tools.applyJsonFromChat?.()
      setSuccess("JSON applied to canvas successfully!")
    } catch (err: any) {
      setError(`Failed to apply JSON: ${err.message}`)
    } finally {
      setAiStage("")
      setAiProgress(0)
    }
  }

  // Enhanced retry function
  const handleRetry = () => {
    setError(null)
    if (controls.onRetryPreferTool) {
      setIsProcessing(true)
      setAiStage("Retrying with tools...")
      setAiProgress(20)

      try {
        controls.onRetryPreferTool()
        setSuccess("Retry initiated successfully!")
      } catch (err: any) {
        setError(`Retry failed: ${err.message}`)
      } finally {
        setIsProcessing(false)
        setAiStage("")
        setAiProgress(0)
      }
    }
  }

  const selectedModel = models.find((m) => m.id === modelId)
  const isModelAvailable = selectedModel?.available ?? false

  return (
    <SheetContent side="right" className="w-[400px] sm:w-[540px] px-4 py-4 flex flex-col">
      <SheetHeader className="pb-4">
        <SheetTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          {title}
        </SheetTitle>
        <SheetDescription>{description}</SheetDescription>
      </SheetHeader>

      <div className="flex flex-col flex-1 min-h-0">
        {/* Model Selection */}
        <div className="flex items-center gap-2 pb-4">
          <Select value={modelId} onValueChange={onPickModel}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <span>{model.label}</span>
                    {model.available ? (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Config Needed
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={onOpenConfig}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Model Status Alert */}
        {!isModelAvailable && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Model configuration required. Click the settings button to configure.</AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {error && <ErrorAlert error={error} onRetry={handleRetry} />}

        {/* Success Display */}
        {success && <SuccessAlert message={success} />}

        {/* AI Processing Indicator */}
        {isProcessing && <AIProgressIndicator stage={aiStage} progress={aiProgress} />}

        {/* Quick Actions */}
        {menuGroups.length > 0 && (
          <div className="pb-4">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-3">
                <div className="text-xs font-medium text-muted-foreground mb-2">{group.label}</div>
                <div className="flex flex-wrap gap-1">
                  {group.items.map((item, itemIndex) => (
                    <Button
                      key={itemIndex}
                      variant="outline"
                      size="sm"
                      onClick={item.onClick}
                      className="text-xs bg-transparent"
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            <Separator className="my-3" />
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] group relative`}>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.role === "assistant" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      {msg.role === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <div className="text-sm whitespace-pre-wrap">
                          {hasJsonContent(msg.content) ? (
                            <div className="font-mono text-xs overflow-x-auto">
                              <div className="flex items-center gap-1 mb-1 text-muted-foreground">
                                <Code className="h-3 w-3" />
                                <span>JSON Schema</span>
                              </div>
                              {msg.content}
                            </div>
                          ) : (
                            msg.content
                          )}
                        </div>
                        {msg.profile && <div className="text-xs opacity-70 mt-1">{msg.profile}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Message Actions */}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyMessage(msg.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      {msg.role === "assistant" && hasJsonContent(msg.content) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => applyJsonFromMessage(msg.content)}
                        >
                          <Zap className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {aiTyping && <MessageSkeleton />}
          </div>
        </ScrollArea>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="py-3 border-t">
            <div className="text-xs font-medium text-muted-foreground mb-2">Attachments</div>
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => onRemoveAttachment(i)}
                >
                  {attachment.name} ×
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick Prompts */}
        {showPrompts && prompts.length > 0 && (
          <div className="py-3 border-t">
            <div className="text-xs font-medium text-muted-foreground mb-2">Quick Prompts</div>
            <div className="grid gap-2 max-h-32 overflow-y-auto">
              {prompts.map((prompt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start h-auto py-2 text-xs bg-transparent"
                  onClick={() => {
                    onChangeInput(prompt)
                    setShowPrompts(false)
                    inputRef.current?.focus()
                  }}
                >
                  {prompt.length > 60 ? `${prompt.slice(0, 60)}...` : prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="py-3 border-t">
          <div className="flex flex-wrap gap-2 mb-3">
            {prompts.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setShowPrompts(!showPrompts)} className="text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                {showPrompts ? "Hide" : "Show"} Prompts
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isProcessing}
              className="text-xs bg-transparent"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={controls.onAskFollowups}
              disabled={isProcessing}
              className="text-xs bg-transparent"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Followups
            </Button>
            {controls.interviewActive && (
              <Button variant="outline" size="sm" onClick={controls.onEndInterview} className="text-xs bg-transparent">
                <StopCircle className="h-3 w-3 mr-1" />
                End Interview
              </Button>
            )}
          </div>

          {/* Auto Generate Toggle */}
          <div className="flex items-center gap-2 mb-3">
            <Button
              variant={controls.autoGenerate ? "default" : "outline"}
              size="sm"
              onClick={() => controls.onToggleAutoGenerate(!controls.autoGenerate)}
              className="text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Auto Generate: {controls.autoGenerate ? "ON" : "OFF"}
            </Button>
          </div>
        </div>

        {/* Input */}
        <div className="pt-3 border-t">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => onChangeInput(e.target.value)}
                placeholder={isProcessing ? "AI is processing..." : "Type your message..."}
                disabled={sending || isProcessing || !isModelAvailable}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="resize-none"
              />
              <div className="text-xs text-muted-foreground mt-1">{input.length}/2000 characters</div>
            </div>

            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFilePicked} accept=".json,.txt" />
            <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
              <Paperclip className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleSend}
              disabled={sending || isProcessing || !input.trim() || !isModelAvailable}
              className="min-w-[44px]"
            >
              {sending || isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </SheetContent>
  )
}
