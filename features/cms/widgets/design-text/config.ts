import type { WidgetDefinition } from "../shared/types"

export const divConfig: WidgetDefinition = {
  type: "div",
  name: "Div Element",
  icon: "Square",
  category: "Layout",
  defaultProps: {
    tag: "div",
    content: "Enter your text here",
    fontFamily: "Default",
    fontWeight: "Regular",
    fontSize: 16,
    lineHeight: 1.75,
    letterSpacing: 0,
    textAlign: "left",
    textDecoration: "none",
    color: "#000000",
    background: "transparent",
    direction: "ltr",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 16,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "#000000",
    borderRadius: 0,
    opacity: 100,
    boxShadow: "none",
  },
  propertySchema: [
    // Typography Section
    {
      key: "tag",
      label: "HTML Tag",
      type: "select",
      options: ["div", "p", "h1", "h2", "h3", "h4", "h5", "h6", "span"],
      section: "Typography",
    },
    { key: "content", label: "Text Content", type: "textarea", section: "Typography" },
    {
      key: "fontFamily",
      label: "Font Family",
      type: "select",
      options: ["Default", "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana"],
      section: "Typography",
    },
    {
      key: "fontWeight",
      label: "Font Weight",
      type: "select",
      options: ["100", "200", "300", "Regular", "500", "600", "700", "800", "900"],
      section: "Typography",
    },
    { key: "fontSize", label: "Font Size", type: "number", min: 8, section: "Typography" },
    { key: "lineHeight", label: "Line Height", type: "number", min: 0.5, step: 0.1, section: "Typography" },
    { key: "letterSpacing", label: "Letter Spacing", type: "number", step: 0.1, section: "Typography" },
    {
      key: "textAlign",
      label: "Text Align",
      type: "select",
      options: ["left", "center", "right", "justify"],
      section: "Typography",
    },
    {
      key: "textDecoration",
      label: "Text Decoration",
      type: "select",
      options: ["none", "underline", "overline", "line-through"],
      section: "Typography",
    },

    // Color Section
    { key: "color", label: "Text Color", type: "color", section: "Color" },
    { key: "background", label: "Background", type: "color", section: "Color" },

    // Layout Section
    { key: "direction", label: "Direction", type: "select", options: ["ltr", "rtl"], section: "Layout" },
    {
      key: "justifyContent",
      label: "Justify Content",
      type: "select",
      options: ["flex-start", "center", "space-between", "flex-end"],
      section: "Layout",
    },
    {
      key: "alignItems",
      label: "Align Items",
      type: "select",
      options: ["flex-start", "center", "flex-end"],
      section: "Layout",
    },
    { key: "gap", label: "Gap", type: "number", min: 0, section: "Layout" },

    // Margin Section
    { key: "marginTop", label: "Margin Top", type: "number", min: 0, section: "Margin" },
    { key: "marginRight", label: "Margin Right", type: "number", min: 0, section: "Margin" },
    { key: "marginBottom", label: "Margin Bottom", type: "number", min: 0, section: "Margin" },
    { key: "marginLeft", label: "Margin Left", type: "number", min: 0, section: "Margin" },

    // Padding Section
    { key: "paddingTop", label: "Padding Top", type: "number", min: 0, section: "Padding" },
    { key: "paddingRight", label: "Padding Right", type: "number", min: 0, section: "Padding" },
    { key: "paddingBottom", label: "Padding Bottom", type: "number", min: 0, section: "Padding" },
    { key: "paddingLeft", label: "Padding Left", type: "number", min: 0, section: "Padding" },

    // Border Section
    { key: "borderWidth", label: "Border Width", type: "number", min: 0, section: "Border" },
    {
      key: "borderStyle",
      label: "Border Style",
      type: "select",
      options: ["solid", "dashed", "dotted", "double"],
      section: "Border",
    },
    { key: "borderColor", label: "Border Color", type: "color", section: "Border" },
    { key: "borderRadius", label: "Border Radius", type: "number", min: 0, section: "Border" },

    // Appearance Section
    { key: "opacity", label: "Opacity", type: "number", min: 0, max: 100, section: "Appearance" },
    {
      key: "boxShadow",
      label: "Box Shadow",
      type: "select",
      options: ["none", "sm", "md", "lg", "xl", "2xl"],
      section: "Appearance",
    },
  ],
}
