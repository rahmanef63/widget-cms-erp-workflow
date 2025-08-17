import { toast } from "@/shared/hooks/use-toast"
import { validateCanvas, logCanvasState } from "./canvas-validator"
import { LOG_PREFIXES } from "../components/toolbar/constants"
import type { ToolbarAction, ComponentType } from "../types/toolbar-types"

export class ToolbarActions {
  static logAction(action: ToolbarAction, data?: any): void {
    console.log(`${LOG_PREFIXES.INFO} Toolbar Action:`, {
      action,
      data,
      timestamp: new Date().toISOString(),
      canvasValid: validateCanvas().isValid,
    })
    logCanvasState()
  }

  static async addWidget(type: ComponentType, callback?: (type: ComponentType) => void): Promise<void> {
    this.logAction("add-widget", { type })

    if (!callback) {
      console.warn(`${LOG_PREFIXES.WARNING} Add widget callback missing`)
      toast({
        title: "Error",
        description: "Add widget function not available",
        variant: "destructive",
      })
      return
    }

    try {
      callback(type)
      console.log(`${LOG_PREFIXES.SUCCESS} Widget added:`, type)
      toast({
        title: "Widget Added",
        description: `Added ${type} widget to canvas`,
      })
    } catch (error) {
      console.error(`${LOG_PREFIXES.ERROR} Failed to add widget:`, error)
      toast({
        title: "Error",
        description: "Failed to add widget to canvas",
        variant: "destructive",
      })
    }
  }

  static async importSchema(callback?: (data: any) => void): Promise<void> {
    this.logAction("import-schema")

    if (!callback) {
      console.warn(`${LOG_PREFIXES.WARNING} Import schema callback missing`)
      return
    }

    try {
      callback({})
      console.log(`${LOG_PREFIXES.SUCCESS} Import schema triggered`)
    } catch (error) {
      console.error(`${LOG_PREFIXES.ERROR} Import schema failed:`, error)
    }
  }

  static async exportSchema(callback?: () => any): Promise<void> {
    this.logAction("export-schema")

    if (!callback) {
      console.warn(`${LOG_PREFIXES.WARNING} Export schema callback missing`)
      return
    }

    try {
      const result = callback()
      console.log(`${LOG_PREFIXES.SUCCESS} Schema exported:`, result)
    } catch (error) {
      console.error(`${LOG_PREFIXES.ERROR} Export schema failed:`, error)
    }
  }

  static async zoomIn(currentLevel: number, setLevel: (level: number) => void): Promise<number> {
    this.logAction("zoom-in", { currentLevel })

    const newLevel = Math.min(currentLevel + 25, 200)
    setLevel(newLevel)

    console.log(`${LOG_PREFIXES.ZOOM} Zoom in: ${currentLevel}% → ${newLevel}%`)

    // Try to apply zoom to canvas
    this.applyCanvasZoom(newLevel)

    return newLevel
  }

  static async zoomOut(currentLevel: number, setLevel: (level: number) => void): Promise<number> {
    this.logAction("zoom-out", { currentLevel })

    const newLevel = Math.max(currentLevel - 25, 25)
    setLevel(newLevel)

    console.log(`${LOG_PREFIXES.ZOOM} Zoom out: ${currentLevel}% → ${newLevel}%`)

    // Try to apply zoom to canvas
    this.applyCanvasZoom(newLevel)

    return newLevel
  }

  static async resetZoom(setLevel: (level: number) => void): Promise<number> {
    this.logAction("reset-zoom")

    setLevel(100)
    console.log(`${LOG_PREFIXES.ZOOM} Zoom reset to 100%`)

    // Try to apply zoom to canvas
    this.applyCanvasZoom(100)

    return 100
  }

  private static applyCanvasZoom(level: number): void {
    const viewport = document.querySelector(".react-flow__viewport") as HTMLElement
    if (viewport) {
      const scale = level / 100
      const currentTransform = viewport.style.transform
      const match = currentTransform.match(/translate$$([^,]+),([^)]+)$$/)

      if (match) {
        const x = match[1]
        const y = match[2]
        viewport.style.transform = `translate(${x},${y}) scale(${scale})`
        console.log(`${LOG_PREFIXES.CANVAS} Applied zoom ${level}% to canvas`)
      } else {
        viewport.style.transform = `translate(0px,0px) scale(${scale})`
        console.log(`${LOG_PREFIXES.CANVAS} Applied initial zoom ${level}% to canvas`)
      }
    } else {
      console.warn(`${LOG_PREFIXES.WARNING} Canvas viewport not found for zoom application`)
    }
  }

  static async toggleGrid(currentState: boolean, callback?: () => void): Promise<boolean> {
    this.logAction("toggle-grid", { currentState })

    if (callback) {
      try {
        callback()
        console.log(`${LOG_PREFIXES.CANVAS} Grid toggled: ${currentState} → ${!currentState}`)
      } catch (error) {
        console.error(`${LOG_PREFIXES.ERROR} Grid toggle failed:`, error)
      }
    }

    return !currentState
  }

  static async refreshPreview(callback?: () => void): Promise<void> {
    this.logAction("refresh")

    if (!callback) {
      console.warn(`${LOG_PREFIXES.WARNING} Refresh preview callback missing`)
      return
    }

    try {
      callback()
      console.log(`${LOG_PREFIXES.SUCCESS} Preview refreshed`)
      toast({
        title: "Preview Refreshed",
        description: "Canvas preview has been updated",
      })
    } catch (error) {
      console.error(`${LOG_PREFIXES.ERROR} Preview refresh failed:`, error)
      toast({
        title: "Error",
        description: "Failed to refresh preview",
        variant: "destructive",
      })
    }
  }
}
