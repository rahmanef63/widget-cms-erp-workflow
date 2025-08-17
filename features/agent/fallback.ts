import type { Edge, Node } from "reactflow"
import type { CompNodeData, CMSSchema } from "@/shared/types/schema"

export function fallbackHeuristic(prompt: string): CMSSchema {
  const t = prompt.toLowerCase()

  // Detect page type from prompt
  const isProfile = /profil|profile|about|tentang|bio/i.test(t)
  const isBlog = /blog|artikel|post/i.test(t)
  const isPricing = /pricing|harga|paket/i.test(t)
  const isContact = /contact|kontak|hubungi/i.test(t)

  const wantHero = /hero|landing|headline|title/i.test(t) || (!isProfile && !isBlog && !isPricing && !isContact)
  const wantCta = /cta|button|buy|get started|signup|hubungi|contact/i.test(t)

  const sectionId = "section-hero"
  const colId = "column-hero"
  const hId = "text-title"
  const pId = "text-sub"
  const btnId = "button-cta"
  const avatarId = "avatar-profile"

  const nodes: Array<Node<CompNodeData>> = [
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

  const edges: Edge[] = [
    { id: "e1", source: colId, target: sectionId },
    { id: "e5", source: sectionId, target: "preview" },
  ]

  // Profile page specific content
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
        position: { x: 200, y: 260 },
        data: {
          type: "text",
          label: "text",
          props: {
            tag: "p",
            content:
              "Full Stack Developer & UI/UX Designer. Passionate about creating beautiful and functional web experiences.",
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

    if (wantCta) {
      nodes.push({
        id: btnId,
        type: "component",
        position: { x: 200, y: 300 },
        data: {
          type: "button",
          label: "button",
          props: { label: "Contact Me", href: "#contact", size: "md", rounded: 10, className: "", styleJson: "{}" },
        },
      } as any)
      edges.push({ id: "e6", source: btnId, target: colId } as any)
    }
  }
  // Blog page specific content
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
            content: "Thoughts, stories and ideas about web development, design, and technology.",
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
  // Default hero content
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
            tag: wantHero ? "h1" : "h2",
            content: wantHero ? "A Better Way to Build" : "Your Page Title",
            fontSize: wantHero ? 36 : 28,
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
