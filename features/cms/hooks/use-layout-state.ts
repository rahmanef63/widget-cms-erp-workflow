"use client"
import { useState } from "react"

export function useLayoutState() {
  // Layout toggles
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarPinned, setSidebarPinned] = useState(true)
  const [inspectorOpen, setInspectorOpen] = useState(true)
  const [inspectorPinned, setInspectorPinned] = useState(true)
  const [showGrid, setShowGrid] = useState(true)

  return {
    sidebarOpen,
    setSidebarOpen,
    sidebarPinned,
    setSidebarPinned,
    inspectorOpen,
    setInspectorOpen,
    inspectorPinned,
    setInspectorPinned,
    showGrid,
    setShowGrid,
  }
}
