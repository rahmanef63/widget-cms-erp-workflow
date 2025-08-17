"use client"

import type React from "react"

import { useCallback, useMemo, useRef, useState } from "react"
import type { DndId, DndListOptions } from "./types"

// Lightweight HTML5 DnD hook for reordering lists; scoped by groupId
export function useDndList(opts: DndListOptions) {
  const { groupId, items, onReorder } = opts
  const [order, setOrder] = useState<DndId[]>(() => items.map((i) => i.id))
  const [dragId, setDragId] = useState<DndId | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  // keep local order in sync when items change externally
  const itemIds = useMemo(() => items.map((i) => i.id).join("|"), [items])
  const ensureOrder = useCallback(() => {
    const current = new Set(order)
    // append any new ids; keep existing relative order
    const next = items.map((i) => i.id).filter((id) => current.has(id))
    for (const it of items) {
      if (!next.includes(it.id)) next.push(it.id)
    }
    if (next.join("|") !== order.join("|")) setOrder(next)
  }, [items, order])
  // call once per render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(ensureOrder, [itemIds])

  const move = useCallback(
    (fromIdx: number, toIdx: number) => {
      if (toIdx < 0 || toIdx >= order.length || fromIdx === toIdx) return
      const next = order.slice()
      const [it] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, it)
      setOrder(next)
      onReorder(next)
    },
    [order, onReorder],
  )

  const onDragStart = useCallback(
    (ev: React.DragEvent, id: DndId) => {
      ev.dataTransfer.effectAllowed = "move"
      ev.dataTransfer.setData("text/dnd-group", groupId)
      ev.dataTransfer.setData("text/dnd-id", id)
      setDragId(id)
    },
    [groupId],
  )
  const onDragOver = useCallback(
    (ev: React.DragEvent) => {
      const g = ev.dataTransfer.getData("text/dnd-group")
      if (g === groupId) {
        ev.preventDefault()
        ev.dataTransfer.dropEffect = "move"
      }
    },
    [groupId],
  )

  const onDropOn = useCallback(
    (ev: React.DragEvent, targetId: DndId) => {
      ev.preventDefault()
      const g = ev.dataTransfer.getData("text/dnd-group")
      const id = ev.dataTransfer.getData("text/dnd-id")
      if (!id || g !== groupId || id === targetId) return
      const from = order.indexOf(id)
      const to = order.indexOf(targetId)
      if (from === -1 || to === -1) return
      move(from, to)
      setDragId(null)
    },
    [groupId, move, order],
  )
  const onDragEnd = useCallback(() => setDragId(null), [])

  // keyboard support: arrow up/down when focused on row
  const onKeyDown = useCallback(
    (ev: React.KeyboardEvent, id: DndId) => {
      const idx = order.indexOf(id)
      if (idx === -1) return
      if (ev.key === "ArrowUp") {
        ev.preventDefault()
        move(idx, idx - 1)
      } else if (ev.key === "ArrowDown") {
        ev.preventDefault()
        move(idx, idx + 1)
      }
    },
    [order, move],
  )

  return {
    listRef,
    order,
    setOrder,
    dragId,
    onDragStart,
    onDragOver,
    onDropOn,
    onDragEnd,
    onKeyDown,
  }
}
