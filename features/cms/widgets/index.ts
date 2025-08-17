export * from "./core"

// Widget types and categories
export * from "./atoms"
export * from "./shadcn/composed-widgets"
export * from "./collections/complex-widgets"

// Widget utilities and shared components
export * from "./shared"

// Widget hooks
export { useWidgetRegistry } from "./hooks/useWidgetRegistry"
export { useWidgetValidation } from "./hooks/useWidgetValidation"
export { useWidgetComposition } from "./hooks/useWidgetComposition"
export { useWidgetCategories } from "./hooks/useWidgetCategories"

// Widget property inspector system

// Widget types and interfaces
export type * from "./types"

// Widget utilities
export { WidgetBuilder } from "./lib/widget-builder"
export { WidgetValidator } from "./lib/widget-validator"
export { WidgetRenderer } from "./lib/widget-renderer"

// Widget categories and organization
export {
  WIDGET_CATEGORIES,
  getWidgetCategory,
  getWidgetsByCategory,
  getAllWidgetTypes,
  getCategoryStats,
} from "./core/widget-categories"

// Default export for widget registry
export { WIDGET_REGISTRY as default } from "./core/widget-registry"

// Utility functions
export { arraysEqual, computeChildrenMap } from "./core/utils"

// Default props for component types
export const DEFAULTS: Record<string, any> = {
  section: { className: "section", children: [] },
  row: { className: "row", children: [] },
  column: { className: "col", children: [] },
  text: { content: "Text", className: "" },
  "design-text": { content: "Design Text", className: "", variant: "default" },
  image: { src: "", alt: "", className: "" },
  button: { text: "Button", variant: "default", className: "" },
  card: { title: "Card", content: "", className: "" },
  badge: { text: "Badge", variant: "default", className: "" },
  avatar: { src: "", alt: "", className: "" },
  alert: { title: "Alert", content: "", variant: "default", className: "" },
  separator: { className: "" },
  span: { content: "Span", className: "" },
  div: { className: "", children: [] },
  p: { content: "Paragraph", className: "" },
  h1: { content: "Heading 1", className: "" },
  h2: { content: "Heading 2", className: "" },
  h3: { content: "Heading 3", className: "" },
  a: { href: "#", content: "Link", className: "" },
  img: { src: "", alt: "", className: "" },
  input: { type: "text", placeholder: "", className: "" },
  textarea: { placeholder: "", className: "" },
  label: { content: "Label", className: "" },
  "shadcn-button": { text: "Button", variant: "default", size: "default" },
  "shadcn-card": { title: "Card", content: "", className: "" },
  "shadcn-input": { type: "text", placeholder: "", className: "" },
  "shadcn-badge": { text: "Badge", variant: "default" },
  "shadcn-alert": { title: "Alert", content: "", variant: "default" },
  "contact-form": { title: "Contact Form", fields: [] },
  "hero-section": { title: "Hero", subtitle: "", cta: "Get Started" },
  navbar: { brand: "Brand", links: [] },
}
