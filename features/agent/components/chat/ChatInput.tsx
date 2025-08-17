"use client"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Paperclip } from "lucide-react"

interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

interface ChatInputProps {
  input: string
  onChangeInput: (value: string) => void
  onSend: () => void
  sending: boolean
  isProcessing: boolean
  isModelAvailable: boolean
  attachments: Attachment[]
  onRemoveAttachment: (index: number) => void
  onFilePicked: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function ChatInput({
  input,
  onChangeInput,
  onSend,
  sending,
  isProcessing,
  isModelAvailable,
  attachments,
  onRemoveAttachment,
  onFilePicked,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="space-y-3">
      {/* Attachments */}
      {attachments.length > 0 && (
        <div>
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

      {/* Input */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            value={input}
            onChange={(e) => onChangeInput(e.target.value)}
            placeholder={isProcessing ? "AI is processing..." : "Type your message..."}
            disabled={sending || isProcessing || !isModelAvailable}
            onKeyDown={handleKeyDown}
            className="resize-none"
          />
          <div className="text-xs text-muted-foreground mt-1">{input.length}/2000 characters</div>
        </div>

        <input type="file" className="hidden" ref={fileInputRef} onChange={onFilePicked} accept=".json,.txt" />
        <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
          <Paperclip className="h-4 w-4" />
        </Button>

        <Button
          onClick={onSend}
          disabled={sending || isProcessing || !input.trim() || !isModelAvailable}
          className="min-w-[44px]"
        >
          {sending || isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
