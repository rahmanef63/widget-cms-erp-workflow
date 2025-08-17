"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Eye, Settings } from "lucide-react"
import { ToolbarActions } from "../../lib/actions"

interface PreviewActionsSectionProps {
  onPreview?: () => void
  onSettings?: () => void
}

export function PreviewActionsSection({ onPreview, onSettings }: PreviewActionsSectionProps) {
  const handlePreview = () => {
    ToolbarActions.logAction("preview")
    onPreview?.()
  }

  const handleSettings = () => {
    ToolbarActions.logAction("settings")
    onSettings?.()
  }

  return (
    <TooltipProvider>
      <>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handlePreview}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Eye className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>
        </Button>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleSettings}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Settings className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </Button>
      </>
    </TooltipProvider>
  )
}
