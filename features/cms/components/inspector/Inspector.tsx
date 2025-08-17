"use client"

import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { InspectorTabs } from "./InspectorTabs"
import { InspectorPanel } from "./InspectorPanel"
import { useInspectorState } from "../../hooks/useInspectorState"

interface InspectorProps {
  selected?: Node<CompNodeData>
  onChange: (updater: (d: CompNodeData) => CompNodeData) => void
  onDelete: () => void
  pinned: boolean
  setPinned: (v: boolean) => void
  onClose: () => void
  onReorderChildren: (parentId: string, newOrder: string[]) => void
}

export function Inspector({
  selected,
  onChange,
  onDelete,
  pinned,
  setPinned,
  onClose,
  onReorderChildren,
}: InspectorProps) {
  const inspectorState = useInspectorState(selected)

  return (
    <div className="bg-white border-l border-gray-200 w-80 h-full overflow-auto flex flex-col">
      <InspectorTabs
        selected={selected}
        pinned={pinned}
        setPinned={setPinned}
        onClose={onClose}
        onDelete={onDelete}
        inspectorState={inspectorState}
      />

      <div className="flex-1 overflow-auto">
        {selected && (
          <InspectorPanel
            selected={selected}
            onChange={onChange}
            onReorderChildren={onReorderChildren}
            inspectorState={inspectorState}
          />
        )}
      </div>
    </div>
  )
}
