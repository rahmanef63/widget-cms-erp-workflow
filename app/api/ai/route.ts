import { z } from "zod"
import { handleAIGenerate } from "@/features/agent/server/ai-route"

export const dynamic = "force-dynamic"

const PageSchema = z
  .object({
    nodes: z.array(
      z.object({
        id: z.string(),
        type: z.string().optional(),
        rfType: z.string().optional(),
        position: z.object({ x: z.number(), y: z.number() }),
        data: z.object({
          type: z.string(),
          label: z.string(),
          props: z.record(z.any()),
        }),
      }),
    ),
    edges: z.array(z.object({ id: z.string(), source: z.string(), target: z.string() })),
  })
  .strict()

export async function POST(req: Request) {
  return handleAIGenerate(req)
}
