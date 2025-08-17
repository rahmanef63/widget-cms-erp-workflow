import type { WidgetDefinition } from "../../shared/types"

export const imgWidget: WidgetDefinition = {
  type: "img",
  label: "Image",
  description: "Image element for displaying pictures",
  category: "atom",
  subcategory: "media",
  icon: "ImageIcon",
  properties: {
    src: {
      type: "string",
      label: "Image URL",
      defaultValue: "/placeholder.svg?height=200&width=300",
    },
    alt: {
      type: "string",
      label: "Alt Text",
      defaultValue: "Image description",
    },
    width: {
      type: "number",
      label: "Width",
      defaultValue: 300,
    },
    height: {
      type: "number",
      label: "Height",
      defaultValue: 200,
    },
    className: {
      type: "string",
      label: "CSS Classes",
      defaultValue: "rounded-lg",
    },
  },
  composition: {
    element: "img",
    props: ["src", "alt", "width", "height", "className"],
  },
}
