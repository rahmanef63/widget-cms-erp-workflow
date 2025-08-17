"use client"

import { useMemo } from "react"
import { WIDGET_CATEGORIES, getWidgetCategory, getWidgetsByCategory, getCategoryStats } from "../core/widget-categories"
import type { ComponentType } from "@/shared/types/schema"

export function useWidgetCategories() {
  const categories = useMemo(() => WIDGET_CATEGORIES, [])

  const getCategoryForWidget = useMemo(
    () => (widgetType: ComponentType) => {
      return getWidgetCategory(widgetType)
    },
    [],
  )

  const getWidgetsInCategory = useMemo(
    () => (categoryId: string) => {
      return getWidgetsByCategory(categoryId)
    },
    [],
  )

  const categoryStats = useMemo(() => getCategoryStats(), [])

  const searchWidgets = useMemo(
    () => (query: string) => {
      const lowerQuery = query.toLowerCase()
      const results: Array<{ widget: ComponentType; category: string }> = []

      categories.forEach((category) => {
        category.widgets.forEach((widget) => {
          if (
            widget.toLowerCase().includes(lowerQuery) ||
            category.name.toLowerCase().includes(lowerQuery) ||
            category.description.toLowerCase().includes(lowerQuery)
          ) {
            results.push({ widget, category: category.id })
          }
        })
      })

      return results
    },
    [categories],
  )

  const getWidgetsByTag = useMemo(
    () => (tag: string) => {
      // This would be enhanced with actual tag data from widget definitions
      return categories.flatMap((category) => category.widgets)
    },
    [categories],
  )

  return {
    categories,
    categoryStats,
    getCategoryForWidget,
    getWidgetsInCategory,
    searchWidgets,
    getWidgetsByTag,
  }
}
