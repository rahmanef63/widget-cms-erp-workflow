import { ZOOM_CONFIG, LOG_PREFIXES } from "../components/toolbar/constants"
import { getReactFlowInstance } from "./canvas-validator"

export class ZoomManager {
  static applyZoom(level: number, duration = ZOOM_CONFIG.ANIMATION_DURATION): boolean {
    const instance = getReactFlowInstance()
    if (!instance) {
      console.warn(`${LOG_PREFIXES.WARNING} Cannot apply zoom: ReactFlow instance not available`)
      return false
    }

    try {
      const zoomValue = level / 100
      instance.zoomTo(zoomValue, { duration })
      console.log(`${LOG_PREFIXES.ZOOM} Applied zoom: ${level}% (${zoomValue})`)
      return true
    } catch (error) {
      console.error(`${LOG_PREFIXES.ERROR} Failed to apply zoom:`, error)
      return false
    }
  }

  static zoomIn(currentLevel: number): number {
    const newLevel = Math.min(currentLevel + ZOOM_CONFIG.STEP, ZOOM_CONFIG.MAX)
    this.applyZoom(newLevel)
    return newLevel
  }

  static zoomOut(currentLevel: number): number {
    const newLevel = Math.max(currentLevel - ZOOM_CONFIG.STEP, ZOOM_CONFIG.MIN)
    this.applyZoom(newLevel)
    return newLevel
  }

  static resetZoom(): number {
    this.applyZoom(ZOOM_CONFIG.DEFAULT)
    return ZOOM_CONFIG.DEFAULT
  }

  static fitView(padding = 0.1): boolean {
    const instance = getReactFlowInstance()
    if (!instance) {
      console.warn(`${LOG_PREFIXES.WARNING} Cannot fit view: ReactFlow instance not available`)
      return false
    }

    try {
      instance.fitView({ padding, duration: ZOOM_CONFIG.ANIMATION_DURATION })
      console.log(`${LOG_PREFIXES.ZOOM} Applied fit view with padding: ${padding}`)
      return true
    } catch (error) {
      console.error(`${LOG_PREFIXES.ERROR} Failed to fit view:`, error)
      return false
    }
  }

  static getCurrentZoom(): number {
    const instance = getReactFlowInstance()
    if (!instance) {
      return ZOOM_CONFIG.DEFAULT
    }

    try {
      const viewport = instance.getViewport()
      return Math.round(viewport.zoom * 100)
    } catch (error) {
      console.error(`${LOG_PREFIXES.ERROR} Failed to get current zoom:`, error)
      return ZOOM_CONFIG.DEFAULT
    }
  }
}
