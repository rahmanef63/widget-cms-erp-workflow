import type { WidgetDefinition } from "../../shared/types"

export const textWidgetConfig: WidgetDefinition = {
  type: "text",
  label: "Text",
  description: "Unified text element supporting paragraphs, headings, spans, and more",
  category: "atom",
  subcategory: "text",
  icon: "Type",
  defaultProps: {
    content: "Your text here",
    element: "p", // p, h1, h2, h3, h4, h5, h6, span
    fontSize: "base",
    fontWeight: "normal",
    textAlign: "left",
    color: "text-gray-900",
    className: "",
  },
  propertySchema: {
    content: {
      type: "string",
      label: "Content",
      description: "Text content",
      defaultValue: "Your text here",
    },
    element: {
      type: "select",
      label: "Element Type",
      description: "HTML element type",
      options: [
        { value: "p", label: "Paragraph" },
        { value: "h1", label: "Heading 1" },
        { value: "h2", label: "Heading 2" },
        { value: "h3", label: "Heading 3" },
        { value: "h4", label: "Heading 4" },
        { value: "h5", label: "Heading 5" },
        { value: "h6", label: "Heading 6" },
        { value: "span", label: "Span" },
      ],
      defaultValue: "p",
    },
    fontSize: {
      type: "select",
      label: "Font Size",
      description: "Text size",
      options: [
        { value: "xs", label: "Extra Small" },
        { value: "sm", label: "Small" },
        { value: "base", label: "Base" },
        { value: "lg", label: "Large" },
        { value: "xl", label: "Extra Large" },
        { value: "2xl", label: "2X Large" },
        { value: "3xl", label: "3X Large" },
        { value: "4xl", label: "4X Large" },
      ],
      defaultValue: "base",
    },
    fontWeight: {
      type: "select",
      label: "Font Weight",
      description: "Text weight",
      options: [
        { value: "light", label: "Light" },
        { value: "normal", label: "Normal" },
        { value: "medium", label: "Medium" },
        { value: "semibold", label: "Semibold" },
        { value: "bold", label: "Bold" },
      ],
      defaultValue: "normal",
    },
    textAlign: {
      type: "select",
      label: "Text Align",
      description: "Text alignment",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
        { value: "justify", label: "Justify" },
      ],
      defaultValue: "left",
    },
    color: {
      type: "string",
      label: "Text Color",
      description: "Text color class",
      defaultValue: "text-gray-900",
    },
  },
  composition: {
    element: "dynamic", // Will be determined by element prop
    props: {
      className: "text-{fontSize} font-{fontWeight} text-{textAlign} {color} {className}",
      children: "{content}",
    },
  },
  exportConfig: {
    json: {
      type: "text",
      props: ["content", "element", "fontSize", "fontWeight", "textAlign", "color", "className"],
    },
    typescript: {
      interface: "TextProps",
      component: "Text",
      imports: ["React"],
    },
    html: {
      tag: "{element}",
      attributes: ["class"],
      content: "{content}",
    },
  },
}
