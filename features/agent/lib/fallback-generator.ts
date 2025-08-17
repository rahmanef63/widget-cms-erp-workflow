import type { Edge, Node } from "reactflow"
import type { CompNodeData, CMSSchema } from "@/shared/types/schema"

/**
 * Enhanced fallback heuristic that generates CMS schemas based on prompt analysis
 * Consolidates all fallback logic into a single, comprehensive function
 */
export function generateFallbackSchema(prompt: string): CMSSchema {
  const t = prompt.toLowerCase()

  // Detect page type from prompt
  const isProfile = /profil|profile|about|tentang|bio/i.test(t)
  const isBlog = /blog|artikel|post|artikel|berita/i.test(t)
  const isPricing = /pricing|harga|paket|tarif|price/i.test(t)
  const isContact = /contact|kontak|hubungi|contact/i.test(t)
  const isLanding = /landing|hero|home|beranda/i.test(t)
  const isPortfolio = /portfolio|karya|project|portofolio/i.test(t)
  const isTestimonial = /testimonial|review|ulasan|testimoni/i.test(t)

  // Component detection
  const wantHero = /hero|landing|headline|title|judul/i.test(t) || (!isProfile && !isBlog && !isPricing && !isContact)
  const wantCta = /cta|button|buy|get started|signup|hubungi|contact|daftar|mulai/i.test(t)
  const wantImage = /image|gambar|foto|picture|visual/i.test(t)
  const wantCard = /card|kartu|box|kotak/i.test(t)
  const wantGrid = /grid|baris|kolom|column|row/i.test(t)
  const wantForm = /form|formulir|input|field/i.test(t)

  // Generate unique IDs
  const timestamp = Date.now().toString(36)
  const sectionId = `section-${timestamp}`
  const colId = `column-${timestamp}`
  const hId = `text-title-${timestamp}`
  const pId = `text-sub-${timestamp}`
  const btnId = `button-cta-${timestamp}`
  const avatarId = `avatar-profile-${timestamp}`
  const imageId = `image-${timestamp}`
  const cardId = `card-${timestamp}`

  const nodes: Array<Node<CompNodeData>> = [
    {
      id: sectionId,
      type: "component",
      position: { x: 200, y: 100 },
      data: {
        type: "section",
        label: "section",
        props: { 
          background: "#ffffff", 
          padding: isPricing ? 64 : 48, 
          maxWidth: 1024, 
          align: "center", 
          className: "", 
          styleJson: "{}" 
        },
      },
    },
    {
      id: colId,
      type: "component",
      position: { x: 200, y: 150 },
      data: {
        type: "column",
        label: "column",
        props: { 
          gap: isLanding ? 24 : 16, 
          padding: 0, 
          justify: "center", 
          align: "center", 
          className: "", 
          styleJson: "{}" 
        },
      },
    },
  ]

  const edges: Edge[] = [
    { id: `e1-${timestamp}`, source: colId, target: sectionId },
    { id: `e-preview-${timestamp}`, source: sectionId, target: "preview" },
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
            content: "Full Stack Developer & UI/UX Designer. Passionate about creating beautiful and functional web experiences.",
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
      { id: `e2-${timestamp}`, source: avatarId, target: colId },
      { id: `e3-${timestamp}`, source: hId, target: colId },
      { id: `e4-${timestamp}`, source: pId, target: colId },
    )
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

    edges.push(
      { id: `e2-${timestamp}`, source: hId, target: colId }, 
      { id: `e3-${timestamp}`, source: pId, target: colId }
    )
  }
  // Pricing page specific content
  else if (isPricing) {
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
            content: "Pricing Plans",
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
            content: "Choose the perfect plan for your needs. Flexible pricing for every stage of your journey.",
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
      { id: `e2-${timestamp}`, source: hId, target: colId }, 
      { id: `e3-${timestamp}`, source: pId, target: colId }
    )
  }
  // Contact page specific content
  else if (isContact) {
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
            content: "Contact Us",
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
            content: "Get in touch with us. We'd love to hear from you and answer any questions you may have.",
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
      { id: `e2-${timestamp}`, source: hId, target: colId }, 
      { id: `e3-${timestamp}`, source: pId, target: colId }
    )
  }
  // Default hero content
  else {
    const titleContent = isLanding 
      ? "Welcome to Our Amazing Platform" 
      : wantHero 
      ? "A Better Way to Build" 
      : "Your Page Title"
    
    const subtitleContent = isLanding
      ? "Experience the future of web development with our innovative tools and features."
      : "Generated from your prompt."

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
            content: titleContent,
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
            content: subtitleContent,
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
      { id: `e2-${timestamp}`, source: hId, target: colId }, 
      { id: `e3-${timestamp}`, source: pId, target: colId }
    )
  }

  // Add image if requested
  if (wantImage && !isProfile) {
    nodes.push({
      id: imageId,
      type: "component",
      position: { x: 200, y: 180 },
      data: {
        type: "image",
        label: "image",
        props: {
          src: "https://picsum.photos/400/300",
          alt: "Featured image",
          width: 400,
          height: 300,
          rounded: 10,
          className: "",
          styleJson: "{}",
        },
      },
    })
    edges.push({ id: `e-img-${timestamp}`, source: imageId, target: colId })
  }

  // Add CTA button if requested or appropriate for page type
  if (wantCta || isPricing || isContact || isLanding) {
    const buttonLabel = isPricing 
      ? "Get Started" 
      : isContact 
      ? "Send Message" 
      : isProfile 
      ? "Contact Me"
      : isLanding
      ? "Try It Now"
      : "Get Started"

    nodes.push({
      id: btnId,
      type: "component",
      position: { x: 200, y: nodes.length > 4 ? 320 : 280 },
      data: {
        type: "button",
        label: "button",
        props: { 
          label: buttonLabel, 
          href: "#", 
          size: "md", 
          rounded: 10, 
          className: "", 
          styleJson: "{}" 
        },
      },
    })
    edges.push({ id: `e-btn-${timestamp}`, source: btnId, target: colId })
  }

  return { nodes, edges }
}

/**
 * Lightweight client-side fallback for immediate UX
 * This is a simplified version for quick responses
 */
export function generateClientFallback(prompt: string): CMSSchema {
  return generateFallbackSchema(prompt)
}

/**
 * Legacy compatibility functions
 * @deprecated Use generateFallbackSchema instead
 */
export const fallbackHeuristic = generateFallbackSchema
export const clientFallbackHeuristic = generateClientFallback
