export const WIDGET_CATEGORIES = {
  LAYOUT: "layout",
  CONTENT: "content",
  FORM: "form",
  MEDIA: "media",
  NAVIGATION: "navigation",
} as const

export type WidgetCategory = (typeof WIDGET_CATEGORIES)[keyof typeof WIDGET_CATEGORIES]

export function getWidgetCategory(widgetType: string): WidgetCategory {
  const categoryMap: Record<string, WidgetCategory> = {
    div: WIDGET_CATEGORIES.LAYOUT,
    text: WIDGET_CATEGORIES.CONTENT,
    button: WIDGET_CATEGORIES.FORM,
    image: WIDGET_CATEGORIES.MEDIA,
    link: WIDGET_CATEGORIES.NAVIGATION,
  }

  return categoryMap[widgetType] || WIDGET_CATEGORIES.CONTENT
}

export function filterWidgetsByCategory(widgets: any[], category: WidgetCategory) {
  return widgets.filter((widget) => getWidgetCategory(widget.type) === category)
}
