"use client"

import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { WidgetPropertyPanel } from "@/features/cms/components/inspector/WidgetPropertyPanel"

interface InspectorPanelProps {
  selected: Node<CompNodeData>
  onChange: (updater: (d: CompNodeData) => CompNodeData) => void
  onReorderChildren: (parentId: string, newOrder: string[]) => void
  inspectorState: any
}

export function InspectorPanel({ selected, onChange, onReorderChildren, inspectorState }: InspectorPanelProps) {
  if (!selected) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No component selected</p>
        <p className="text-xs mt-1">Select a component to edit its properties</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="font-medium text-sm text-gray-900 mb-2">{selected.data.type || "Component"}</h3>
        <p className="text-xs text-gray-500">ID: {selected.id}</p>
      </div>

      <WidgetPropertyPanel selected={selected} onChange={onChange} onReorderChildren={onReorderChildren} />
    </div>
  )
}
