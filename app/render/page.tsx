"use client"

import React from "react"
import type { Edge, Node } from "reactflow"
import { cn } from "@/lib/utils"
import RenderPage from "@/features/page-generator/pages/RenderPage"

type ComponentType =
  | "section"
  | "row"
  | "column"
  | "text"
  | "image"
  | "button"
  | "card"
  | "badge"
  | "avatar"
  | "alert"
  | "separator"
  | "preview"

type CompProps = Record<string, any>
type CompNodeData = {
  type: ComponentType
  label: string
  props: CompProps
}

function safeParseStyle(styleJson: string): React.CSSProperties {
  try {
    const obj = JSON.parse(styleJson || "{}")
    return obj as React.CSSProperties
  } catch {
    return {}
  }
}

function computeChildrenMap(edges: Edge[]): Map<string, string[]> {
  const childrenOf = new Map<string, string[]>()
  for (const e of edges) {
    const parentId = e.target
    const childId = e.source
    if (!childrenOf.has(parentId)) childrenOf.set(parentId, [])
    childrenOf.get(parentId)!.push(childId)
  }
  return childrenOf
}

function renderTree(
  nodeId: string,
  nodesMap: Map<string, Node<CompNodeData>>,
  childrenOf: Map<string, string[]>,
): React.ReactNode {
  const node = nodesMap.get(nodeId)
  if (!node) return null
  const data = node.data

  const children = (childrenOf.get(nodeId) || []).sort((a, b) => {
    const na = nodesMap.get(a)
    const nb = nodesMap.get(b)
    return (na?.position.x || 0) - (nb?.position.x || 0)
  })
  const renderedChildren = children.map((cid) => (
    <React.Fragment key={cid}>{renderTree(cid, nodesMap, childrenOf)}</React.Fragment>
  ))

  const style = safeParseStyle((data.props as any)?.styleJson || "{}")
  const cls = (data.props as any)?.className || ""

  switch (data.type) {
    case "section": {
      const { background, padding, maxWidth, align } = data.props
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
      const { gap, padding, justify, align } = data.props
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
      const { gap, padding, justify, align } = data.props
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
      const { tag, content, fontSize, color, weight, align } = data.props
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
    case "image": {
      const { src, alt, width, height, rounded } = data.props
      return (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          style={{ borderRadius: rounded, ...style }}
          className={cn("block", cls)}
        />
      )
    }
    case "button": {
      const { label, href, size, rounded } = data.props
      const pad = size === "sm" ? "px-3 py-1.5" : size === "lg" ? "px-6 py-3" : "px-4 py-2"
      return (
        <a
          href={href}
          className={cn("inline-block bg-black text-white", pad, cls)}
          style={{ borderRadius: rounded, ...style }}
        >
          {label}
        </a>
      )
    }
    case "card": {
      const { title, description, padding } = data.props
      return (
        <div className={cn("rounded-2xl border shadow-sm bg-white", cls)} style={{ padding, ...style }}>
          {title && <div className="text-sm font-semibold mb-1">{title}</div>}
          {description && <div className="text-xs text-gray-600">{description}</div>}
          <div className="mt-2">{renderedChildren}</div>
        </div>
      )
    }
    case "badge": {
      const { text, variant } = data.props
      const classes =
        variant === "destructive"
          ? "bg-red-100 text-red-700"
          : variant === "secondary"
            ? "bg-gray-100 text-gray-700"
            : variant === "outline"
              ? "border text-gray-700"
              : "bg-black text-white"
      return (
        <span className={cn("inline-block text-[10px] px-2 py-1 rounded", classes, cls)} style={{ ...style }}>
          {text}
        </span>
      )
    }
    case "avatar": {
      const { src, size, rounded, alt } = data.props
      return (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          style={{ width: size, height: size, borderRadius: rounded, ...style }}
          className={cls}
        />
      )
    }
    case "alert": {
      const { variant, title, description } = data.props
      const palette =
        variant === "success"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : variant === "warning"
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : variant === "destructive"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
      return (
        <div className={cn("border rounded-xl p-3", palette, cls)} style={{ ...style }}>
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-xs opacity-80">{description}</div>}
          <div className="mt-2">{renderedChildren}</div>
        </div>
      )
    }
    case "separator": {
      const { orientation, thickness, color } = data.props
      return orientation === "vertical" ? (
        <div className={cls} style={{ width: thickness, background: color, ...style }} />
      ) : (
        <div className={cls} style={{ height: thickness, background: color, ...style }} />
      )
    }
    default:
      return null
  }
}

function getRootsFromEdges(nodes: Node<CompNodeData>[], edges: Edge[]) {
  const previewId = "preview"
  const hasPreview = nodes.some((n) => n.id === previewId || n.type === "preview")
  if (hasPreview) {
    const nodesMap = new Map(nodes.map((n) => [n.id, n] as const))
    return edges.filter((e) => nodesMap.get(e.target)?.data.type === "preview").map((e) => e.source)
  }
  // Otherwise, compute roots as nodes that are not a child of anyone (not present as source -> parent target)
  const sourceIds = new Set(edges.map((e) => e.source))
  const targetIds = new Set(edges.map((e) => e.target))
  // Root nodes have no parent -> they never appear as source's child? In this schema child->parent, "being a child" means appearing as source.
  // So a root is a node that is NOT a source in any edge (i.e., it has no parent).
  const rootIds = nodes.map((n) => n.id).filter((id) => !sourceIds.has(id) && !["preview"].includes(id))
  // Fallback: if all nodes are sources, just pick those not targeting others (unlikely)
  return rootIds.length ? rootIds : nodes.map((n) => n.id).filter((id) => !targetIds.has(id))
}

export default function Page() {
  return <RenderPage />
}
