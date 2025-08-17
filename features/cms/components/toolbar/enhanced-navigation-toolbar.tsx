"use client"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

import { ZoomControlsSection } from "./components/zoom-controls"
import { CanvasControlsSection } from "./canvas-controls"
import { WidgetSectionV2 } from "./widget-section-v2"
import { ImportExportSection } from "./import-export-section"
import { FileActionsSection } from "./file-actions-section"
import { PreviewActionsSection } from "./components/preview-actions-section"

import { useZoomManager } from "../../hooks/use-zoom-manager"
import { useCanvasManager } from "../../hooks/use-canvas-manager"
import type { NavigationToolbarProps } from "../../types/toolbar-types"

export function EnhancedNavigationToolbar({
  className,
  showGrid = true,
  onAddComponent,
  onSave,
  onLoad,
  onExport,
  onToggleGrid,
  onPreview,
  onSettings,
  onImportWorkflow,
  onExportWorkflow,
  onImportComponents,
  onExportComponents,
  onRefreshPreview,
  onShareLink,
}: NavigationToolbarProps) {
  const { zoomLevel, zoomIn, zoomOut, resetZoom, fitToScreen } = useZoomManager()
  const { panMode, locked, gridVisible, togglePan, toggleLock, toggleGrid } = useCanvasManager()

  const handleToggleGrid = () => {
    toggleGrid()
    onToggleGrid?.()
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex items-center gap-1 bg-background/95 backdrop-blur-sm",
          "border border-border rounded-lg shadow-lg px-2 py-1.5",
          "transition-all duration-200 hover:shadow-xl",
          className,
        )}
      >
        <WidgetSectionV2 onAddComponent={onAddComponent} />

        <Separator orientation="vertical" className="h-6" />

        <ImportExportSection
          onImportWorkflow={onImportWorkflow}
          onExportWorkflow={onExportWorkflow}
          onImportComponents={onImportComponents}
          onExportComponents={onExportComponents}
          onShareLink={onShareLink}
        />

        <Separator orientation="vertical" className="h-6" />

        <ZoomControlsSection
          zoomLevel={zoomLevel}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onFitToScreen={fitToScreen}
        />

        <Separator orientation="vertical" className="h-6" />

        <CanvasControlsSection
          isPanMode={panMode}
          isLocked={locked}
          showGrid={showGrid}
          onTogglePan={togglePan}
          onToggleLock={toggleLock}
          onToggleGrid={handleToggleGrid}
        />

        <Separator orientation="vertical" className="h-6" />

        <FileActionsSection onSave={onSave} onLoad={onLoad} onRefreshPreview={onRefreshPreview} />

        <Separator orientation="vertical" className="h-6" />

        <PreviewActionsSection onPreview={onPreview} onSettings={onSettings} />
      </div>
    </TooltipProvider>
  )
}
