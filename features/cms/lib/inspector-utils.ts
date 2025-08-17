export function categorizeWidgets(widgets: any[]) {
  return widgets.reduce(
    (acc, widget) => {
      const category = widget.category || "uncategorized"
      if (!acc[category]) acc[category] = []
      acc[category].push(widget)
      return acc
    },
    {} as Record<string, any[]>,
  )
}

export function generatePropertyForm(schema: any) {
  // Generate form configuration from property schema
  return {
    fields: [],
    validation: {},
  }
}

export function sanitizePropertyValue(value: any, type: string) {
  // Sanitize property values based on type
  switch (type) {
    case "string":
      return String(value || "")
    case "number":
      return Number(value) || 0
    case "boolean":
      return Boolean(value)
    default:
      return value
  }
}
