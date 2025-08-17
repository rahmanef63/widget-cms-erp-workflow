"use client"

import { useMemo } from "react"
import { useSilenceResizeObserver } from "@/hooks/use-silence-resize-observer"
import type { Edge, Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { SchemaRenderer } from "@/features/page-generator/components/SchemaRenderer"

export default function RenderPage() {
  useSilenceResizeObserver()

  const params = useMemo(() => new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""), [])
  const schemaParam = params.get("schema")

  const content = useMemo(() => {
    if (!schemaParam)
      return { error: "Missing ?schema= param.", nodes: [] as Node<CompNodeData>[], edges: [] as Edge[] }
    try {
      const json = JSON.parse(decodeURIComponent(escape(atob(schemaParam))))
      const nodes: Node<CompNodeData>[] = (json.nodes || []).map((n: any) =>
        n.rfType ? { id: n.id, type: n.rfType, position: n.position, data: n.data } : n,
      )
      const edges: Edge[] = json.edges || []
      return { error: null, nodes, edges }
    } catch (e: any) {
      return { error: e?.message ?? "Invalid schema", nodes: [] as Node<CompNodeData>[], edges: [] as Edge[] }
    }
  }, [schemaParam])

  if (content.error) {
    return (
      <main className="min-h-dvh bg-gray-50">
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-xl font-semibold mb-2">Render</h1>
          <p className="text-sm text-red-600">{content.error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-white">
      <div className="max-w-[1200px] mx-auto p-6">
        <SchemaRenderer nodes={content.nodes} edges={content.edges} />
      </div>
    </main>
  )
}
