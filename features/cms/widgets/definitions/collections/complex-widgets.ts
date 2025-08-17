import type { WidgetDefinition } from "../../shared/types"

export const collectionWidgets: WidgetDefinition[] = [
  {
    type: "contact-form",
    name: "Contact Form",
    icon: "Mail",
    category: "collection",
    defaultProps: {
      composition: {
        type: "form",
        props: {
          className: "space-y-4 max-w-md",
          children: [
            {
              type: "div",
              props: {
                className: "space-y-2",
                children: [
                  {
                    type: "label",
                    props: {
                      content: "Name",
                      htmlFor: "name",
                      className: "block text-sm font-medium",
                    },
                  },
                  {
                    type: "input",
                    props: {
                      type: "text",
                      id: "name",
                      placeholder: "Your name",
                      className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                className: "space-y-2",
                children: [
                  {
                    type: "label",
                    props: {
                      content: "Email",
                      htmlFor: "email",
                      className: "block text-sm font-medium",
                    },
                  },
                  {
                    type: "input",
                    props: {
                      type: "email",
                      id: "email",
                      placeholder: "your@email.com",
                      className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                className: "space-y-2",
                children: [
                  {
                    type: "label",
                    props: {
                      content: "Message",
                      htmlFor: "message",
                      className: "block text-sm font-medium",
                    },
                  },
                  {
                    type: "textarea",
                    props: {
                      id: "message",
                      placeholder: "Your message...",
                      rows: 4,
                      className:
                        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    },
                  },
                ],
              },
            },
            {
              type: "button",
              props: {
                type: "submit",
                className:
                  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
                children: [
                  {
                    type: "span",
                    props: {
                      content: "Send Message",
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
        label: "Name Label",
        type: "text",
        section: "Labels",
      },
      {
        key: "composition.props.children.1.children.0.props.content",
        label: "Email Label",
        type: "text",
        section: "Labels",
      },
      {
        key: "composition.props.children.2.children.0.props.content",
        label: "Message Label",
        type: "text",
        section: "Labels",
      },
      {
        key: "composition.props.children.3.props.children.0.props.content",
        label: "Button Text",
        type: "text",
        section: "Content",
      },
    ],
  },
  {
    type: "hero-section",
    name: "Hero Section",
    icon: "Layout",
    category: "collection",
    defaultProps: {
      composition: {
        type: "section",
        props: {
          className: "py-20 px-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white",
          children: [
            {
              type: "div",
              props: {
                className: "max-w-4xl mx-auto",
                children: [
                  {
                    type: "h1",
                    props: {
                      content: "Welcome to Our Amazing Product",
                      className: "text-5xl font-bold mb-6",
                    },
                  },
                  {
                    type: "p",
                    props: {
                      content:
                        "Discover the power of innovation with our cutting-edge solution that transforms the way you work.",
                      className: "text-xl mb-8 opacity-90",
                    },
                  },
                  {
                    type: "div",
                    props: {
                      className: "flex gap-4 justify-center",
                      children: [
                        {
                          type: "button",
                          props: {
                            className: "bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold",
                            children: [
                              {
                                type: "span",
                                props: {
                                  content: "Get Started",
                                  className: "",
                                },
                              },
                            ],
                          },
                        },
                        {
                          type: "button",
                          props: {
                            className:
                              "border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold",
                            children: [
                              {
                                type: "span",
                                props: {
                                  content: "Learn More",
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
          ],
        },
      },
    },
    propertySchema: [
      {
        key: "composition.props.children.0.children.0.props.content",
        label: "Hero Title",
        type: "text",
        section: "Content",
      },
      {
        key: "composition.props.children.0.children.1.props.content",
        label: "Hero Description",
        type: "textarea",
        section: "Content",
      },
      {
        key: "composition.props.children.0.children.2.children.0.props.children.0.props.content",
        label: "Primary Button",
        type: "text",
        section: "Buttons",
      },
      {
        key: "composition.props.children.0.children.2.children.1.props.children.0.props.content",
        label: "Secondary Button",
        type: "text",
        section: "Buttons",
      },
    ],
  },
  {
    type: "navbar",
    name: "Navigation Bar",
    icon: "Menu",
    category: "collection",
    defaultProps: {
      composition: {
        type: "nav",
        props: {
          className: "bg-white shadow-sm border-b px-4 py-3",
          children: [
            {
              type: "div",
              props: {
                className: "max-w-7xl mx-auto flex items-center justify-between",
                children: [
                  {
                    type: "div",
                    props: {
                      className: "flex items-center space-x-4",
                      children: [
                        {
                          type: "a",
                          props: {
                            href: "/",
                            className: "text-xl font-bold text-gray-900",
                            content: "Brand",
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      className: "hidden md:flex items-center space-x-6",
                      children: [
                        {
                          type: "a",
                          props: {
                            href: "/",
                            content: "Home",
                            className: "text-gray-600 hover:text-gray-900",
                          },
                        },
                        {
                          type: "a",
                          props: {
                            href: "/about",
                            content: "About",
                            className: "text-gray-600 hover:text-gray-900",
                          },
                        },
                        {
                          type: "a",
                          props: {
                            href: "/services",
                            content: "Services",
                            className: "text-gray-600 hover:text-gray-900",
                          },
                        },
                        {
                          type: "a",
                          props: {
                            href: "/contact",
                            content: "Contact",
                            className: "text-gray-600 hover:text-gray-900",
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
        key: "composition.props.children.0.children.0.children.0.props.content",
        label: "Brand Name",
        type: "text",
        section: "Brand",
      },
      {
        key: "composition.props.children.0.children.1.children.0.props.content",
        label: "Home Link",
        type: "text",
        section: "Navigation",
      },
      {
        key: "composition.props.children.0.children.1.children.1.props.content",
        label: "About Link",
        type: "text",
        section: "Navigation",
      },
      {
        key: "composition.props.children.0.children.1.children.2.props.content",
        label: "Services Link",
        type: "text",
        section: "Navigation",
      },
      {
        key: "composition.props.children.0.children.1.children.3.props.content",
        label: "Contact Link",
        type: "text",
        section: "Navigation",
      },
    ],
  },
]
