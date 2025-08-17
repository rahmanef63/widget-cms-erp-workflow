"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Move, Lock, Grid3X3 } from "lucide-react"
import { ToolbarActions } from "../../lib/actions"

interface CanvasControlsSectionProps {
  isPanMode: boolean
  isLocked: boolean
  showGrid: boolean
  onTogglePan: () => void
  onToggleLock: () => void
  onToggleGrid: () => void
}

export function CanvasControlsSection({
  isPanMode,
  isLocked,
  showGrid,
  onTogglePan,
  onToggleLock,
  onToggleGrid,
}: CanvasControlsSectionProps) {
  const handleTogglePan = () => {
    ToolbarActions.logAction("toggle-pan", { currentState: isPanMode })
    onTogglePan()
  }

  const handleToggleLock = () => {
    ToolbarActions.logAction("toggle-lock", { currentState: isLocked })
    onToggleLock()
  }

  const handleToggleGrid = async () => {
    await ToolbarActions.toggleGrid(showGrid, onToggleGrid)
  }

  return (
    <TooltipProvider>
      <>
        <Button variant={isPanMode ? "default" : "ghost"} size="sm" className="h-8 w-8 p-0" onClick={handleTogglePan}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Move className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Pan Mode</TooltipContent>
          </Tooltip>
        </Button>

        <Button variant={isLocked ? "default" : "ghost"} size="sm" className="h-8 w-8 p-0" onClick={handleToggleLock}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Lock className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Lock Canvas</TooltipContent>
          </Tooltip>
        </Button>

        <Button variant={showGrid ? "default" : "ghost"} size="sm" className="h-8 w-8 p-0" onClick={handleToggleGrid}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Grid3X3 className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>
        </Button>
      </>
    </TooltipProvider>
  )
}
