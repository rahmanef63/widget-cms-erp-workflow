import type { ComponentType } from "@/shared/types/schema"

export interface ZoomControls {
  zoomLevel: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  onFitToScreen: () => void
}

export interface CanvasControls {
  isPanMode: boolean
  isLocked: boolean
  showGrid: boolean
  onTogglePanMode: () => void
  onToggleLock: () => void
  onToggleGrid: () => void
}

export interface CanvasValidation {
  isValid: boolean
  hasReactFlow: boolean
  hasViewport: boolean
  nodeCount: number
  edgeCount: number
  errors: string[]
  warnings: string[]
}

export type ToolbarAction =
  | "add-widget"
  | "import-schema"
  | "export-schema"
  | "zoom-in"
  | "zoom-out"
  | "reset-zoom"
  | "fit-view"
  | "toggle-grid"
  | "toggle-pan"
  | "toggle-lock"
  | "save"
  | "load"
  | "preview"
  | "settings"
  | "refresh"
  | "share"

export interface NavigationState {
  zoomLevel: number
  panMode: boolean
  isLocked: boolean
  showGrid: boolean
}

export interface ZoomConfig {
  min: number
  max: number
  step: number
  defaultLevel: number
  animationDuration: number
}

export type { ComponentType }
