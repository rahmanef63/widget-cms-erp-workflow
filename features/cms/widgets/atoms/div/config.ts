import type { WidgetDefinition } from "../../shared/types"

export const divWidget: WidgetDefinition = {
  type: "div",
  label: "Div",
  description: "Generic container element for grouping content",
  category: "atom",
  subcategory: "container",
  icon: "Square",
  properties: {
    className: {
      type: "string",
      label: "CSS Classes",
      defaultValue: "p-4",
    },
    children: {
      type: "array",
      label: "Children",
      defaultValue: [],
    },
  },
  composition: {
    element: "div",
    props: ["className", "children"],
  },
}
