export function getWidgetCategory(type: string): string {
  const atomicTypes = [
    "text",
    "image",
    "div",
    "span",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "input",
    "textarea",
    "label",
  ]
  const shadcnTypes = ["button", "card", "badge", "avatar", "alert", "separator"]
  const layoutTypes = ["section", "row", "column"]
  const collectionTypes = ["design-text"]

  if (atomicTypes.includes(type)) return "Atom"
  if (shadcnTypes.includes(type)) return "Shadcn UI"
  if (layoutTypes.includes(type)) return "Layout"
  if (collectionTypes.includes(type)) return "Collection"
  return "Unknown"
}

export const WIDGET_CATEGORIES = {
  ATOM: "Atom",
  SHADCN: "Shadcn UI",
  LAYOUT: "Layout",
  COLLECTION: "Collection",
  UNKNOWN: "Unknown",
} as const
