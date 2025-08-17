"use client"

import React from "react"
import type { Node } from "reactflow"
import { cn } from "@/lib/utils"
import { safeParseStyle } from "./utils"
import type { CompNodeData } from "@/shared/types/schema"
import { BUTTON_SIZE_MAP } from "./meta"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

function getChildrenOrdered(
  parentId: string,
  nodesMap: Map<string, Node<CompNodeData>>,
  childrenOf: Map<string, string[]>,
): string[] {
  try {
    // Validate inputs
    if (typeof parentId !== 'string' || !parentId) {
      console.warn('getChildrenOrdered: Invalid parentId', parentId)
      return []
    }
    
    if (!(nodesMap instanceof Map) || !(childrenOf instanceof Map)) {
      console.warn('getChildrenOrdered: Invalid maps provided')
      return []
    }

    const ids = childrenOf.get(parentId)
    if (!Array.isArray(ids)) {
      return []
    }
    
    const idsClone = ids.slice()
    
    // Early return if no children
    if (idsClone.length === 0) {
      return idsClone
    }
    
    const parent = nodesMap.get(parentId)
    
    // Safe access to childOrder with proper null checks
    let childOrder: string[] | undefined = undefined
    try {
      if (parent?.data?.props && typeof parent.data.props === 'object') {
        const props = parent.data.props as any
        if (Array.isArray(props.childOrder)) {
          childOrder = props.childOrder
        }
      }
    } catch (e) {
      console.warn('getChildrenOrdered: Error accessing childOrder', e)
    }
      
    if (Array.isArray(childOrder) && childOrder.length > 0) {
      try {
        const known = idsClone.filter((id) => typeof id === 'string' && childOrder!.includes(id))
        const orderedKnown = known.sort((a, b) => {
          const indexA = childOrder!.indexOf(a)
          const indexB = childOrder!.indexOf(b)
          return indexA - indexB
        })
        const rest = idsClone.filter((id) => typeof id === 'string' && !childOrder!.includes(id))
        
        // keep rest by x ascending with safe position access
        rest.sort((a, b) => {
          try {
            const na = nodesMap.get(a)
            const nb = nodesMap.get(b)
            const posA = (na?.position?.x && typeof na.position.x === 'number') ? na.position.x : 0
            const posB = (nb?.position?.x && typeof nb.position.x === 'number') ? nb.position.x : 0
            return posA - posB
          } catch (e) {
            console.warn('getChildrenOrdered: Error sorting rest', e)
            return 0
          }
        })
        return [...orderedKnown, ...rest]
      } catch (e) {
        console.warn('getChildrenOrdered: Error processing childOrder', e)
        // Fall through to default sorting
      }
    }
    
    // fallback to x ascending with safe position access
    try {
      idsClone.sort((a, b) => {
        try {
          const na = nodesMap.get(a)
          const nb = nodesMap.get(b)
          const posA = (na?.position?.x && typeof na.position.x === 'number') ? na.position.x : 0
          const posB = (nb?.position?.x && typeof nb.position.x === 'number') ? nb.position.x : 0
          return posA - posB
        } catch (e) {
          console.warn('getChildrenOrdered: Error in sort comparison', e)
          return 0
        }
      })
    } catch (e) {
      console.warn('getChildrenOrdered: Error in fallback sort', e)
    }
    
    return idsClone
  } catch (error) {
    console.error('getChildrenOrdered: Critical error', error, { parentId, nodesMap, childrenOf })
    return []
  }
}

// Pure renderer
export function renderTree(
  nodeId: string,
  nodesMap: Map<string, Node<CompNodeData>>,
  childrenOf: Map<string, string[]>,
): React.ReactNode {
  try {
    // Validate inputs
    if (typeof nodeId !== 'string' || !nodeId) {
      console.warn('renderTree: Invalid nodeId', nodeId)
      return null
    }
    
    if (!(nodesMap instanceof Map) || !(childrenOf instanceof Map)) {
      console.warn('renderTree: Invalid maps provided')
      return null
    }

    const node = nodesMap.get(nodeId)
    if (!node || !node.data) {
      return null
    }
    
    const data = node.data as CompNodeData
    if (!data.type || typeof data.type !== 'string') {
      return null
    }

    let children: string[] = []
    let renderedChildren: React.ReactNode[] = []
    
    try {
      children = getChildrenOrdered(nodeId, nodesMap, childrenOf)
      renderedChildren = children.map((cid) => {
        try {
          return <React.Fragment key={cid}>{renderTree(cid, nodesMap, childrenOf)}</React.Fragment>
        } catch (e) {
          console.warn('renderTree: Error rendering child', cid, e)
          return <React.Fragment key={cid}></React.Fragment>
        }
      })
    } catch (e) {
      console.warn('renderTree: Error getting children', nodeId, e)
      renderedChildren = []
    }

    // Safe access to props with fallbacks
    const props = data.props || {}
    let style: React.CSSProperties = {}
    let cls = ''
    
    try {
      style = safeParseStyle((props as any)?.styleJson || "{}")
    } catch (e) {
      console.warn('renderTree: Error parsing style', e)
      style = {}
    }
    
    try {
      cls = (props as any)?.className || ""
    } catch (e) {
      console.warn('renderTree: Error getting className', e)
      cls = ""
    }

  switch (data.type) {
    case "section": {
      const { background, padding, maxWidth, align } = props
      return (
        <section
          style={{ background, padding }}
          className={cn(
            "w-full flex",
            align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start",
            cls,
          )}
        >
          <div style={{ maxWidth, ...style }} className="w-full">
            {renderedChildren}
          </div>
        </section>
      )
    }
    case "row": {
      const { gap, padding, justify, align } = props
      const j =
        ({ start: "justify-start", center: "justify-center", between: "justify-between", end: "justify-end" } as any)[
          justify
        ] || "justify-start"
      const a = ({ start: "items-start", center: "items-center", end: "items-end" } as any)[align] || "items-start"
      return (
        <div className={cn("flex flex-row", j, a, cls)} style={{ gap, padding, ...style }}>
          {renderedChildren}
        </div>
      )
    }
    case "column": {
      const { gap, padding, justify, align } = props
      const j =
        ({ start: "justify-start", center: "justify-center", between: "justify-between", end: "justify-end" } as any)[
          justify
        ] || "justify-start"
      const a = ({ start: "items-start", center: "items-center", end: "items-end" } as any)[align] || "items-start"
      return (
        <div className={cn("flex flex-col", j, a, cls)} style={{ gap, padding, ...style }}>
          {renderedChildren}
        </div>
      )
    }
    case "text": {
      const { tag, content, fontSize, color, weight, align } = props
      const Tag = (tag || "p") as any
      return (
        <Tag
          style={{ fontSize, color, fontWeight: weight, textAlign: align as any, ...style }}
          className={cn("mb-2", cls)}
        >
          {content}
        </Tag>
      )
    }
    case "div": {
      const {
        tag = "div",
        content = "Enter your text here",
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
      } = props

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

      // Map justify content values
      const justifyMap: Record<string, string> = {
        start: "flex-start",
        center: "center",
        between: "space-between",
        end: "flex-end",
      }

      // Map align items values
      const alignMap: Record<string, string> = {
        start: "flex-start",
        center: "center",
        end: "flex-end",
      }

      const designTextStyles: React.CSSProperties = {
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
        justifyContent: justifyMap[justifyContent] || justifyContent,
        alignItems: alignMap[alignItems] || alignItems,
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
        ...style,
      }

      const DesignTag = (tag || "div") as any
      return (
        <DesignTag className={cn("div-component", cls)} style={designTextStyles}>
          {content}
          {renderedChildren}
        </DesignTag>
      )
    }
    case "image": {
      const { src, alt, width, height, rounded } = props
      return (
        <img
          src={src || "/placeholder.svg?height=300&width=600&query=placeholder-image"}
          alt={alt}
          width={width}
          height={height}
          style={{ borderRadius: rounded, ...style }}
          className={cn("block", cls)}
        />
      )
    }
    case "button": {
      const { label, href, size = "md", rounded } = props
      const sizeProp = BUTTON_SIZE_MAP[size as keyof typeof BUTTON_SIZE_MAP] ?? "default"
      const content = (
        <Button size={sizeProp} className={cls} style={{ borderRadius: rounded, ...style }}>
          {label}
        </Button>
      )
      return href ? (
        <Button asChild size={sizeProp} className={cls} style={{ borderRadius: rounded, ...style }}>
          <a href={href}>{label}</a>
        </Button>
      ) : (
        content
      )
    }
    case "card": {
      const { title, description, padding } = props
      return (
        <Card className={cls} style={{ ...style }}>
          {(title || description) && (
            <CardHeader className={padding != null ? "pb-0" : undefined}>
              {title && <CardTitle className="text-sm font-semibold">{title}</CardTitle>}
              {description && <CardDescription className="text-xs">{description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent className={padding != null ? undefined : "pt-0"} style={padding != null ? { padding } : {}}>
            {renderedChildren}
          </CardContent>
        </Card>
      )
    }
    case "badge": {
      const { text, variant = "default" } = props
      const v = ["default", "secondary", "destructive", "outline"].includes(variant) ? variant : "default"
      return (
        <Badge variant={v as any} className={cls} style={{ ...style }}>
          {text}
        </Badge>
      )
    }
    case "avatar": {
      const { src, size = 48, rounded, alt } = props
      return (
        <Avatar className={cls} style={{ width: size, height: size, borderRadius: rounded, ...style }}>
          <AvatarImage src={src || "/placeholder.svg?height=80&width=80&query=avatar-placeholder"} alt={alt} />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
      )
    }
    case "alert": {
      const { variant = "info", title, description } = props
      const isDestructive = variant === "destructive"
      const extra =
        variant === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : variant === "warning"
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : variant === "info"
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : ""
      return (
        <Alert variant={isDestructive ? "destructive" : "default"} className={cn(extra, cls)} style={{ ...style }}>
          {title && <AlertTitle className="text-sm">{title}</AlertTitle>}
          {description && <AlertDescription className="text-xs">{description}</AlertDescription>}
          <div className="mt-2">{renderedChildren}</div>
        </Alert>
      )
    }
    case "separator": {
      const { orientation = "horizontal", thickness = 1, color } = props
      const sepClass = orientation === "vertical" ? cn("h-full", cls) : cn("w-full", cls)
      const styleInline =
        orientation === "vertical"
          ? ({ width: thickness, background: color, ...style } as React.CSSProperties)
          : ({ height: thickness, background: color, ...style } as React.CSSProperties)
      return <Separator orientation={orientation} className={sepClass} style={styleInline} />
    }
    default:
      console.warn('renderTree: Unknown component type', data.type)
      return null
    }
  } catch (error) {
    console.error('renderTree: Critical error', error, { nodeId })
    return <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs">Error rendering component</div>
  }
}

// Context-based live preview
export function LivePreview({ roots, version }: { roots: string[]; version: number }) {
  const ctx = (window as any).__CMS_BUILDER__ as
    | {
        nodesMap: Map<string, Node<CompNodeData>>
        childrenOf: Map<string, string[]>
      }
    | undefined
    
  if (!ctx || !ctx.nodesMap || !ctx.childrenOf) {
    return <div className="p-4 text-xs text-gray-500">Preview context missing</div>
  }

  // Validate roots array
  if (!Array.isArray(roots) || roots.length === 0) {
    return <div className="p-4 text-xs text-gray-500">No content to preview</div>
  }

  return (
    <div className="p-3 bg-white" data-version={version}>
      <ScrollArea className="max-h-full pr-2">
        {Array.from(new Set(roots))
          .filter((r) => typeof r === 'string' && r.length > 0)
          .map((r) => (
            <React.Fragment key={r}>{renderTree(r, ctx.nodesMap, ctx.childrenOf)}</React.Fragment>
          ))}
      </ScrollArea>
    </div>
  )
}
