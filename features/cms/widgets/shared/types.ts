import type { BaseWidget, CommonProperties } from "../core/interfaces/base-widget"

export interface WidgetDefinition {
  type: string
  name: string
  description: string
  category: string
  subcategory?: string
  icon: string
  version: string
  defaultProps: Record<string, any>
  defaultStyle?: Partial<CommonProperties>
  propertySchema: PropertyField[]
  tags?: string[]
  deprecated?: boolean
  create?: (props?: Record<string, any>) => BaseWidget
}

export interface PropertyField {
  key: string
  label: string
  type: "text" | "number" | "color" | "select" | "toggle" | "textarea" | "url" | "email" | "range" | "date" | "file"
  options?: string[]
  min?: number
  max?: number
  step?: number
  section?: string
  required?: boolean
  defaultValue?: any
  description?: string
  placeholder?: string
  dependsOn?: string
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    custom?: (value: any) => boolean | string
  }
}

export interface WidgetComposition {
  type: string
  props: Record<string, any>
  children?: WidgetComposition[]
}

export interface WidgetConfig<T = any> extends BaseWidget {
  props: T
  composition?: WidgetComposition
}

export interface WidgetCategoryDefinition {
  id: string
  name: string
  description: string
  icon: string
  order: number
  widgets: string[]
}

export interface WidgetSubcategoryDefinition {
  id: string
  name: string
  description: string
  parentCategory: string
  widgets: string[]
}

// Re-export core types
export type { BaseWidget, CommonProperties } from "../core/interfaces/base-widget"
