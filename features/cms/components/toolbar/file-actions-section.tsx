"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Save, FolderOpen, RotateCcw } from "lucide-react"
import { ToolbarActions } from "../../lib/actions"

interface FileActionsSectionProps {
  onSave?: () => void
  onLoad?: () => void
  onRefreshPreview?: () => void
}

export function FileActionsSection({ onSave, onLoad, onRefreshPreview }: FileActionsSectionProps) {
  const handleSave = () => {
    ToolbarActions.logAction("save")
    onSave?.()
  }

  const handleLoad = () => {
    ToolbarActions.logAction("load")
    onLoad?.()
  }

  const handleRefresh = async () => {
    await ToolbarActions.refreshPreview(onRefreshPreview)
  }

  return (
    <TooltipProvider>
      <>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleSave}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Save className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Save</TooltipContent>
          </Tooltip>
        </Button>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleLoad}>
          <Tooltip>
            <TooltipTrigger asChild>
              <FolderOpen className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Load</TooltipContent>
          </Tooltip>
        </Button>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleRefresh}>
          <Tooltip>
            <TooltipTrigger asChild>
              <RotateCcw className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Refresh Preview</TooltipContent>
          </Tooltip>
        </Button>
      </>
    </TooltipProvider>
  )
}
