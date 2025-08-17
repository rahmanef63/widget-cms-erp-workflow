import type { WidgetDefinition } from "../../shared/types"

export const labelWidget: WidgetDefinition = {
  type: "label",
  label: "Label",
  description: "Form label element",
  category: "atom",
  subcategory: "form",
  icon: "Type",
  properties: {
    content: {
      type: "string",
      label: "Label Text",
      defaultValue: "Label",
    },
    htmlFor: {
      type: "string",
      label: "For (Input ID)",
      defaultValue: "",
    },
    className: {
      type: "string",
      label: "CSS Classes",
      defaultValue: "block text-sm font-medium text-gray-700 mb-1",
    },
  },
  composition: {
    element: "label",
    props: ["content", "htmlFor", "className"],
  },
}
