"use client"

import { useMemo } from "react"
import { 
  getAllWidgets, 
  getWidgetsByCategory as getWidgetsByCategoryId, 
  getWidgetByType,
  WIDGET_REGISTRY 
} from "@/features/cms/widgets/core/widget-registry"

export function useWidgetRegistry() {
  const widgets = useMemo(() => {
    return getAllWidgets()
  }, [])

  const getWidget = (type: string) => {
    return getWidgetByType(type)
  }

  const getWidgetsByCategory = (categoryId: string) => {
    return getWidgetsByCategoryId(categoryId)
  }

  const registerWidget = (widget: any) => {
    // Registry is static, so this is a no-op for now
    console.warn("Dynamic widget registration not implemented")
    return false
  }

  return {
    widgets,
    getWidget,
    getWidgetsByCategory,
    registerWidget,
    registry: WIDGET_REGISTRY,
  }
}
