import type { WidgetDefinition } from "../../shared/types"

export const linkWidget: WidgetDefinition = {
  type: "a",
  label: "Link",
  description: "Hyperlink element for navigation",
  category: "atom",
  subcategory: "interactive",
  icon: "Link",
  properties: {
    href: {
      type: "string",
      label: "URL",
      defaultValue: "#",
    },
    content: {
      type: "string",
      label: "Link Text",
      defaultValue: "Click here",
    },
    target: {
      type: "select",
      label: "Target",
      options: ["_self", "_blank", "_parent", "_top"],
      defaultValue: "_self",
    },
    className: {
      type: "string",
      label: "CSS Classes",
      defaultValue: "text-blue-600 hover:text-blue-800 underline",
    },
  },
  composition: {
    element: "a",
    props: ["href", "content", "target", "className"],
  },
}
