import type { Edge, Node } from "reactflow"

// Shared types for schema and CMS

export type ComponentType =
  | "section"
  | "row"
  | "column"
  | "text"
  | "design-text"
  | "image"
  | "button"
  | "card"
  | "badge"
  | "avatar"
  | "alert"
  | "separator"
  | "preview"
  | "span"
  | "div"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "a"
  | "img"
  | "input"
  | "textarea"
  | "label"
  | "shadcn-button"
  | "shadcn-card"
  | "shadcn-input"
  | "shadcn-badge"
  | "shadcn-alert"
  | "contact-form"
  | "hero-section"
  | "navbar"

export type CompProps = Record<string, any>

export type CompNodeData = {
  type: ComponentType
  label: string
  props: CompProps
  previewRoots?: string[]
  previewBump?: number
}

// Schema used across import/export/AI/render
export type CMSSchema = {
  nodes: Array<
    Node<CompNodeData> | { id: string; rfType: string; data: CompNodeData; position: { x: number; y: number } }
  >
  edges: Edge[]
}
