export const APP_CONFIG = {
  name: "CMS Builder",
  version: "1.0.0",
  description: "Advanced CMS page builder with AI assistance",
} as const

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const

export const THEME_COLORS = {
  primary: "#3b82f6",
  secondary: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",
} as const

export const STORAGE_KEYS = {
  theme: "cms-theme",
  settings: "cms-settings",
  recentProjects: "cms-recent-projects",
  userPreferences: "cms-user-preferences",
} as const

export const API_ENDPOINTS = {
  ai: "/api/ai",
  export: "/api/export",
  import: "/api/import",
  save: "/api/save",
  load: "/api/load",
} as const

export const WIDGET_LIMITS = {
  maxNesting: 10,
  maxWidgetsPerPage: 1000,
  maxPropsSize: 10000, // bytes
} as const

export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  hexColor: /^#[0-9A-Fa-f]{6}$/,
  slug: /^[a-z0-9-]+$/,
} as const
