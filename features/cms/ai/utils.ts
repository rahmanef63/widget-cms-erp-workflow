import type { CMSSchema } from "@/shared/types/schema"
import type { CompNodeData } from "@/shared/types/schema"

export class CMSAgentUtils {
  static createContextPrompt(selectedNode: CompNodeData | null, includeChildren = false): string {
    if (!selectedNode) {
      return "You are helping with a CMS page builder. No specific component is selected."
    }

    let context = `You are helping with a CMS page builder. Currently selected component:
- Type: ${selectedNode.type}
- Label: ${selectedNode.label}
- Properties: ${JSON.stringify(selectedNode.props, null, 2)}`

    if (
      includeChildren &&
      selectedNode.children &&
      Array.isArray(selectedNode.children) &&
      selectedNode.children.length > 0
    ) {
      context += `\n- Children components: ${selectedNode.children.length} items`
      selectedNode.children.forEach((child, index) => {
        if (child && child.type && child.label) {
          // Add null checks for child properties
          context += `\n  ${index + 1}. ${child.type} (${child.label})`
        }
      })
    }

    context += "\n\nPlease provide assistance specific to this component and its context within the CMS."
    return context
  }

  static enhancePrompt(originalPrompt: string, contextPrompt: string): string {
    return `${contextPrompt}\n\nUser request: ${originalPrompt}`
  }

  static isCMSSpecificPrompt(prompt: string): boolean {
    const cmsKeywords = [
      "component",
      "section",
      "layout",
      "design",
      "style",
      "css",
      "button",
      "text",
      "image",
      "card",
      "container",
      "column",
      "properties",
      "props",
      "children",
      "parent",
      "hierarchy",
    ]

    const lowerPrompt = prompt.toLowerCase()
    return cmsKeywords.some((keyword) => lowerPrompt.includes(keyword))
  }

  static processMessage(message: string, selectedNode: CompNodeData | null, includeChildren = false): string {
    if (!this.isCMSSpecificPrompt(message)) {
      return message
    }

    const contextPrompt = this.createContextPrompt(selectedNode, includeChildren ?? false) // Add null check for includeChildren
    return this.enhancePrompt(message, contextPrompt)
  }
}

// Extract JSON schema from assistant messages or user input text
export function tryParseSchemaJson(raw: string): CMSSchema | null {
  if (!raw) return null
  const text = raw.trim()

  // 1) Code fence \`\`\`json ... \`\`\`
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence?.[1]) {
    try {
      const parsed = JSON.parse(fence[1])
      if (parsed?.nodes && parsed?.edges) return parsed
    } catch {}
  }

  // 2) Parse as-is
  try {
    const parsed = JSON.parse(text)
    if (parsed?.nodes && parsed?.edges) return parsed
  } catch {}

  // 3) Find first {...} block that contains "nodes"
  const idx = text.indexOf('"nodes"')
  if (idx >= 0) {
    const start = text.lastIndexOf("{", idx)
    const end = text.indexOf("}", idx)
    if (start >= 0 && end > start) {
      for (let j = end; j <= text.length; j++) {
        const candidate = text.slice(start, j)
        try {
          const parsed = JSON.parse(candidate)
          if (parsed?.nodes && parsed?.edges) return parsed
        } catch {
          // keep expanding
        }
      }
    }
  }

  return null
}

// Lightweight client-side fallback for quick UX
export function clientFallbackHeuristic(prompt: string): CMSSchema {
  const t = prompt.toLowerCase()

  // Detect page type
  const isProfile = /profil|profile|about|tentang|bio/i.test(t)
  const isBlog = /blog|artikel|post/i.test(t)

  const wantHero = /hero|landing|headline|title/i.test(t)
  const wantCta = /cta|button|buy|get started|signup/i.test(t)

  const sectionId = "section-hero"
  const colId = "column-hero"
  const hId = "text-title"
  const pId = "text-sub"
  const btnId = "button-cta"
  const avatarId = "avatar-profile"

  const nodes: any[] = [
    {
      id: sectionId,
      type: "component",
      position: { x: 200, y: 100 },
      data: {
        type: "section",
        label: "section",
        props: { background: "#ffffff", padding: 48, maxWidth: 1024, align: "center", className: "", styleJson: "{}" },
      },
    },
    {
      id: colId,
      type: "component",
      position: { x: 200, y: 150 },
      data: {
        type: "column",
        label: "column",
        props: { gap: 16, padding: 0, justify: "center", align: "center", className: "", styleJson: "{}" },
      },
    },
  ]

  const edges = [
    { id: "e1", source: colId, target: sectionId },
    { id: "e5", source: sectionId, target: "preview" },
  ]

  // Profile page content
  if (isProfile) {
    nodes.push(
      {
        id: avatarId,
        type: "component",
        position: { x: 200, y: 180 },
        data: {
          type: "avatar",
          label: "avatar",
          props: {
            src: "https://i.pravatar.cc/120",
            size: 120,
            rounded: 9999,
            alt: "Profile picture",
            className: "",
            styleJson: "{}",
          },
        },
      },
      {
        id: hId,
        type: "component",
        position: { x: 200, y: 220 },
        data: {
          type: "text",
          label: "text",
          props: {
            tag: "h1",
            content: "John Doe",
            fontSize: 32,
            color: "#111827",
            weight: 700,
            align: "center",
            className: "",
            styleJson: "{}",
          },
        },
      },
      {
        id: pId,
        type: "component",
        position: { x: 200, y: 240 },
        data: {
          type: "text",
          label: "text",
          props: {
            tag: "p",
            content: "Full Stack Developer & UI/UX Designer",
            fontSize: 16,
            color: "#374151",
            weight: 400,
            align: "center",
            className: "",
            styleJson: "{}",
          },
        },
      },
    )

    edges.push(
      { id: "e2", source: avatarId, target: colId },
      { id: "e3", source: hId, target: colId },
      { id: "e4", source: pId, target: colId },
    )
  }
  // Blog page content
  else if (isBlog) {
    nodes.push(
      {
        id: hId,
        type: "component",
        position: { x: 200, y: 200 },
        data: {
          type: "text",
          label: "text",
          props: {
            tag: "h1",
            content: "My Blog",
            fontSize: 36,
            color: "#111827",
            weight: 700,
            align: "center",
            className: "",
            styleJson: "{}",
          },
        },
      },
      {
        id: pId,
        type: "component",
        position: { x: 200, y: 240 },
        data: {
          type: "text",
          label: "text",
          props: {
            tag: "p",
            content: "Thoughts and stories about development",
            fontSize: 16,
            color: "#374151",
            weight: 400,
            align: "center",
            className: "",
            styleJson: "{}",
          },
        },
      },
    )

    edges.push({ id: "e2", source: hId, target: colId }, { id: "e3", source: pId, target: colId })
  }
  // Default content
  else {
    nodes.push(
      {
        id: hId,
        type: "component",
        position: { x: 200, y: 200 },
        data: {
          type: "text",
          label: "text",
          props: {
            tag: "h1",
            content: wantHero ? "A Better Way to Build" : "Your Page Title",
            fontSize: 36,
            color: "#111827",
            weight: 700,
            align: "center",
            className: "",
            styleJson: "{}",
          },
        },
      },
      {
        id: pId,
        type: "component",
        position: { x: 200, y: 240 },
        data: {
          type: "text",
          label: "text",
          props: {
            tag: "p",
            content: "Generated from your prompt.",
            fontSize: 16,
            color: "#374151",
            weight: 400,
            align: "center",
            className: "",
            styleJson: "{}",
          },
        },
      },
    )

    edges.push({ id: "e2", source: hId, target: colId }, { id: "e3", source: pId, target: colId })

    if (wantCta) {
      nodes.push({
        id: btnId,
        type: "component",
        position: { x: 200, y: 280 },
        data: {
          type: "button",
          label: "button",
          props: { label: "Get Started", href: "#", size: "md", rounded: 10, className: "", styleJson: "{}" },
        },
      } as any)
      edges.push({ id: "e4", source: btnId, target: colId } as any)
    }
  }

  return { nodes, edges }
}
