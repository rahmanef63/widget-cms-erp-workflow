"use client"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  Send,
  Paperclip,
  AlertCircle,
  CheckCircle,
  StopCircle,
} from "lucide-react"

// Import smaller components
import { ChatInput } from "./chat/ChatInput"
import { MessageList } from "./chat/MessageList"
import { ModelSelector } from "./chat/ModelSelector"
import { QuickActions } from "./chat/QuickActions"
import { AttachmentList } from "./chat/AttachmentList"
import { MessageSkeleton } from "./chat/MessageSkeleton"

// Import custom hook
import { useAgentChat } from "../hooks/use-agent-chat"

interface AgentChatPanelProps {
  onApplySchema?: (schema: any) => void
  onClose?: () => void
}

export function AgentChatPanel({ onApplySchema, onClose }: AgentChatPanelProps) {
  const {
    // State
    modelId,
    setModelId,
    messages,
    input,
    setInput,
    sending,
    aiTyping,
    attachments,
    error,
    success,
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
  } = useAgentChat()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, aiTyping])

  return (
    <SheetContent className="w-[500px] sm:w-[600px] flex flex-col min-h-0 p-0">
      <SheetHeader className="px-6 py-4 border-b bg-muted/20">
        <SheetTitle className="text-lg font-semibold">AI Assistant</SheetTitle>
        <SheetDescription className="text-sm text-muted-foreground">
          Get help with page generation, component building, and development tasks
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 flex flex-col min-h-0 px-6">
        {/* Model Selection */}
        <div className="py-4 border-b">
          <ModelSelector modelId={modelId} onModelChange={setModelId} />
        </div>

        {/* Progress Indicator */}
        {isProcessing && (
          <div className="py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">{aiStage}</div>
                <Progress value={aiProgress} className="h-1.5" />
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <StopCircle className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <Alert variant="destructive" className="my-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="my-3 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 pr-2 py-4" ref={scrollAreaRef}>
          <MessageList 
            messages={messages} 
            aiTyping={aiTyping}
            onCopyMessage={copyMessage}
            onApplyJson={applyJsonFromMessage}
          />
        </ScrollArea>

        {/* Attachments */}
        <AttachmentList 
          attachments={attachments} 
          onRemoveAttachment={onRemoveAttachment} 
        />

        {/* Quick Actions */}
        <QuickActions 
          onRetryWithTools={onRetryWithTools}
          onRetryWithToolsLoading={retryWithToolsLoading}
        />

        {/* Input */}
        <div className="py-4 border-t">
          <ChatInput
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            sending={sending}
            isProcessing={isProcessing}
            modelId={modelId}
            inputRef={inputRef}
            fileInputRef={fileInputRef}
          />
        </div>
      </div>
    </SheetContent>
  )
}
