"use client"

import { useState, useCallback } from "react"
import { CanvasManager } from "../lib/canvas"

export function useCanvasManager() {
  const [manager] = useState(() => new CanvasManager())
  const [panMode, setPanMode] = useState(false)
  const [locked, setLocked] = useState(false)
  const [gridVisible, setGridVisible] = useState(true)

  const togglePan = useCallback(() => {
    const newState = manager.togglePan()
    setPanMode(newState)
    return newState
  }, [manager])

  const toggleLock = useCallback(() => {
    const newState = manager.toggleLock()
    setLocked(newState)
    return newState
  }, [manager])

  const toggleGrid = useCallback(() => {
    const newState = manager.toggleGrid()
    setGridVisible(newState)
    return newState
  }, [manager])

  return {
    panMode,
    locked,
    gridVisible,
    togglePan,
    toggleLock,
    toggleGrid,
  }
}
