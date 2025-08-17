import type { WidgetDefinition } from "../../shared/types"

export const paragraphWidget: WidgetDefinition = {
  type: "p",
  label: "Paragraph",
  description: "Block-level text element for paragraphs",
  category: "atom",
  subcategory: "text",
  icon: "Type",
  properties: {
    content: {
      type: "string",
      label: "Content",
      defaultValue: "This is a paragraph of text.",
    },
    className: {
      type: "string",
      label: "CSS Classes",
      defaultValue: "text-base leading-relaxed",
    },
  },
  composition: {
    element: "p",
    props: ["content", "className"],
  },
}
