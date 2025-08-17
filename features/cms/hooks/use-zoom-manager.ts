"use client"

import { useState, useCallback } from "react"
import { ZoomManager } from "../lib/zoom"
import { ZOOM_LIMITS } from "../components/toolbar/constants"

export function useZoomManager(initialLevel: number = ZOOM_LIMITS.DEFAULT) {
  const [manager] = useState(() => new ZoomManager(initialLevel))
  const [zoomLevel, setZoomLevel] = useState(initialLevel)

  const zoomIn = useCallback(() => {
    const newLevel = manager.zoomIn()
    setZoomLevel(newLevel)
    return newLevel
  }, [manager])

  const zoomOut = useCallback(() => {
    const newLevel = manager.zoomOut()
    setZoomLevel(newLevel)
    return newLevel
  }, [manager])

  const resetZoom = useCallback(() => {
    const newLevel = manager.reset()
    setZoomLevel(newLevel)
    return newLevel
  }, [manager])

  const fitToScreen = useCallback(() => {
    const newLevel = manager.reset() // For now, same as reset
    setZoomLevel(newLevel)
    return newLevel
  }, [manager])

  const setLevel = useCallback(
    (level: number) => {
      const newLevel = manager.setLevel(level)
      setZoomLevel(newLevel)
      return newLevel
    },
    [manager],
  )

  return {
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
    setLevel,
    canZoomIn: manager.canZoomIn(),
    canZoomOut: manager.canZoomOut(),
  }
}
