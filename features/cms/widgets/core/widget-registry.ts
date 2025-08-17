import type { WidgetDefinition } from "../shared/types"
import { textWidgetConfig } from "../atoms/text/config"
import { divWidget } from "../atoms/div/config"
import { imgWidget } from "../atoms/image/config"
import { labelWidget } from "../atoms/label/config"
import { linkWidget } from "../atoms/link/config"
import { paragraphWidget } from "../atoms/paragraph/config"
import { spanWidget } from "../atoms/span/config"
import { shadcnWidgets } from "../shadcn/composed-widgets"
import { collectionWidgets } from "../collections/complex-widgets"

export interface WidgetCategory {
  id: string
  label: string
  description: string
  icon: string
  widgets: WidgetDefinition[]
}

export interface WidgetSubcategory {
  id: string
  name: string
  description: string
  widgets: WidgetDefinition[]
}

export const WIDGET_REGISTRY: Record<string, WidgetCategory> = {
  atoms: {
    id: "atoms",
    label: "Atoms",
    description: "Basic HTML elements that form the foundation of all components",
    icon: "Atom",
    widgets: [textWidgetConfig, divWidget, paragraphWidget, spanWidget, linkWidget, labelWidget, imgWidget],
  },
  shadcn: {
    id: "shadcn",
    label: "ShadCN UI",
    description: "Pre-styled UI components from the shadcn/ui design system",
    icon: "Component",
    widgets: shadcnWidgets,
  },
  layout: {
    id: "layout",
    label: "Layout",
    description: "Structural components for organizing content and creating layouts",
    icon: "Layout",
    widgets: [
      {
        type: "section",
        name: "Section",
        description: "Main content section with semantic HTML",
        category: "layout",
        icon: "Square",
        version: "1.0.0",
        defaultProps: {
          className: "py-8",
          children: [],
        },
        propertySchema: [{ key: "className", label: "CSS Classes", type: "text" }],
      },
      {
        type: "container",
        name: "Container",
        description: "Responsive container for content width management",
        category: "layout",
        icon: "Square",
        version: "1.0.0",
        defaultProps: {
          className: "container mx-auto px-4",
          children: [],
        },
        propertySchema: [{ key: "className", label: "CSS Classes", type: "text" }],
      },
    ],
  },
  collections: {
    id: "collections",
    label: "Collections",
    description: "Complex pre-built components combining multiple elements",
    icon: "Layers",
    widgets: collectionWidgets,
  },
}

export const ATOMIC_SUBCATEGORIES: WidgetSubcategory[] = [
  {
    id: "text",
    name: "Text Elements",
    description: "Typography and text content elements",
    widgets: [textWidgetConfig, paragraphWidget, spanWidget],
  },
  {
    id: "containers",
    name: "Containers",
    description: "Layout and grouping elements for organizing content",
    widgets: [divWidget],
  },
  {
    id: "interactive",
    name: "Interactive",
    description: "Clickable and interactive elements",
    widgets: [linkWidget],
  },
  {
    id: "media",
    name: "Media",
    description: "Images, videos, and media elements",
    widgets: [imgWidget],
  },
  {
    id: "forms",
    name: "Form Elements",
    description: "Form inputs, labels, and controls",
    widgets: [labelWidget],
  },
]

export const WIDGET_CATEGORIES: WidgetCategory[] = Object.values(WIDGET_REGISTRY)

export function getAllWidgets(): WidgetDefinition[] {
  return Object.values(WIDGET_REGISTRY).flatMap((category) => category.widgets)
}

export function getWidgetsByCategory(categoryId: string): WidgetDefinition[] {
  const category = WIDGET_REGISTRY[categoryId]
  return category ? category.widgets : []
}

export function getWidgetsBySubcategory(subcategoryId: string): WidgetDefinition[] {
  const subcategory = ATOMIC_SUBCATEGORIES.find((sub) => sub.id === subcategoryId)
  return subcategory ? subcategory.widgets : []
}

export function getWidgetByType(type: string): WidgetDefinition | undefined {
  return getAllWidgets().find((widget) => widget.type === type)
}

export function getCategoryByWidgetType(type: string): WidgetCategory | undefined {
  return Object.values(WIDGET_REGISTRY).find((category) => category.widgets.some((widget) => widget.type === type))
}

export function validateWidgetRegistry(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const allWidgets = getAllWidgets()
  const typesSeen = new Set<string>()

  for (const widget of allWidgets) {
    if (typesSeen.has(widget.type)) {
      errors.push(`Duplicate widget type: ${widget.type}`)
    }
    typesSeen.add(widget.type)

    if (!widget.name || !widget.description || !widget.category) {
      errors.push(`Incomplete widget definition: ${widget.type}`)
    }
  }

  return { valid: errors.length === 0, errors }
}

export function getRegistryStats() {
  const categories = Object.keys(WIDGET_REGISTRY).length
  const totalWidgets = getAllWidgets().length
  const widgetsByCategory = Object.entries(WIDGET_REGISTRY).reduce(
    (acc, [key, category]) => {
      acc[key] = category.widgets.length
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    categories,
    totalWidgets,
    widgetsByCategory,
    subcategories: ATOMIC_SUBCATEGORIES.length,
  }
}

// Legacy compatibility exports
export const WIDGET_CATEGORIES_V2 = WIDGET_CATEGORIES
