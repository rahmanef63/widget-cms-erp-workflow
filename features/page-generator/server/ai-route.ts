import { NextResponse } from "next/server"
import { generateText, tool } from "ai"
import { xai } from "@ai-sdk/xai"
import { z } from "zod"

// Zod schema describing the nodes/edges we expect back from the tool
const PageSchema = z
  .object({
    nodes: z.array(
      z.object({
        id: z.string(),
        type: z.string().optional(), // reactflow node type ("component")
        rfType: z.string().optional(), // exported schema uses rfType
        position: z.object({ x: z.number(), y: z.number() }),
        data: z.object({
          type: z
            .enum([
              "section",
              "row",
              "column",
              "text",
              "image",
              "button",
              "card",
              "badge",
              "avatar",
              "alert",
              "separator",
            ])
            .or(z.string()),
          label: z.string(),
          props: z.record(z.any()),
        }),
      }),
    ),
    edges: z.array(
      z.object({
        id: z.string(),
        source: z.string(),
        target: z.string(),
      }),
    ),
  })
  .strict()

// Local heuristic fallback when no API key is configured
function fallbackHeuristic(prompt: string) {
  const wantHero = /hero|landing|headline|title/i.test(prompt)
  const wantCta = /cta|button|buy|get started|signup/i.test(prompt)
  const sectionId = "section-hero"
  const colId = "column-hero"
  const hId = "text-title"
  const pId = "text-sub"
  const btnId = "button-cta"
  const nodes = [
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
  ] as any[]

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
  }

  const edges = [
    { id: "e1", source: colId, target: sectionId },
    { id: "e2", source: hId, target: colId },
    { id: "e3", source: pId, target: colId },
    ...(wantCta ? [{ id: "e4", source: btnId, target: colId }] : []),
    { id: "e5", source: sectionId, target: "preview" }, // builder sink connection
  ]
  return { nodes, edges }
}

export async function handleAIGenerate(req: Request) {
  try {
    const { prompt } = (await req.json()) as { prompt: string }
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }

    if (!process.env.XAI_API_KEY) {
      const schema = fallbackHeuristic(prompt)
      return NextResponse.json({ source: "fallback", schema })
    }

    const createSchema = tool({
      description:
        "Create a CMS page schema using ReactFlow nodes/edges. Root nodes should connect to a 'preview' sink node in the builder.",
      inputSchema: z.object({
        title: z.string().optional(),
        nodes: PageSchema.shape.nodes,
        edges: PageSchema.shape.edges,
      }),
      outputSchema: PageSchema,
      execute: async (args) => {
        const hasPreviewEdge = args.edges.some((e) => e.target === "preview")
        if (!hasPreviewEdge) {
          const sources = new Set(args.edges.map((e) => e.source))
          const candidates = args.nodes.map((n) => n.id).filter((id) => !sources.has(id))
          if (candidates[0]) {
            args.edges.push({ id: `ep-${Date.now()}`, source: candidates[0], target: "preview" })
          }
        }
        return { nodes: args.nodes, edges: args.edges }
      },
    })

    const result = await generateText({
      model: xai("grok-3"),
      tools: { createSchema },
      toolChoice: "auto",
      prompt: [
        "You are a page architect. Always respond ONLY by calling the createSchema tool.",
        "Use component types: section,row,column,text,image,button,card,badge,avatar,alert,separator.",
        "Edges represent child -> parent. Connect a final root to node id 'preview'.",
        `User prompt: ${prompt}`,
      ].join("\n"),
    })

    const toolResult = result.toolResults?.[0]?.result as any
    const parsed = PageSchema.safeParse(toolResult)
    if (!parsed.success) {
      const schema = fallbackHeuristic(prompt)
      return NextResponse.json({ source: "fallback", schema })
    }
    return NextResponse.json({ source: "tool", schema: parsed.data })
  } catch (e: any) {
    console.error("/api/ai error", e)
    const schema = fallbackHeuristic("error")
    return NextResponse.json({ source: "fallback", schema })
  }
}
