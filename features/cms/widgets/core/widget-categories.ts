import type { ComponentType } from "@/shared/types/schema"

export interface WidgetCategory {
  id: string
  name: string
  description: string
  icon: string
  widgets: ComponentType[]
}

export const WIDGET_CATEGORIES: WidgetCategory[] = [
  {
    id: "atoms",
    name: "Atoms",
    description: "Basic HTML elements and foundational components",
    icon: "atom",
    widgets: [
      "text",
      "design-text",
      "span",
      "div",
      "p",
      "h1",
      "h2",
      "h3",
      "a",
      "img",
      "input",
      "textarea",
      "label",
      "separator",
    ],
  },
  {
    id: "shadcn",
    name: "ShadCN UI",
    description: "Pre-styled components from the shadcn/ui design system",
    icon: "component",
    widgets: [
      "button",
      "card",
      "badge",
      "avatar",
      "alert",
      "image",
      "shadcn-button",
      "shadcn-card",
      "shadcn-input",
      "shadcn-badge",
      "shadcn-alert",
      "shadcn-label",
      "shadcn-textarea",
      "shadcn-checkbox",
      "shadcn-select",
      "shadcn-switch",
      "shadcn-radio-group",
      "shadcn-input-otp",
    ],
  },
  {
    id: "layout",
    name: "Layout",
    description: "Structural components for organizing and positioning content",
    icon: "layout",
    widgets: ["section", "container", "row", "column"],
  },
  {
    id: "collections",
    name: "Collections",
    description: "Complex pre-built components and templates",
    icon: "layers",
    widgets: ["contact-form", "hero-section", "navbar"],
  },
]

export function getWidgetCategory(widgetType: ComponentType): WidgetCategory | undefined {
  return WIDGET_CATEGORIES.find((category) => category.widgets.includes(widgetType))
}

export function getWidgetsByCategory(categoryId: string): ComponentType[] {
  const category = WIDGET_CATEGORIES.find((cat) => cat.id === categoryId)
  return category?.widgets || []
}

export function getAllWidgetTypes(): ComponentType[] {
  return WIDGET_CATEGORIES.flatMap((category) => category.widgets)
}

export function getCategoryStats() {
  return WIDGET_CATEGORIES.map((category) => ({
    id: category.id,
    name: category.name,
    count: category.widgets.length,
  }))
}
