import type { TextNode, ImportExportStrategy } from "./unified-widget-system"

export class UnifiedImportExportStrategy implements ImportExportStrategy {
  importFromJson(data: any): TextNode {
    try {
      // Validate and transform JSON data to TextNode
      return {
        id: data.id || `text-${Date.now()}`,
        type: "text",
        role: data.role || "paragraph",
        level: data.level,
        listType: data.listType,
        rows: data.rows,
        headerRows: data.headerRows,
        caption: data.caption,
        datetime: data.datetime,
        content: data.content,
        items: data.items,
        tone: data.tone || "default",
      }
    } catch (error) {
      console.error("[v0] JSON import error:", error)
      throw new Error(`Invalid JSON format: ${error}`)
    }
  }

  importFromHtml(html: string): TextNode {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")
      const element = doc.body.firstElementChild

      if (!element) throw new Error("No valid HTML element found")

      const tagName = element.tagName.toLowerCase()
      const textContent = element.textContent || ""

      // Map HTML tags to TextNode
      if (tagName.match(/^h[1-6]$/)) {
        return {
          id: `text-${Date.now()}`,
          type: "text",
          role: "heading",
          level: Number.parseInt(tagName.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6,
          content: textContent,
          tone: "default",
        }
      }

      if (tagName === "p") {
        return {
          id: `text-${Date.now()}`,
          type: "text",
          role: "paragraph",
          content: textContent,
          tone: "default",
        }
      }

      if (tagName === "blockquote") {
        return {
          id: `text-${Date.now()}`,
          type: "text",
          role: "blockquote",
          content: textContent,
          tone: "default",
        }
      }

      // Default to paragraph
      return {
        id: `text-${Date.now()}`,
        type: "text",
        role: "paragraph",
        content: textContent,
        tone: "default",
      }
    } catch (error) {
      console.error("[v0] HTML import error:", error)
      throw new Error(`Invalid HTML format: ${error}`)
    }
  }

  exportToHtml(node: TextNode, profile: "semantic" | "shadcn"): string {
    try {
      if (profile === "semantic") {
        return this.exportSemanticHtml(node)
      } else {
        return this.exportShadcnHtml(node)
      }
    } catch (error) {
      console.error("[v0] HTML export error:", error)
      return `<!-- Export Error: ${error} -->`
    }
  }

  private exportSemanticHtml(node: TextNode): string {
    switch (node.role) {
      case "heading":
        return `<h${node.level || 2}>${node.content}</h${node.level || 2}>`
      case "paragraph":
        return `<p>${node.content}</p>`
      case "blockquote":
        return `<blockquote><p>${node.content}</p></blockquote>`
      case "inlineCode":
        return `<code>${node.content}</code>`
      case "list":
        const listTag = node.listType === "ol" ? "ol" : "ul"
        const items = node.items?.map((item) => `<li>${item}</li>`).join("") || ""
        return `<${listTag}>${items}</${listTag}>`
      default:
        return `<p>${node.content}</p>`
    }
  }

  private exportShadcnHtml(node: TextNode): string {
    const tone = node.tone || "default"

    switch (node.role) {
      case "heading":
        const level = node.level || 2
        const classes = {
          1: "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",
          2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
          3: "scroll-m-20 text-2xl font-semibold tracking-tight",
          4: "scroll-m-20 text-xl font-semibold tracking-tight",
          5: "text-lg font-semibold",
          6: "text-base font-semibold",
        }[level]
        return `<h${level} class="${classes}">${node.content}</h${level}>`
      case "paragraph":
        const pClasses = {
          lead: "text-muted-foreground text-xl",
          large: "text-lg font-semibold",
          small: "text-sm leading-none font-medium",
          muted: "text-muted-foreground text-sm",
          default: "leading-7 [&:not(:first-child)]:mt-6",
        }[tone]
        const tag = tone === "small" ? "small" : "p"
        return `<${tag} class="${pClasses}">${node.content}</${tag}>`
      default:
        return `<p class="leading-7 [&:not(:first-child)]:mt-6">${node.content}</p>`
    }
  }

  exportToJson(node: TextNode): string {
    try {
      return JSON.stringify(node, null, 2)
    } catch (error) {
      console.error("[v0] JSON export error:", error)
      return `{"error": "Export failed: ${error}"}`
    }
  }

  exportToTypeScript(node: TextNode): string {
    try {
      return `const textNode: TextNode = ${JSON.stringify(node, null, 2)};`
    } catch (error) {
      console.error("[v0] TypeScript export error:", error)
      return `// Export Error: ${error}`
    }
  }
}
