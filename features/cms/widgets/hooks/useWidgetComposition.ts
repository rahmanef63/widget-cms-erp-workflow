"use client"

import { useState, useCallback } from "react"
import type { WidgetComposition } from "../shared/types"

export function useWidgetComposition() {
  const [composition, setComposition] = useState<WidgetComposition | null>(null)

  const createComposition = useCallback((type: string, props: Record<string, any>) => {
    const newComposition: WidgetComposition = {
      type,
      props,
      children: [],
    }
    setComposition(newComposition)
    return newComposition
  }, [])

  const addChild = useCallback((child: WidgetComposition) => {
    setComposition((prev) => {
      if (!prev) return null
      return {
        ...prev,
        children: [...(prev.children || []), child],
      }
    })
  }, [])

  const removeChild = useCallback((index: number) => {
    setComposition((prev) => {
      if (!prev || !prev.children) return prev
      const newChildren = [...prev.children]
      newChildren.splice(index, 1)
      return {
        ...prev,
        children: newChildren,
      }
    })
  }, [])

  const updateChild = useCallback((index: number, updatedChild: WidgetComposition) => {
    setComposition((prev) => {
      if (!prev || !prev.children) return prev
      const newChildren = [...prev.children]
      newChildren[index] = updatedChild
      return {
        ...prev,
        children: newChildren,
      }
    })
  }, [])

  const updateProps = useCallback((newProps: Record<string, any>) => {
    setComposition((prev) => {
      if (!prev) return null
      return {
        ...prev,
        props: { ...prev.props, ...newProps },
      }
    })
  }, [])

  const clearComposition = useCallback(() => {
    setComposition(null)
  }, [])

  return {
    composition,
    createComposition,
    addChild,
    removeChild,
    updateChild,
    updateProps,
    clearComposition,
  }
}
