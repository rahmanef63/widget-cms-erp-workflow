import type { TextRole, PropertyInspectorInheritance } from "./unified-widget-system"

export class AutoPropertyInspectorInheritance implements PropertyInspectorInheritance {
  getSemanticProperties(role: TextRole): string[] {
    const baseProperties = ["id", "type", "role"]

    switch (role) {
      case "heading":
        return [...baseProperties, "level", "content"]
      case "paragraph":
        return [...baseProperties, "content", "datetime"]
      case "blockquote":
        return [...baseProperties, "content"]
      case "list":
        return [...baseProperties, "listType", "items"]
      case "table":
        return [...baseProperties, "rows", "headerRows", "caption"]
      case "inlineCode":
        return [...baseProperties, "content"]
      default:
        return baseProperties
    }
  }

  getPresentationProperties(role: TextRole): string[] {
    const baseProperties = ["tone"]

    switch (role) {
      case "heading":
        return [...baseProperties] // No additional presentation props for headings
      case "paragraph":
        return [...baseProperties] // tone covers lead, large, small, muted
      case "blockquote":
        return [...baseProperties]
      case "list":
        return [...baseProperties]
      case "table":
        return [...baseProperties]
      case "inlineCode":
        return [...baseProperties]
      default:
        return baseProperties
    }
  }

  getContentProperties(role: TextRole): string[] {
    switch (role) {
      case "heading":
      case "paragraph":
      case "blockquote":
      case "inlineCode":
        return ["content"]
      case "list":
        return ["items"]
      case "table":
        return ["rows", "caption"]
      default:
        return ["content"]
    }
  }
}
