"use client"
import { useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Bot, User, Copy, Code, Zap } from "lucide-react"
import { useToast } from "@/shared/hooks/use-toast"

interface Message {
  role: "user" | "assistant"
  content: string
  profile?: string
}

interface MessageListProps {
  messages: Message[]
  aiTyping: boolean
  onCopyMessage: (content: string) => void
  onApplyJsonFromMessage: (content: string) => void
}

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

export function MessageList({ messages, aiTyping, onCopyMessage, onApplyJsonFromMessage }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, aiTyping])

  const handleCopyMessage = (content: string) => {
    onCopyMessage(content)
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    })
  }

  return (
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
                    onClick={() => handleCopyMessage(msg.content)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  {msg.role === "assistant" && hasJsonContent(msg.content) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onApplyJsonFromMessage(msg.content)}
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
  )
}
