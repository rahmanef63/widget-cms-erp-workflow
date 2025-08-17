"use client"
import type { Node, Edge } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { PreviewManager } from "@/features/cms/components/PreviewManager"

interface PreviewPanelProps {
  nodes: Node<CompNodeData>[]
  edges: Edge[]
}

export function PreviewPanel({ nodes, edges }: PreviewPanelProps) {
  return (
    <div className="h-full w-full bg-white border-l">
      <PreviewManager nodes={nodes} edges={edges} />
    </div>
  )
}
