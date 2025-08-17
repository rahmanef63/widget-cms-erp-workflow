export interface BaseWidget {
  id: string
  type: string
  version: string
  props: Record<string, any>
  children?: BaseWidget[]
  metadata?: WidgetMetadata
  style?: Partial<CommonProperties>
}

export interface WidgetMetadata {
  createdAt: Date
  updatedAt: Date
  author?: string
  description?: string
  tags?: string[]
}

export interface CommonProperties {
  typography: {
    family: string
    weight: string
    size: string
    lineHeight: string
    letterSpacing: string
    align: "left" | "center" | "right" | "justify"
    decoration: {
      italic: boolean
      underline: boolean
      strike: boolean
    }
  }
  color: {
    text: string
  }
  background: {
    fill: string
  }
  layout: {
    margin: { t: number; r: number; b: number; l: number }
    padding: { t: number; r: number; b: number; l: number }
    size: { w: string; h: string }
    gap: number
    direction: "row" | "column"
    alignItems: "start" | "center" | "end" | "stretch"
    justify: "start" | "between" | "end" | "center"
  }
  border: {
    preset: string
    width: number
    style: string
    color: string
    radius: string
  }
  appearance: {
    opacity: number
  }
  shadow: {
    preset: string
  }
}

export interface ValidationResult<T = any> {
  success: boolean
  data?: T
  errors?: ValidationError[]
}

export interface ValidationError {
  path: string
  message: string
  code: string
}
