import type { TextNode, ModularErrorHandler, ValidationResult } from "./unified-widget-system"

export class UnifiedModularErrorHandler implements ModularErrorHandler {
  private errorRegistry = new Map<string, Error>()
  private recoveryNodes = new Map<string, TextNode>()

  isolateWidget(widgetId: string, error: Error): void {
    console.error(`[v0] Isolating widget ${widgetId}:`, error)
    this.errorRegistry.set(widgetId, error)

    // Create recovery node
    const recoveryNode: TextNode = {
      id: widgetId,
      type: "text",
      role: "paragraph",
      content: `Error in widget ${widgetId}: ${error.message}`,
      tone: "muted",
    }

    this.recoveryNodes.set(widgetId, recoveryNode)
  }

  recoverWidget(widgetId: string): TextNode | null {
    return this.recoveryNodes.get(widgetId) || null
  }

  validateWidget(node: TextNode): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Basic validation
    if (!node.id) errors.push("Widget ID is required")
    if (!node.type) errors.push("Widget type is required")
    if (!node.role) errors.push("Widget role is required")

    // Role-specific validation
    switch (node.role) {
      case "heading":
        if (!node.level || node.level < 1 || node.level > 6) {
          errors.push("Heading level must be between 1 and 6")
        }
        if (!node.content) errors.push("Heading content is required")
        break

      case "paragraph":
        if (!node.content) warnings.push("Paragraph content is empty")
        break

      case "list":
        if (!node.items || node.items.length === 0) {
          errors.push("List must have at least one item")
        }
        if (!node.listType) errors.push("List type (ul/ol) is required")
        break

      case "table":
        if (!node.rows || node.rows.length === 0) {
          errors.push("Table must have at least one row")
        }
        if (node.headerRows && node.rows && node.headerRows > node.rows.length) {
          errors.push("Header rows cannot exceed total rows")
        }
        break
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }
}
