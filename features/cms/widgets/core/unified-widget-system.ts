export type RenderProfile = "semantic" | "shadcn"
export type TextRole = "heading" | "paragraph" | "blockquote" | "list" | "table" | "inlineCode"

export interface TextNode {
  id: string
  type: "text"
  role: TextRole
  level?: 1 | 2 | 3 | 4 | 5 | 6 // only role=heading
  listType?: "ul" | "ol" // only role=list
  rows?: string[][] // only role=table
  headerRows?: number // table thead split
  caption?: string // table/figure caption
  datetime?: string // <time> support (ISO)
  content?: string // p/blockquote/inlineCode/heading
  items?: string[] // list content
  tone?: "default" | "muted" | "lead" | "large" | "small" // presentational hint
}

// Import/Export capabilities
export interface ImportExportStrategy {
  importFromJson: (data: any) => TextNode
  importFromHtml: (html: string) => TextNode
  exportToHtml: (node: TextNode, profile: RenderProfile) => string
  exportToJson: (node: TextNode) => string
  exportToTypeScript: (node: TextNode) => string
}

// Automatic property inspector inheritance
export interface PropertyInspectorInheritance {
  getSemanticProperties: (role: TextRole) => string[]
  getPresentationProperties: (role: TextRole) => string[]
  getContentProperties: (role: TextRole) => string[]
}

// Modular error handling
export interface ModularErrorHandler {
  isolateWidget: (widgetId: string, error: Error) => void
  recoverWidget: (widgetId: string) => TextNode | null
  validateWidget: (node: TextNode) => ValidationResult
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}
