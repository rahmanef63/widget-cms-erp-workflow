import type React from "react"
import type { ComponentType } from "@/shared/types/schema"
import type { Edge } from "reactflow"

export const typeBadge = (type: ComponentType) => {
  const map: Record<ComponentType, string> = {
    section: "bg-blue-100 text-blue-700",
    row: "bg-purple-100 text-purple-700",
    column: "bg-amber-100 text-amber-700",
    text: "bg-emerald-100 text-emerald-700",
    "design-text": "bg-emerald-200 text-emerald-800",
    image: "bg-rose-100 text-rose-700",
    button: "bg-sky-100 text-sky-700",
    card: "bg-teal-100 text-teal-700",
    badge: "bg-fuchsia-100 text-fuchsia-700",
    avatar: "bg-cyan-100 text-cyan-700",
    alert: "bg-amber-100 text-amber-700",
    separator: "bg-gray-100 text-gray-700",
    preview: "bg-gray-200 text-gray-700",
    span: "bg-green-100 text-green-700",
    div: "bg-indigo-100 text-indigo-700",
    p: "bg-emerald-100 text-emerald-700",
    h1: "bg-blue-200 text-blue-800",
    h2: "bg-blue-150 text-blue-750",
    h3: "bg-blue-100 text-blue-700",
    a: "bg-violet-100 text-violet-700",
    img: "bg-rose-100 text-rose-700",
    input: "bg-orange-100 text-orange-700",
    textarea: "bg-orange-150 text-orange-750",
    label: "bg-slate-100 text-slate-700",
    "shadcn-button": "bg-sky-200 text-sky-800",
    "shadcn-card": "bg-teal-200 text-teal-800",
    "shadcn-input": "bg-orange-200 text-orange-800",
    "shadcn-badge": "bg-fuchsia-200 text-fuchsia-800",
    "shadcn-alert": "bg-amber-200 text-amber-800",
    "contact-form": "bg-purple-200 text-purple-800",
    "hero-section": "bg-blue-300 text-blue-900",
    navbar: "bg-gray-300 text-gray-900",
  }
  return map[type] || "bg-gray-100 text-gray-700"
}

export const safeParseStyle = (styleJson: string): React.CSSProperties => {
  try {
    const obj = JSON.parse(styleJson || "{}")
    return obj as React.CSSProperties
  } catch {
    return {}
  }
}

export const arraysEqual = (a?: string[], b?: string[]) => {
  if (!a && !b) return true
  if (!a || !b) return false
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

export function computeChildrenMap(edges: Edge[]): Record<string, string[]> {
  // Build parent -> children map where an edge means CHILD -> PARENT.
  const childrenOf: Record<string, string[]> = {}
  for (const e of edges) {
    const parentId = e.target
    const childId = e.source
    if (!childrenOf[parentId]) childrenOf[parentId] = []
    childrenOf[parentId].push(childId)
  }
  return childrenOf
}

export function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
