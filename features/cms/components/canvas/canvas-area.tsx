"use client"

import type React from "react"
import type { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { Button } from "@/components/ui/button"
import ReactFlowLazy from "@/features/cms/components/canvas/reactflow-lazy"
import { nodeTypes } from "@/features/cms/types/node-types"

export function CanvasArea({
  sidebarOpen,
  inspectorOpen,
  onToggleSidebar,
  onToggleInspector,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectionChange,
  selRect,
  onContextMenu,
  onMouseDown,
  canvasRef,
}: {
  sidebarOpen: boolean
  inspectorOpen: boolean
  onToggleSidebar: () => void
  onToggleInspector: () => void
  nodes: Node<CompNodeData>[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  onSelectionChange: (params: { nodes: Node[]; edges: Edge[] }) => void
  selRect: { x: number; y: number; w: number; h: number; border: string; fill: string } | null
  onContextMenu: (e: React.MouseEvent) => void
  onMouseDown: (e: React.MouseEvent) => void
  canvasRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <div ref={canvasRef} className="relative" onContextMenu={onContextMenu} onMouseDown={onMouseDown}>
      <div className="absolute z-10 left-2 top-2 flex gap-2">
        <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur shadow" onClick={onToggleSidebar}>
          {sidebarOpen ? "Hide" : "Show"} Sidebar
        </Button>
        <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur shadow" onClick={onToggleInspector}>
          {inspectorOpen ? "Hide" : "Show"} Sheet
        </Button>
      </div>

      {selRect && (
        <div
          style={{
            position: "absolute",
            left: selRect.x,
            top: selRect.y,
            width: selRect.w,
            height: selRect.h,
            border: selRect.border,
            background: selRect.fill,
            zIndex: 9,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
      )}

      <ReactFlowLazy
        style={{ width: "100%", height: "100%", contain: "layout paint size" }}
        nodeTypes={nodeTypes}
        nodes={nodes as any}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        fitView={true}
      >
        {null}
      </ReactFlowLazy>
    </div>
  )
}
