"use client"

import { useState, useCallback } from "react"

export interface NavigationState {
  activeSection: string
  isToolbarVisible: boolean
  canvasMode: "edit" | "preview"
}

export function useNavigationState() {
  const [state, setState] = useState<NavigationState>({
    activeSection: "widgets",
    isToolbarVisible: true,
    canvasMode: "edit",
  })

  const setActiveSection = useCallback((section: string) => {
    setState((prev) => ({ ...prev, activeSection: section }))
  }, [])

  const toggleToolbar = useCallback(() => {
    setState((prev) => ({ ...prev, isToolbarVisible: !prev.isToolbarVisible }))
  }, [])

  const setCanvasMode = useCallback((mode: "edit" | "preview") => {
    setState((prev) => ({ ...prev, canvasMode: mode }))
  }, [])

  return {
    ...state,
    setActiveSection,
    toggleToolbar,
    setCanvasMode,
  }
}
