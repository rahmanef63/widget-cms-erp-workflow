import type { WidgetDefinition } from "../shared/types"

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
  {
    type: "shadcn-checkbox",
    name: "Checkbox",
    icon: "CheckSquare",
    category: "shadcn",
    defaultProps: {
      composition: {
        type: "div",
        props: {
          className: "flex items-center space-x-2",
          children: [
            {
              type: "input",
              props: {
                type: "checkbox",
                id: "checkbox",
                className:
                  "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
              },
            },
            {
              type: "label",
              props: {
                htmlFor: "checkbox",
                className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                children: [
                  {
                    type: "span",
                    props: {
                      content: "Accept terms and conditions",
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
        key: "composition.props.children.1.props.children.0.props.content",
        label: "Label Text",
        type: "text",
        section: "Content",
      },
      { key: "composition.props.children.0.props.checked", label: "Checked", type: "toggle", section: "State" },
      { key: "composition.props.children.0.props.disabled", label: "Disabled", type: "toggle", section: "State" },
    ],
  },
  {
    type: "shadcn-select",
    name: "Select",
    icon: "ChevronDown",
    category: "shadcn",
    defaultProps: {
      composition: {
        type: "select",
        props: {
          className:
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          children: [
            {
              type: "option",
              props: {
                value: "",
                content: "Select an option",
                className: "",
              },
            },
            {
              type: "option",
              props: {
                value: "option1",
                content: "Option 1",
                className: "",
              },
            },
            {
              type: "option",
              props: {
                value: "option2",
                content: "Option 2",
                className: "",
              },
            },
          ],
        },
      },
    },
    propertySchema: [
      { key: "composition.props.children.0.props.content", label: "Placeholder", type: "text", section: "Content" },
      { key: "composition.props.children.1.props.content", label: "Option 1", type: "text", section: "Content" },
      { key: "composition.props.children.2.props.content", label: "Option 2", type: "text", section: "Content" },
      { key: "composition.props.disabled", label: "Disabled", type: "toggle", section: "State" },
    ],
  },
  {
    type: "shadcn-switch",
    name: "Switch",
    icon: "ToggleLeft",
    category: "shadcn",
    defaultProps: {
      composition: {
        type: "div",
        props: {
          className: "flex items-center space-x-2",
          children: [
            {
              type: "button",
              props: {
                role: "switch",
                "aria-checked": "false",
                className:
                  "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
                children: [
                  {
                    type: "span",
                    props: {
                      className:
                        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
                      content: "",
                    },
                  },
                ],
              },
            },
            {
              type: "label",
              props: {
                className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                children: [
                  {
                    type: "span",
                    props: {
                      content: "Enable notifications",
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
        key: "composition.props.children.1.props.children.0.props.content",
        label: "Label Text",
        type: "text",
        section: "Content",
      },
      { key: "composition.props.children.0.props.aria-checked", label: "Checked", type: "toggle", section: "State" },
      { key: "composition.props.children.0.props.disabled", label: "Disabled", type: "toggle", section: "State" },
    ],
  },
  {
    type: "shadcn-radio-group",
    name: "Radio Group",
    icon: "Circle",
    category: "shadcn",
    defaultProps: {
      composition: {
        type: "div",
        props: {
          className: "grid gap-2",
          children: [
            {
              type: "div",
              props: {
                className: "flex items-center space-x-2",
                children: [
                  {
                    type: "input",
                    props: {
                      type: "radio",
                      id: "option-one",
                      name: "radio-group",
                      value: "option-one",
                      className:
                        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    },
                  },
                  {
                    type: "label",
                    props: {
                      htmlFor: "option-one",
                      className:
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                      children: [
                        {
                          type: "span",
                          props: {
                            content: "Option One",
                            className: "",
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                className: "flex items-center space-x-2",
                children: [
                  {
                    type: "input",
                    props: {
                      type: "radio",
                      id: "option-two",
                      name: "radio-group",
                      value: "option-two",
                      className:
                        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    },
                  },
                  {
                    type: "label",
                    props: {
                      htmlFor: "option-two",
                      className:
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                      children: [
                        {
                          type: "span",
                          props: {
                            content: "Option Two",
                            className: "",
                          },
                        },
                      ],
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
        key: "composition.props.children.0.children.1.props.children.0.props.content",
        label: "Option 1 Text",
        type: "text",
        section: "Content",
      },
      {
        key: "composition.props.children.1.children.1.props.children.0.props.content",
        label: "Option 2 Text",
        type: "text",
        section: "Content",
      },
      {
        key: "composition.props.children.0.children.0.props.checked",
        label: "Option 1 Selected",
        type: "toggle",
        section: "State",
      },
      {
        key: "composition.props.children.1.children.0.props.checked",
        label: "Option 2 Selected",
        type: "toggle",
        section: "State",
      },
    ],
  },
  {
    type: "shadcn-input-otp",
    name: "Input OTP",
    icon: "Hash",
    category: "shadcn",
    defaultProps: {
      composition: {
        type: "div",
        props: {
          className: "flex items-center gap-2",
          children: [
            {
              type: "input",
              props: {
                type: "text",
                maxLength: 1,
                className:
                  "flex h-10 w-10 rounded-md border border-input bg-background text-center text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                placeholder: "0",
              },
            },
            {
              type: "input",
              props: {
                type: "text",
                maxLength: 1,
                className:
                  "flex h-10 w-10 rounded-md border border-input bg-background text-center text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                placeholder: "0",
              },
            },
            {
              type: "input",
              props: {
                type: "text",
                maxLength: 1,
                className:
                  "flex h-10 w-10 rounded-md border border-input bg-background text-center text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                placeholder: "0",
              },
            },
            {
              type: "input",
              props: {
                type: "text",
                maxLength: 1,
                className:
                  "flex h-10 w-10 rounded-md border border-input bg-background text-center text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                placeholder: "0",
              },
            },
          ],
        },
      },
    },
    propertySchema: [
      {
        key: "composition.props.children.0.props.placeholder",
        label: "Digit 1 Placeholder",
        type: "text",
        section: "Content",
      },
      {
        key: "composition.props.children.1.props.placeholder",
        label: "Digit 2 Placeholder",
        type: "text",
        section: "Content",
      },
      {
        key: "composition.props.children.2.props.placeholder",
        label: "Digit 3 Placeholder",
        type: "text",
        section: "Content",
      },
      {
        key: "composition.props.children.3.props.placeholder",
        label: "Digit 4 Placeholder",
        type: "text",
        section: "Content",
      },
    ],
  },
]
