export const CAN_ADD = [
  "section",
  "row",
  "column",
  "text",
  "design-text",
  "image",
  "button",
  "card",
  "badge",
  "avatar",
  "alert",
  "separator",
  "span",
  "div",
  "p",
  "h1",
  "h2",
  "h3",
  "a",
  "img",
  "input",
  "textarea",
  "label",
  "shadcn-button",
  "shadcn-card",
  "shadcn-input",
  "shadcn-badge",
  "shadcn-alert",
  "contact-form",
  "hero-section",
  "navbar",
] as const

export const DEFAULTS = {
  section: {
    background: "#ffffff",
    padding: "40px 20px",
    maxWidth: "1200px",
    align: "center",
  },
  row: {
    gap: 16,
    padding: "0px",
    justify: "start",
    align: "start",
  },
  column: {
    gap: 16,
    padding: "0px",
    justify: "start",
    align: "start",
  },
  text: {
    tag: "p",
    content: "Your text here",
    fontSize: 16,
    color: "#000000",
    weight: "400",
    align: "left",
  },
  "design-text": {
    tag: "p",
    content: "Advanced Text",
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
  image: {
    src: "",
    alt: "Image",
    width: 300,
    height: 200,
    rounded: 0,
  },
  button: {
    label: "Click me",
    href: "",
    size: "md",
    rounded: 6,
  },
  card: {
    title: "Card Title",
    description: "Card description",
    padding: 24,
  },
  badge: {
    text: "Badge",
    variant: "default",
  },
  avatar: {
    src: "",
    size: 48,
    rounded: 50,
    alt: "Avatar",
  },
  alert: {
    variant: "info",
    title: "Alert Title",
    description: "Alert description",
  },
  separator: {
    orientation: "horizontal",
    thickness: 1,
    color: "#e5e7eb",
  },
  span: {
    content: "Text content",
    className: "",
  },
  div: {
    className: "",
    children: [],
  },
  p: {
    content: "Paragraph text",
    className: "",
  },
  h1: {
    content: "Main Heading",
    className: "text-4xl font-bold",
  },
  h2: {
    content: "Section Heading",
    className: "text-3xl font-semibold",
  },
  h3: {
    content: "Subsection Heading",
    className: "text-2xl font-medium",
  },
  a: {
    content: "Link text",
    href: "#",
    target: "_self",
    className: "text-blue-600 hover:underline",
  },
  img: {
    src: "/placeholder.svg?height=200&width=300",
    alt: "Image description",
    className: "max-w-full h-auto",
  },
  input: {
    type: "text",
    placeholder: "Enter text...",
    className: "border rounded px-3 py-2",
  },
  textarea: {
    placeholder: "Enter text...",
    rows: 4,
    className: "border rounded px-3 py-2 w-full",
  },
  label: {
    content: "Label text",
    htmlFor: "",
    className: "block text-sm font-medium",
  },
  "shadcn-button": {
    variant: "default",
    size: "default",
    disabled: false,
    text: "Button",
  },
  "shadcn-card": {
    title: "Card Title",
    description: "Card description",
    content: "Card content goes here.",
  },
  "shadcn-input": {
    type: "text",
    placeholder: "Enter text...",
  },
  "shadcn-badge": {
    variant: "default",
    text: "Badge",
  },
  "shadcn-alert": {
    variant: "default",
    title: "Alert Title",
    description: "Alert description goes here.",
  },
  "contact-form": {
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    buttonText: "Send Message",
  },
  "hero-section": {
    title: "Welcome to Our Amazing Product",
    description: "Discover the power of innovation with our cutting-edge solution that transforms the way you work.",
    primaryButton: "Get Started",
    secondaryButton: "Learn More",
  },
  navbar: {
    brandName: "Brand",
    homeLink: "Home",
    aboutLink: "About",
    servicesLink: "Services",
    contactLink: "Contact",
  },
} as const

export const BUTTON_SIZE_MAP = {
  sm: "sm",
  md: "default",
  lg: "lg",
} as const

export const VALIDATION_RULES = {
  text: {
    content: {
      required: true,
      minLength: 1,
      maxLength: 10000,
    },
    fontSize: {
      min: 8,
      max: 200,
    },
  },
  image: {
    src: {
      required: true,
      pattern: /^(https?:\/\/|\/)/,
    },
    alt: {
      required: true,
      minLength: 1,
      maxLength: 255,
    },
    width: {
      min: 1,
      max: 2000,
    },
    height: {
      min: 1,
      max: 2000,
    },
  },
  button: {
    label: {
      required: true,
      minLength: 1,
      maxLength: 100,
    },
    href: {
      pattern: /^(https?:\/\/|\/|#)/,
    },
  },
  section: {
    padding: {
      pattern: /^\d+px\s+\d+px$/,
    },
    maxWidth: {
      pattern: /^\d+px$/,
    },
  },
} as const

export const BRAND_TOKENS = {
  colors: {
    primary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      500: "#0ea5e9",
      600: "#0284c7",
      900: "#0c4a6e",
    },
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      500: "#64748b",
      600: "#475569",
      900: "#0f172a",
    },
    accent: {
      50: "#fef2f2",
      100: "#fee2e2",
      500: "#ef4444",
      600: "#dc2626",
      900: "#7f1d1d",
    },
  },
  typography: {
    fontFamilies: {
      sans: ["Inter", "system-ui", "sans-serif"],
      serif: ["Georgia", "serif"],
      mono: ["Fira Code", "monospace"],
    },
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    full: "9999px",
  },
} as const

export const DEVICE_PRESETS = {
  mobile: {
    name: "Mobile",
    width: 375,
    height: 667,
    icon: "smartphone",
  },
  tablet: {
    name: "Tablet",
    width: 768,
    height: 1024,
    icon: "tablet",
  },
  desktop: {
    name: "Desktop",
    width: 1440,
    height: 900,
    icon: "monitor",
  },
  "mobile-landscape": {
    name: "Mobile Landscape",
    width: 667,
    height: 375,
    icon: "smartphone",
  },
  "tablet-landscape": {
    name: "Tablet Landscape",
    width: 1024,
    height: 768,
    icon: "tablet",
  },
} as const
