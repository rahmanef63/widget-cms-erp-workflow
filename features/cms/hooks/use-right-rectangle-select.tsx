"use client"

import React from "react"

export type SelectionRect = { x: number; y: number; w: number; h: number; border: string; fill: string } | null

export function useRightRectangleSelect() {
  const wrapRef = React.useRef<HTMLDivElement | null>(null)
  const [active, setActive] = React.useState(false)
  const [start, setStart] = React.useState<{ x: number; y: number } | null>(null)
  const [curr, setCurr] = React.useState<{ x: number; y: number } | null>(null)

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 2) return
    const wrap = wrapRef.current
    if (!wrap) return
    const rect = wrap.getBoundingClientRect()
    setActive(true)
    setStart({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setCurr({ x: e.clientX - rect.left, y: e.clientY - rect.top })

    const onMove = (ev: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      setCurr({ x: ev.clientX - r.left, y: ev.clientY - r.top })
    }
    const onUp = () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      setActive(false)
      setCurr(null)
      setStart(null)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const rect: SelectionRect = React.useMemo(() => {
    if (!active || !start || !curr) return null
    const x = Math.min(start.x, curr.x)
    const y = Math.min(start.y, curr.y)
    const w = Math.abs(start.x - curr.x)
    const h = Math.abs(start.y - curr.y)
    const ltr = curr.x >= start.x
    const border = ltr ? "2px dashed #10b981" : "2px solid #f59e0b"
    const fill = ltr ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)"
    return { x, y, w, h, border, fill }
  }, [active, start, curr])

  // Compute selected ids given the current rectangle
  function computeSelectedIds(): { ids: Set<string>; ltr: boolean } {
    const wrap = wrapRef.current
    const s = start
    const c = curr
    const selected = new Set<string>()
    if (!wrap || !s || !c) return { ids: selected, ltr: true }

    const r = wrap.getBoundingClientRect()
    const end = { x: c.x, y: c.y }
    const ltr = end.x >= s.x
    const minX = Math.min(s.x, end.x)
    const minY = Math.min(s.y, end.y)
    const maxX = Math.max(s.x, end.x)
    const maxY = Math.max(s.y, end.y)

    const nodeEls = Array.from(wrap.querySelectorAll<HTMLElement>(".react-flow__node"))
    for (const el of nodeEls) {
      const id = el.getAttribute("data-id") || ""
      if (!id || id === "preview") continue
      const b = el.getBoundingClientRect()
      const br = {
        left: b.left - r.left,
        right: b.right - r.left,
        top: b.top - r.top,
        bottom: b.bottom - r.top,
      }
      const intersects = !(br.left > maxX || br.right < minX || br.top > maxY || br.bottom < minY)
      const enclosed = br.left >= minX && br.right <= maxX && br.top >= minY && br.bottom <= maxY
      if ((ltr && enclosed) || (!ltr && intersects)) {
        selected.add(id)
      }
    }
    return { ids: selected, ltr }
  }

  return { wrapRef, rect, onContextMenu, onMouseDown, computeSelectedIds }
}
