"use client"
import { Bot } from "lucide-react"

export function MessageSkeleton() {
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
