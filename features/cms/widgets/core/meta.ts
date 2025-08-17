export const FIELD_SPECS = {
  section: [
    { key: "background", label: "Background", type: "color" },
    { key: "padding", label: "Padding", type: "text" },
    { key: "maxWidth", label: "Max Width", type: "text" },
    { key: "align", label: "Align", type: "select", options: ["left", "center", "right"] },
  ],
  row: [
    { key: "gap", label: "Gap", type: "number" },
    { key: "padding", label: "Padding", type: "text" },
    { key: "justify", label: "Justify", type: "select", options: ["start", "center", "between", "end"] },
    { key: "align", label: "Align", type: "select", options: ["start", "center", "end"] },
  ],
  column: [
    { key: "gap", label: "Gap", type: "number" },
    { key: "padding", label: "Padding", type: "text" },
    { key: "justify", label: "Justify", type: "select", options: ["start", "center", "between", "end"] },
    { key: "align", label: "Align", type: "select", options: ["start", "center", "end"] },
  ],
  text: [
    { key: "tag", label: "Tag", type: "select", options: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span"] },
    { key: "content", label: "Content", type: "textarea" },
    { key: "fontSize", label: "Font Size", type: "number" },
    { key: "color", label: "Color", type: "color" },
    {
      key: "weight",
      label: "Weight",
      type: "select",
      options: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    },
    { key: "align", label: "Align", type: "select", options: ["left", "center", "right", "justify"] },
  ],
  div: [
    // Typography
    { key: "tag", label: "Tag", type: "select", options: ["div", "p", "h1", "h2", "h3", "h4", "h5", "h6", "span"] },
    { key: "content", label: "Text Content", type: "textarea" },
    {
      key: "fontFamily",
      label: "Font Family",
      type: "select",
      options: ["Default", "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana"],
    },
    {
      key: "fontWeight",
      label: "Font Weight",
      type: "select",
      options: ["100", "200", "300", "Regular", "500", "600", "700", "800", "900"],
    },
    { key: "fontSize", label: "Font Size", type: "number" },
    { key: "lineHeight", label: "Line Height", type: "number", step: 0.1 },
    { key: "letterSpacing", label: "Letter Spacing", type: "number" },
    { key: "textAlign", label: "Text Align", type: "select", options: ["left", "center", "right", "justify"] },
    {
      key: "textDecoration",
      label: "Text Decoration",
      type: "select",
      options: ["none", "underline", "overline", "line-through"],
    },

    // Color & Background
    { key: "color", label: "Text Color", type: "color" },
    { key: "background", label: "Background", type: "color" },

    // Layout
    { key: "direction", label: "Direction", type: "select", options: ["ltr", "rtl"] },
    { key: "justifyContent", label: "Justify Content", type: "select", options: ["start", "center", "between", "end"] },
    { key: "alignItems", label: "Align Items", type: "select", options: ["start", "center", "end"] },
    { key: "gap", label: "Gap", type: "number" },

    // Margin
    { key: "marginTop", label: "Margin Top", type: "number" },
    { key: "marginRight", label: "Margin Right", type: "number" },
    { key: "marginBottom", label: "Margin Bottom", type: "number" },
    { key: "marginLeft", label: "Margin Left", type: "number" },

    // Padding
    { key: "paddingTop", label: "Padding Top", type: "number" },
    { key: "paddingRight", label: "Padding Right", type: "number" },
    { key: "paddingBottom", label: "Padding Bottom", type: "number" },
    { key: "paddingLeft", label: "Padding Left", type: "number" },

    // Border
    { key: "borderWidth", label: "Border Width", type: "number" },
    {
      key: "borderStyle",
      label: "Border Style",
      type: "select",
      options: ["solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"],
    },
    { key: "borderColor", label: "Border Color", type: "color" },
    { key: "borderRadius", label: "Border Radius", type: "number" },

    // Appearance
    { key: "opacity", label: "Opacity", type: "number", min: 0, max: 100 },
    { key: "boxShadow", label: "Box Shadow", type: "select", options: ["none", "sm", "md", "lg", "xl", "2xl"] },
  ],
  image: [
    { key: "src", label: "Source", type: "text" },
    { key: "alt", label: "Alt Text", type: "text" },
    { key: "width", label: "Width", type: "number" },
    { key: "height", label: "Height", type: "number" },
    { key: "rounded", label: "Border Radius", type: "number" },
  ],
  button: [
    { key: "label", label: "Label", type: "text" },
    { key: "href", label: "Link", type: "text" },
    { key: "size", label: "Size", type: "select", options: ["sm", "md", "lg"] },
    { key: "rounded", label: "Border Radius", type: "number" },
  ],
  card: [
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "padding", label: "Padding", type: "number" },
  ],
  badge: [
    { key: "text", label: "Text", type: "text" },
    { key: "variant", label: "Variant", type: "select", options: ["default", "secondary", "destructive", "outline"] },
  ],
  avatar: [
    { key: "src", label: "Source", type: "text" },
    { key: "size", label: "Size", type: "number" },
    { key: "rounded", label: "Border Radius", type: "number" },
    { key: "alt", label: "Alt Text", type: "text" },
  ],
  alert: [
    { key: "variant", label: "Variant", type: "select", options: ["info", "success", "warning", "destructive"] },
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
  ],
  separator: [
    { key: "orientation", label: "Orientation", type: "select", options: ["horizontal", "vertical"] },
    { key: "thickness", label: "Thickness", type: "number" },
    { key: "color", label: "Color", type: "color" },
  ],
} as const

export const BUTTON_SIZE_MAP = {
  sm: "sm",
  md: "default",
  lg: "lg",
} as const
