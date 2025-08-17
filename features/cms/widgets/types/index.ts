export type * from "../shared/types"
export type * from "../core/interfaces/base-widget"

// Widget-specific types
export interface WidgetHookOptions {
  enableValidation?: boolean
  enableComposition?: boolean
  enableCategories?: boolean
}

export interface WidgetRegistryOptions {
  categories?: string[]
  includeDeprecated?: boolean
  version?: string
}

export interface WidgetRenderOptions {
  mode?: "edit" | "preview" | "export"
  theme?: string
  responsive?: boolean
}
