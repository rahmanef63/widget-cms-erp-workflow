import { NextResponse } from "next/server"
import type { Edge, Node } from "reactflow"
import type { CompNodeData, CMSSchema } from "@/shared/types/schema"
import { runAgent } from "@/features/agent/agent-core"
import type { ModelId } from "@/features/agent/registry"
import { CMS_CREATE_SCHEMA_SYSTEM, CMS_CREATE_SCHEMA_INSTRUCTIONS } from "@/features/agent/knowledge"
import { CMS_BASE_KNOWLEDGE } from "@/features/agent/base-knowledge"
import { CMS_TOOL_MANIFEST } from "@/features/agent/tool-manifest"
import { getCmsTools, PageSchema } from "@/features/agent/tools"

// (removed hasToolCall import)

function fallbackHeuristic(prompt: string): CMSSchema {
  const wantHero = /hero|landing|headline|title/i.test(prompt)
  const wantCta = /cta|button|buy|get started|signup/i.test(prompt)
  const sectionId = "section-hero"
  const colId = "column-hero"
  const hId = "text-title"
  const pId = "text-sub"
  const btnId = "button-cta"
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
  ]
  const edges: Edge[] = [
    { id: "e1", source: colId, target: sectionId },
    { id: "e2", source: hId, target: colId },
    { id: "e3", source: pId, target: colId },
    { id: "e5", source: sectionId, target: "preview" },
  ]
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
  return { nodes, edges }
}

export async function handleAIGenerate(req: Request) {
  try {
    const { prompt } = (await req.json()) as { prompt: string }
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }

    const modelId = (req.headers.get("x-model-id") as ModelId | null) || undefined
    const override = {
      modelName: req.headers.get("x-model-name") || undefined,
      apiKey: req.headers.get("x-api-key") || undefined,
    }
    const tools = getCmsTools()

    const promptPreview = (prompt || "").slice(0, 160)
    console.log("[/api/ai] handleAIGenerate", {
      modelId,
      hasModelOverride: Boolean(override.modelName),
      hasApiKeyOverride: Boolean(override.apiKey),
      promptLen: (prompt || "").length,
      promptPreview,
    })
    console.time("[/api/ai] generate")

    const { toolResults } = await runAgent({
      modelId,
      override,
      system: [CMS_CREATE_SCHEMA_SYSTEM, CMS_BASE_KNOWLEDGE, CMS_TOOL_MANIFEST].join("\n\n"),
      tools,
      toolChoice: "auto",
      prompt: [
        CMS_CREATE_SCHEMA_INSTRUCTIONS,
        "Return ONLY via createSchema tool call.",
        "If unsure, still propose a minimal valid schema (section > column > text) and connect section -> preview.",
        `User prompt: ${prompt}`,
      ].join("\n"),
    })

    console.timeEnd("[/api/ai] generate")
    console.log("[/api/ai] toolResults", {
      count: toolResults?.length || 0,
      firstType: typeof toolResults?.[0]?.result,
    })

    if (!toolResults || toolResults.length === 0) {
      console.warn("[/api/ai] No tool results received, using fallback")
      const schema = fallbackHeuristic(prompt)
      return NextResponse.json({ source: "fallback", schema })
    }

    const toolResult = toolResults[0]?.result
    console.log("[/api/ai] Raw tool result:", JSON.stringify(toolResult, null, 2))

    if (!toolResult || typeof toolResult !== "object") {
      console.warn("[/api/ai] Invalid tool result format, using fallback")
      const schema = fallbackHeuristic(prompt)
      return NextResponse.json({ source: "fallback", schema })
    }

    const parsed = PageSchema.safeParse(toolResult)
    if (!parsed.success) {
      console.warn("[/api/ai] Zod parse failed, applying fallback", {
        error: parsed.error?.toString?.() || String(parsed.error || "unknown"),
        toolResult: JSON.stringify(toolResult, null, 2),
      })
      const schema = fallbackHeuristic(prompt)
      return NextResponse.json({ source: "fallback", schema })
    }

    console.log("[/api/ai] Successfully parsed schema:", JSON.stringify(parsed.data, null, 2))
    return NextResponse.json({ source: "tool", schema: parsed.data })
  } catch (e: any) {
    console.error("/api/ai error", e)
    const schema = fallbackHeuristic("error")
    return NextResponse.json({ source: "fallback", schema })
  }
}
