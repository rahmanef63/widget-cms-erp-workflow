import type { CommonProperties } from "../interfaces/base-widget"

export class PropertyBuilder {
  private properties: Partial<CommonProperties> = {}

  // Typography methods
  setFont(family: string, weight = "400", size = "16px"): this {
    if (!this.properties.typography) {
      this.properties.typography = {} as any
    }
    this.properties.typography.family = family
    this.properties.typography.weight = weight
    this.properties.typography.size = size
    return this
  }

  setTextAlign(align: "left" | "center" | "right" | "justify"): this {
    if (!this.properties.typography) {
      this.properties.typography = {} as any
    }
    this.properties.typography.align = align
    return this
  }

  setTextDecoration(italic = false, underline = false, strike = false): this {
    if (!this.properties.typography) {
      this.properties.typography = {} as any
    }
    this.properties.typography.decoration = { italic, underline, strike }
    return this
  }

  // Color methods
  setTextColor(color: string): this {
    if (!this.properties.color) {
      this.properties.color = {} as any
    }
    this.properties.color.text = color
    return this
  }

  setBackgroundColor(color: string): this {
    if (!this.properties.background) {
      this.properties.background = {} as any
    }
    this.properties.background.fill = color
    return this
  }

  // Layout methods
  setMargin(top: number, right: number, bottom: number, left: number): this {
    if (!this.properties.layout) {
      this.properties.layout = {} as any
    }
    this.properties.layout.margin = { t: top, r: right, b: bottom, l: left }
    return this
  }

  setPadding(top: number, right: number, bottom: number, left: number): this {
    if (!this.properties.layout) {
      this.properties.layout = {} as any
    }
    this.properties.layout.padding = { t: top, r: right, b: bottom, l: left }
    return this
  }

  setSize(width: string, height: string): this {
    if (!this.properties.layout) {
      this.properties.layout = {} as any
    }
    this.properties.layout.size = { w: width, h: height }
    return this
  }

  setFlexDirection(direction: "row" | "column"): this {
    if (!this.properties.layout) {
      this.properties.layout = {} as any
    }
    this.properties.layout.direction = direction
    return this
  }

  setAlignment(
    alignItems: "start" | "center" | "end" | "stretch",
    justify: "start" | "between" | "end" | "center",
  ): this {
    if (!this.properties.layout) {
      this.properties.layout = {} as any
    }
    this.properties.layout.alignItems = alignItems
    this.properties.layout.justify = justify
    return this
  }

  setGap(gap: number): this {
    if (!this.properties.layout) {
      this.properties.layout = {} as any
    }
    this.properties.layout.gap = gap
    return this
  }

  // Border methods
  setBorder(width: number, style: string, color: string, radius = "0"): this {
    if (!this.properties.border) {
      this.properties.border = {} as any
    }
    this.properties.border.width = width
    this.properties.border.style = style
    this.properties.border.color = color
    this.properties.border.radius = radius
    return this
  }

  setBorderRadius(radius: string): this {
    if (!this.properties.border) {
      this.properties.border = {} as any
    }
    this.properties.border.radius = radius
    return this
  }

  // Appearance methods
  setOpacity(opacity: number): this {
    if (!this.properties.appearance) {
      this.properties.appearance = {} as any
    }
    this.properties.appearance.opacity = Math.max(0, Math.min(1, opacity))
    return this
  }

  setShadow(preset: string): this {
    if (!this.properties.shadow) {
      this.properties.shadow = {} as any
    }
    this.properties.shadow.preset = preset
    return this
  }

  // Build method
  build(): Partial<CommonProperties> {
    return JSON.parse(JSON.stringify(this.properties))
  }

  // Utility methods
  reset(): this {
    this.properties = {}
    return this
  }

  merge(properties: Partial<CommonProperties>): this {
    this.properties = { ...this.properties, ...properties }
    return this
  }

  // Preset methods for common styles
  static createButtonStyle(variant: "primary" | "secondary" | "outline" = "primary"): Partial<CommonProperties> {
    const builder = new PropertyBuilder()

    switch (variant) {
      case "primary":
        return builder
          .setBackgroundColor("#3b82f6")
          .setTextColor("#ffffff")
          .setPadding(8, 16, 8, 16)
          .setBorderRadius("6px")
          .setFont("system-ui", "500", "14px")
          .build()

      case "secondary":
        return builder
          .setBackgroundColor("#f3f4f6")
          .setTextColor("#374151")
          .setPadding(8, 16, 8, 16)
          .setBorderRadius("6px")
          .setFont("system-ui", "500", "14px")
          .build()

      case "outline":
        return builder
          .setBackgroundColor("transparent")
          .setTextColor("#3b82f6")
          .setPadding(8, 16, 8, 16)
          .setBorder(1, "solid", "#3b82f6", "6px")
          .setFont("system-ui", "500", "14px")
          .build()

      default:
        return builder.build()
    }
  }

  static createCardStyle(): Partial<CommonProperties> {
    return new PropertyBuilder()
      .setBackgroundColor("#ffffff")
      .setPadding(24, 24, 24, 24)
      .setBorderRadius("8px")
      .setShadow("md")
      .build()
  }

  static createHeadingStyle(level: 1 | 2 | 3 | 4 | 5 | 6 = 1): Partial<CommonProperties> {
    const sizes = {
      1: "32px",
      2: "24px",
      3: "20px",
      4: "18px",
      5: "16px",
      6: "14px",
    }

    const weights = {
      1: "700",
      2: "600",
      3: "600",
      4: "600",
      5: "500",
      6: "500",
    }

    return new PropertyBuilder()
      .setFont("system-ui", weights[level], sizes[level])
      .setTextColor("#111827")
      .setMargin(0, 0, 16, 0)
      .build()
  }
}
