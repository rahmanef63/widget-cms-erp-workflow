import type { WidgetDefinition } from "../../shared/types"

export const shadcnWidgets: WidgetDefinition[] = [
  {
    type: "shadcn-button",
    name: "Button",
    icon: "MousePointer",
    category: "shadcn",
    defaultProps: {
      variant: "default",
      size: "default",
      disabled: false,
      composition: {
        type: "button",
        props: {
          className:
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          children: [
            {
              type: "span",
              props: {
                content: "Button",
                className: "",
              },
            },
          ],
        },
      },
    },
    propertySchema: [
      {
        key: "variant",
        label: "Variant",
        type: "select",
        options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
        section: "Style",
      },
      { key: "size", label: "Size", type: "select", options: ["default", "sm", "lg", "icon"], section: "Style" },
      { key: "disabled", label: "Disabled", type: "toggle", section: "State" },
      { key: "composition.props.children.0.props.content", label: "Button Text", type: "text", section: "Content" },
    ],
  },
  {
    type: "shadcn-card",
    name: "Card",
    icon: "CreditCard",
    category: "shadcn",
    defaultProps: {
      composition: {
        type: "div",
        props: {
          className: "rounded-lg border bg-card text-card-foreground shadow-sm",
          children: [
            {
              type: "div",
              props: {
                className: "flex flex-col space-y-1.5 p-6",
                children: [
                  {
                    type: "h3",
                    props: {
                      content: "Card Title",
                      className: "text-2xl font-semibold leading-none tracking-tight",
                    },
                  },
                  {
                    type: "p",
                    props: {
                      content: "Card description",
                      className: "text-sm text-muted-foreground",
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                className: "p-6 pt-0",
                children: [
                  {
                    type: "p",
                    props: {
                      content: "Card content goes here.",
                      className: "",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
    propertySchema: [
      {
        key: "composition.props.children.0.children.0.props.content",
        label: "Card Title",
        type: "text",
        section: "Content",
      },
      {
        key: "composition.props.children.0.children.1.props.content",
        label: "Card Description",
        type: "text",
        section: "Content",
      },
      {
        key: "composition.props.children.1.children.0.props.content",
        label: "Card Content",
        type: "textarea",
        section: "Content",
      },
    ],
  },
  {
    type: "shadcn-input",
    name: "Input",
    icon: "Type",
    category: "shadcn",
    defaultProps: {
      composition: {
        type: "input",
        props: {
          type: "text",
          placeholder: "Enter text...",
          className:
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        },
      },
    },
    propertySchema: [
      {
        key: "composition.props.type",
        label: "Input Type",
        type: "select",
        options: ["text", "email", "password", "number"],
        section: "Content",
      },
      { key: "composition.props.placeholder", label: "Placeholder", type: "text", section: "Content" },
    ],
  },
  {
    type: "shadcn-badge",
    name: "Badge",
    icon: "Tag",
    category: "shadcn",
    defaultProps: {
      variant: "default",
      composition: {
        type: "div",
        props: {
          className:
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          children: [
            {
              type: "span",
              props: {
                content: "Badge",
                className: "",
              },
            },
          ],
        },
      },
    },
    propertySchema: [
      {
        key: "variant",
        label: "Variant",
        type: "select",
        options: ["default", "secondary", "destructive", "outline"],
        section: "Style",
      },
      { key: "composition.props.children.0.props.content", label: "Badge Text", type: "text", section: "Content" },
    ],
  },
  {
    type: "shadcn-alert",
    name: "Alert",
    icon: "AlertTriangle",
    category: "shadcn",
    defaultProps: {
      variant: "default",
      composition: {
        type: "div",
        props: {
          className: "relative w-full rounded-lg border p-4",
          children: [
            {
              type: "h5",
              props: {
                content: "Alert Title",
                className: "mb-1 font-medium leading-none tracking-tight",
              },
            },
            {
              type: "div",
              props: {
                content: "Alert description goes here.",
                className: "text-sm opacity-90",
              },
            },
          ],
        },
      },
    },
    propertySchema: [
      { key: "variant", label: "Variant", type: "select", options: ["default", "destructive"], section: "Style" },
      { key: "composition.props.children.0.props.content", label: "Alert Title", type: "text", section: "Content" },
      {
        key: "composition.props.children.1.props.content",
        label: "Alert Description",
        type: "textarea",
        section: "Content",
      },
    ],
  },
  {
    type: "shadcn-label",
    name: "Label",
    icon: "Tag",
    category: "shadcn",
    defaultProps: {
      composition: {
        type: "label",
        props: {
          className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          children: [
            {
              type: "span",
              props: {
                content: "Label",
                className: "",
              },
            },
          ],
        },
      },
    },
    propertySchema: [
      { key: "composition.props.children.0.props.content", label: "Label Text", type: "text", section: "Content" },
      { key: "composition.props.htmlFor", label: "For (Input ID)", type: "text", section: "Content" },
    ],
  },
  {
    type: "shadcn-textarea",
    name: "Textarea",
    icon: "AlignLeft",
    category: "shadcn",
    defaultProps: {
      composition: {
        type: "textarea",
        props: {
          placeholder: "Enter your message...",
          rows: 4,
          className:
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        },
      },
    },
    propertySchema: [
      { key: "composition.props.placeholder", label: "Placeholder", type: "text", section: "Content" },
      { key: "composition.props.rows", label: "Rows", type: "number", section: "Layout" },
      { key: "composition.props.disabled", label: "Disabled", type: "toggle", section: "State" },
    ],
  },
  // Continued widgets...
]
