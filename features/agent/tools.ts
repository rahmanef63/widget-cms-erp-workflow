import { z } from "zod"
import { tool } from "ai"

// Re-exported PageSchema and CMS-specific createSchema tool. [^1]
export const PageSchema = z
  .object({
    nodes: z.array(
      z.object({
        id: z.string(),
        type: z.string().optional(),
        rfType: z.string().optional(),
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
    edges: z.array(z.object({ id: z.string(), source: z.string(), target: z.string() })),
  })
  .strict()

// Helpers to coerce loose tool args into a valid PageSchema
function asString(v: any) {
  return typeof v === "string" ? v : v == null ? "" : String(v)
}
function isFiniteNumber(n: any) {
  return typeof n === "number" && Number.isFinite(n)
}
function genId(prefix: string, i: number) {
  return `${prefix}-${Date.now().toString(36)}-${i}`
}

type NodeOut = z.infer<typeof PageSchema>["nodes"][number]
type EdgeOut = z.infer<typeof PageSchema>["edges"][number]

function normalizeArgs(args: any): { nodes: NodeOut[]; edges: EdgeOut[] } {
  const rawNodes = Array.isArray(args?.nodes) ? args.nodes : []
  const rawEdges = Array.isArray(args?.edges) ? args.edges : []

  const edgeCandidates: any[] = []
  const nodeCandidates: any[] = []

  // Split edge-like entries that were accidentally placed into nodes
  for (const item of rawNodes) {
    if (item && typeof item === "object" && "source" in item && "target" in item && !("data" in item)) {
      edgeCandidates.push(item)
    } else {
      nodeCandidates.push(item)
    }
  }

  // Normalize nodes
  const nodes: NodeOut[] = nodeCandidates.map((n, i) => {
    const id = asString(n?.id) || genId("n", i)
    const pos =
      n?.position && isFiniteNumber(n.position.x) && isFiniteNumber(n.position.y)
        ? n.position
        : { x: 200 + (i % 4) * 80, y: 100 + Math.floor(i / 4) * 80 }
    const rfType = (n?.rfType || n?.type) === "component" ? "component" : "component"
    const dataRaw = n?.data || {}
    const type = typeof dataRaw?.type === "string" ? dataRaw.type : "section"
    const label = typeof dataRaw?.label === "string" ? dataRaw.label : type
    const props = dataRaw?.props && typeof dataRaw.props === "object" ? dataRaw.props : {}
    return {
      id,
      rfType,
      position: { x: Number(pos.x), y: Number(pos.y) },
      data: { type, label, props },
    }
  })

  // Normalize edges (tool may mix structures; accept any)
  const mergedEdges = [...rawEdges, ...edgeCandidates]
  const edges: EdgeOut[] = mergedEdges
    .map((e: any, i: number) => {
      const source = asString(e?.source)
      const target = asString(e?.target)
      if (!source || !target) return null
      const id = asString(e?.id) || genId("e", i)
      return { id, source, target }
    })
    .filter(Boolean) as EdgeOut[]

  // Ensure at least one preview edge
  const hasPreview = edges.some((e) => e.target === "preview")
  if (!hasPreview && nodes.length > 0) {
    const children = new Set(edges.map((e) => e.source))
    const roots = nodes.map((n) => n.id).filter((id) => !children.has(id))
    if (roots[0]) {
      edges.push({ id: genId("ep", edges.length), source: roots[0], target: "preview" })
    }
  }

  return { nodes, edges }
}

export function getCmsTools() {
  // Make inputSchema permissive so model tool calls don't fail validation pre-execution. We then normalize to PageSchema in execute. [^1]
  const createSchema = tool({
    description:
      "Create a CMS page schema using ReactFlow nodes/edges. Root nodes should connect to a 'preview' sink node in the builder.",
    inputSchema: z.object({
      title: z.string().optional(),
      // Accept any shapes here; we'll sanitize inside execute
      nodes: z.array(z.any()).default([]),
      edges: z.array(z.any()).default([]),
    }),
    outputSchema: PageSchema,
    execute: async (args) => {
      console.log("[createSchema tool] received args:", JSON.stringify(args, null, 2))

      // Handle case where args might be undefined or malformed
      if (!args || typeof args !== "object") {
        console.warn("[createSchema tool] Invalid args received, using empty defaults")
        args = { nodes: [], edges: [] }
      }

      const normalized = normalizeArgs(args)
      console.log("[createSchema tool] normalized result:", JSON.stringify(normalized, null, 2))

      const result = {
        nodes: normalized.nodes,
        edges: normalized.edges,
      }

      // Validate the result before returning
      const validation = PageSchema.safeParse(result)
      if (!validation.success) {
        console.error("[createSchema tool] Validation failed:", validation.error)
        // Return a minimal valid schema as fallback
        return {
          nodes: [
            {
              id: "fallback-section",
              rfType: "component",
              position: { x: 200, y: 100 },
              data: {
                type: "section",
                label: "Section",
                props: { background: "#ffffff", padding: 48 },
              },
            },
          ],
          edges: [
            {
              id: "fallback-edge",
              source: "fallback-section",
              target: "preview",
            },
          ],
        }
      }

      console.log("[createSchema tool] returning valid result:", JSON.stringify(result, null, 2))
      return result
    },
  })

  return { createSchema }
}
