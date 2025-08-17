"use client"
import { Handle, Position } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { cn } from "@/shared/lib/utils"
import { typeBadge } from "@/features/cms/widgets/core/utils"
import { Badge } from "@/components/ui/badge"

export function ComponentNode({
  data,
  id,
  selected,
}: {
  data: CompNodeData
  id: string
  selected?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-sm border bg-white min-w-[180px] transition-colors",
        selected ? "border-emerald-500 border-2" : "border-gray-200",
      )}
      data-is-selected={selected ? "true" : "false"}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-sm font-medium truncate">{data.label}</span>
        <Badge variant="secondary" className={cn("text-[10px]", typeBadge(data.type))}>
          {data.type}
        </Badge>
      </div>
      <div className="px-3 py-2 text-xs text-gray-500">
        <div className="truncate">id: {id}</div>
        <div className="opacity-80">
          {Object.keys(data.props || {})
            .slice(0, 3)
            .join(" · ")}
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
