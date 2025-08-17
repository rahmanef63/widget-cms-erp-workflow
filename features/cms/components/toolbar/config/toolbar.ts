import type { ComponentType } from "@/shared/types/schema"
import { ZOOM_CONFIG } from "../constants"

export interface ToolbarConfig {
  zoom: {
    min: number
    max: number
    step: number
    default: number
    animationDuration: number
  }
  components: {
    available: ComponentType[]
    defaultPosition: { x: number; y: number }
    positionOffset: { x: number; y: number }
  }
  canvas: {
    fitViewPadding: number
    gridSize: number
    snapToGrid: boolean
  }
}

export const DEFAULT_TOOLBAR_CONFIG: ToolbarConfig = {
  zoom: {
    min: ZOOM_CONFIG.MIN,
    max: ZOOM_CONFIG.MAX,
    step: ZOOM_CONFIG.STEP,
    default: ZOOM_CONFIG.DEFAULT,
    animationDuration: ZOOM_CONFIG.ANIMATION_DURATION,
  },
  components: {
    available: ["section", "row", "column", "text", "image", "button", "card", "badge", "avatar", "alert", "separator"],
    defaultPosition: { x: 120, y: 80 },
    positionOffset: { x: 80, y: 60 },
  },
  canvas: {
    fitViewPadding: 0.1,
    gridSize: 20,
    snapToGrid: false,
  },
}
