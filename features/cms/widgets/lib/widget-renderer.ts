import type { BaseWidget } from "../core/interfaces/base-widget"
import type { WidgetComposition } from "../shared/types"

export interface RenderContext {
  mode: "edit" | "preview" | "export"
  theme?: string
  locale?: string
  breakpoint?: "mobile" | "tablet" | "desktop"
}

export interface RenderOptions {
  context: RenderContext
  parentProps?: Record<string, any>
  depth?: number
}

export class WidgetRenderer {
  static render(widget: BaseWidget, options: RenderOptions): string {
    const { context, parentProps = {}, depth = 0 } = options

    // Basic HTML rendering based on widget type
    switch (widget.type) {
      case "text":
        return this.renderText(widget, options)
      case "div":
        return this.renderDiv(widget, options)
      case "button":
        return this.renderButton(widget, options)
      case "image":
        return this.renderImage(widget, options)
      default:
        return this.renderGeneric(widget, options)
    }
  }

  static renderComposition(composition: WidgetComposition, options: RenderOptions): string {
    const { context, depth = 0 } = options

    let html = `<div class="widget-composition" data-type="${composition.type}">`

    if (composition.children) {
      composition.children.forEach((child) => {
        html += this.renderComposition(child, { ...options, depth: depth + 1 })
      })
    }

    html += "</div>"
    return html
  }

  private static renderText(widget: BaseWidget, options: RenderOptions): string {
    const { tag = "p", content = "", className = "" } = widget.props
    const classes = this.buildClasses(widget, options)

    return `<${tag} class="${classes} ${className}" data-widget-id="${widget.id}">${content}</${tag}>`
  }

  private static renderDiv(widget: BaseWidget, options: RenderOptions): string {
    const { className = "" } = widget.props
    const classes = this.buildClasses(widget, options)

    return `<div class="${classes} ${className}" data-widget-id="${widget.id}"></div>`
  }

  private static renderButton(widget: BaseWidget, options: RenderOptions): string {
    const { label = "Button", href, className = "" } = widget.props
    const classes = this.buildClasses(widget, options)

    if (href) {
      return `<a href="${href}" class="${classes} ${className}" data-widget-id="${widget.id}">${label}</a>`
    }

    return `<button class="${classes} ${className}" data-widget-id="${widget.id}">${label}</button>`
  }

  private static renderImage(widget: BaseWidget, options: RenderOptions): string {
    const { src = "", alt = "", width, height, className = "" } = widget.props
    const classes = this.buildClasses(widget, options)

    const sizeAttrs = []
    if (width) sizeAttrs.push(`width="${width}"`)
    if (height) sizeAttrs.push(`height="${height}"`)

    return `<img src="${src}" alt="${alt}" ${sizeAttrs.join(" ")} class="${classes} ${className}" data-widget-id="${widget.id}" />`
  }

  private static renderGeneric(widget: BaseWidget, options: RenderOptions): string {
    const { className = "" } = widget.props
    const classes = this.buildClasses(widget, options)

    return `<div class="${classes} ${className}" data-widget-id="${widget.id}" data-widget-type="${widget.type}">
      <!-- ${widget.type} widget -->
    </div>`
  }

  private static buildClasses(widget: BaseWidget, options: RenderOptions): string {
    const classes = [`widget-${widget.type}`]

    if (options.context.mode === "edit") {
      classes.push("widget-editable")
    }

    if (options.context.breakpoint) {
      classes.push(`widget-${options.context.breakpoint}`)
    }

    return classes.join(" ")
  }

  static exportToHTML(widgets: BaseWidget[], options: RenderOptions): string {
    const renderedWidgets = widgets.map((widget) => this.render(widget, options)).join("\n")

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Page</title>
  <style>
    /* Widget styles would be injected here */
  </style>
</head>
<body>
  ${renderedWidgets}
</body>
</html>`
  }
}
