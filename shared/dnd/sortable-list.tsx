"use client"

import React from "react"
import type { DndItem, DndListOptions } from "./types"
import { useDndList } from "./use-dnd-list"

export function SortableList({
  groupId,
  items,
  onReorder,
  getRightActions,
}: DndListOptions & {
  getRightActions?: (item: DndItem, index: number) => React.ReactNode
}) {
  const { listRef, order, dragId, onDragStart, onDragOver, onDropOn, onDragEnd, onKeyDown } = useDndList({
    groupId,
    items,
    onReorder,
  })

  const itemMap = React.useMemo(() => {
    const map = new Map(items.map((i) => [i.id, i] as const))
    return map
  }, [items])

  return (
    <div ref={listRef} className="rounded-lg border divide-y">
      {order.length === 0 && <div className="text-xs text-gray-500 p-3">No items.</div>}
      {order.map((id, idx) => {
        const it = itemMap.get(id)
        if (!it) return null
        const isDragging = dragId === id
        return (
          <div
            key={id}
            role="option"
            aria-selected={isDragging ? "true" : "false"}
            tabIndex={0}
            onKeyDown={(e) => onKeyDown(e, id)}
            className={["flex items-center justify-between px-3 py-2 bg-white", isDragging ? "opacity-60" : ""].join(
              " ",
            )}
            draggable
            onDragStart={(e) => onDragStart(e, id)}
            onDragOver={onDragOver}
            onDrop={(e) => onDropOn(e, id)}
            onDragEnd={onDragEnd}
          >
            <div className="flex items-center gap-2">
              <span aria-hidden className="cursor-grab text-gray-500 select-none">
                ⋮⋮
              </span>
              <span className="text-xs font-mono">{it.id}</span>
              {it.label ? <span className="text-xs text-gray-700">{it.label}</span> : null}
            </div>
            <div className="flex items-center gap-1">{getRightActions ? getRightActions(it, idx) : null}</div>
          </div>
        )
      })}
    </div>
  )
}
