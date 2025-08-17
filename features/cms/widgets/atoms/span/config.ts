import type { WidgetDefinition } from "../../shared/types"

export const spanWidget: WidgetDefinition = {
  type: "span",
  label: "Span",
  description: "Inline text element for styling portions of text",
  category: "atom",
  subcategory: "text",
  icon: "Type",
  properties: {
    content: {
      type: "string",
      label: "Content",
      defaultValue: "Text content",
    },
    className: {
      type: "string",
      label: "CSS Classes",
      defaultValue: "",
    },
  },
  composition: {
    element: "span",
    props: ["content", "className"],
  },
}
