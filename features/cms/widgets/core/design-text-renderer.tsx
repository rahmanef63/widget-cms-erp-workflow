import type React from "react"
import type { CompProps } from "@/shared/types/schema"
import type { JSX } from "react"

export function DesignTextRenderer({ props }: { props: CompProps }) {
  const {
    tag = "p",
    content = "Advanced Text",
    fontFamily = "Default",
    fontWeight = "Regular",
    fontSize = 16,
    lineHeight = 1.75,
    letterSpacing = 0,
    textAlign = "left",
    textDecoration = "none",
    color = "#000000",
    background = "transparent",
    direction = "ltr",
    justifyContent = "flex-start",
    alignItems = "flex-start",
    gap = 16,
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    marginLeft = 0,
    paddingTop = 16,
    paddingRight = 16,
    paddingBottom = 16,
    paddingLeft = 16,
    borderWidth = 0,
    borderStyle = "solid",
    borderColor = "#000000",
    borderRadius = 0,
    opacity = 100,
    boxShadow = "none",
    className = "",
    styleJson = "{}",
  } = props

  // Parse custom styles
  let customStyles = {}
  try {
    customStyles = JSON.parse(styleJson)
  } catch {
    // ignore
  }

  // Map shadow values to CSS
  const shadowMap: Record<string, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  }

  // Map font weight values
  const weightMap: Record<string, string> = {
    "100": "100",
    "200": "200",
    "300": "300",
    Regular: "400",
    "500": "500",
    "600": "600",
    "700": "700",
    "800": "800",
    "900": "900",
  }

  const styles: React.CSSProperties = {
    fontFamily: fontFamily === "Default" ? "inherit" : fontFamily,
    fontWeight: weightMap[fontWeight] || "400",
    fontSize: `${fontSize}px`,
    lineHeight: lineHeight,
    letterSpacing: `${letterSpacing}px`,
    textAlign: textAlign as any,
    textDecoration,
    color,
    backgroundColor: background === "transparent" ? "transparent" : background,
    direction: direction as any,
    display: "flex",
    flexDirection: "column",
    justifyContent: justifyContent as any,
    alignItems: alignItems as any,
    gap: `${gap}px`,
    marginTop: `${marginTop}px`,
    marginRight: `${marginRight}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
    paddingTop: `${paddingTop}px`,
    paddingRight: `${paddingRight}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    borderWidth: `${borderWidth}px`,
    borderStyle: borderStyle as any,
    borderColor,
    borderRadius: `${borderRadius}px`,
    opacity: opacity / 100,
    boxShadow: shadowMap[boxShadow] || boxShadow,
    ...customStyles,
  }

  const Tag = tag as keyof JSX.IntrinsicElements

  return (
    <Tag className={className} style={styles}>
      {content}
    </Tag>
  )
}
