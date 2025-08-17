export const LOG_PREFIXES = {
  INFO: "ℹ️",
  SUCCESS: "✅",
  WARNING: "⚠️",
  ERROR: "❌",
  ZOOM: "🔍",
  CANVAS: "🎨",
  TOOLBAR: "🧭",
  PROVIDER: "🏗️",
} as const

export const ZOOM_CONFIG = {
  MIN: 25,
  MAX: 200,
  STEP: 25,
  DEFAULT: 100,
  ANIMATION_DURATION: 300,
} as const

export const CANVAS_SELECTORS = {
  REACT_FLOW_WRAPPER: '[data-testid="rf__wrapper"]',
  REACT_FLOW_VIEWPORT: ".react-flow__viewport",
  REACT_FLOW_CONTAINER: ".react-flow",
} as const

export const GLOBAL_KEYS = {
  REACT_FLOW_INSTANCE: "__REACT_FLOW_INSTANCE__",
  CMS_BUILDER: "__CMS_BUILDER__",
  CMS_REFRESH: "__CMS_REFRESH__",
  VIEWPORT_HANDLER: "__VIEWPORT_HANDLER__",
} as const
