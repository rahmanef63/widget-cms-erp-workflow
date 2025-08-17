"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/shared/lib/utils"
import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { Inspector } from "./Inspector"

export function InspectorWrapper({
  open,
  pinned,
  onTogglePin,
  onRequestClose,
  selected,
  onChange,
  onDelete,
  onReorderChildren,
}: {
  open: boolean
  pinned: boolean
  onTogglePin: () => void
  onRequestClose: () => void
  selected?: Node<CompNodeData>
  onChange: (updater: (d: CompNodeData) => CompNodeData) => void
  onDelete: () => void
  onReorderChildren: (parentId: string, newOrder: string[]) => void
}) {
  return (
    <aside
      className={cn(
        "border-l bg-white flex flex-col transition-all duration-300",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div className="border-b p-2 text-xs text-gray-600 flex items-center justify-between">
        <span>Sheet (Config only)</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={onTogglePin}>
            {pinned ? "Unpin" : "Pin"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => (!pinned ? onRequestClose() : null)}>
            Close
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <Inspector
          selected={selected as any}
          onChange={onChange}
          onDelete={onDelete}
          pinned={pinned}
          setPinned={() => onTogglePin()}
          onClose={onRequestClose}
          onReorderChildren={onReorderChildren}
        />
      </div>
    </aside>
  )
}
