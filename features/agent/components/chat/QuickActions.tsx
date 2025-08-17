"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sparkles, MessageSquare, RefreshCw } from "lucide-react"

interface QuickActionsProps {
  onRetryWithTools?: () => void
  onRetryWithToolsLoading?: boolean
}

export function QuickActions({ onRetryWithTools, onRetryWithToolsLoading }: QuickActionsProps) {
  return (
    <div className="py-3 border-t">
      <div className="text-xs font-medium text-muted-foreground mb-2">Quick Actions</div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onRetryWithTools} disabled={onRetryWithToolsLoading}>
          {onRetryWithToolsLoading ? (
            <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3 mr-1.5" />
          )}
          Retry with Tools
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          <MessageSquare className="h-3 w-3 mr-1.5" />
          Interview Mode
        </Button>
      </div>
    </div>
  )
}
