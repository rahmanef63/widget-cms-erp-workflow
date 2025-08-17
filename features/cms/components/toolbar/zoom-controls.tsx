"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { ZoomIn, ZoomOut, RotateCcw, Maximize } from "lucide-react"
import { ToolbarActions } from "../../lib/actions"

interface ZoomControlsSectionProps {
  zoomLevel: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  onFitToScreen: () => void
}

export function ZoomControlsSection({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitToScreen,
}: ZoomControlsSectionProps) {
  const handleZoomIn = async () => {
    await ToolbarActions.zoomIn(zoomLevel, () => onZoomIn())
  }

  const handleZoomOut = async () => {
    await ToolbarActions.zoomOut(zoomLevel, () => onZoomOut())
  }

  const handleResetZoom = async () => {
    await ToolbarActions.resetZoom(() => onResetZoom())
  }

  const handleFitToScreen = () => {
    ToolbarActions.logAction("fit-screen")
    onFitToScreen()
  }

  return (
    <TooltipProvider>
      <>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleZoomOut}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ZoomOut className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>
        </Button>

        <span className="text-xs font-mono min-w-[3rem] text-center text-muted-foreground">{zoomLevel}%</span>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleZoomIn}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ZoomIn className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
        </Button>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleResetZoom}>
          <Tooltip>
            <TooltipTrigger asChild>
              <RotateCcw className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Reset Zoom</TooltipContent>
          </Tooltip>
        </Button>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleFitToScreen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Maximize className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Fit to Screen</TooltipContent>
          </Tooltip>
        </Button>
      </>
    </TooltipProvider>
  )
}
