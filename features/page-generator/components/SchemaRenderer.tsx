"use client"

import React, { useMemo } from "react"
import type { Edge, Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { renderTree } from "@/features/cms/widgets"

// A simple renderer to display a schema's roots
export function SchemaRenderer({ nodes, edges }: { nodes: Node<CompNodeData>[]; edges: Edge[] }) {
  const nodesMap = useMemo(() => new Map(nodes.map((n) => [n.id, n] as const)), [nodes])
  const childrenOf = useMemo(() => {
    const m = new Map<string, string[]>()
    for (const e of edges) {
      const parentId = e.target
      const childId = e.source
      if (!m.has(parentId)) m.set(parentId, [])
      m.get(parentId)!.push(childId)
    }
    return m
  }, [edges])

  // Find roots: nodes not appearing as a source (no parent)
  const sourceIds = new Set(edges.map((e) => e.source))
  const roots = nodes.map((n) => n.id).filter((id) => !sourceIds.has(id) && id !== "preview")

  return (
    <div className="w-full">
      {roots.length ? (
        roots.map((r) => <React.Fragment key={r}>{renderTree(r, nodesMap as any, childrenOf)}</React.Fragment>)
      ) : (
        <div className="text-sm text-gray-500">No roots found in schema.</div>
      )}
    </div>
  )
}
