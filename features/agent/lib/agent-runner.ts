import { generateText, type ToolResult } from "ai"
import { DEFAULT_MODEL_ID, getModelFromIdWithOverride, type ModelId, type OverrideConfig } from "./model-registry"

// Shared agent runner. Provide modelId and optional overrides per request.
export type RunAgentOptions = {
  system?: string
  prompt: string
  tools?: Record<string, any>
  toolChoice?: "auto" | "none"
  modelId?: ModelId
  override?: OverrideConfig
  // Allow advanced agent controls like 'stopWhen' from AI SDK 5
  stopWhen?: any
}

export async function runAgent<T = unknown>(opts: RunAgentOptions) {
  console.log("[agent-runner] runAgent", {
    modelId: opts.modelId || "default",
    hasTools: Boolean(opts.tools),
    toolChoice: opts.toolChoice,
    override: { modelName: opts.override?.modelName, hasApiKey: Boolean(opts.override?.apiKey) },
  })

  const model = getModelFromIdWithOverride(opts.modelId || DEFAULT_MODEL_ID, opts.override)
  const result = await generateText({
    model,
    system: opts.system,
    tools: opts.tools,
    toolChoice: opts.toolChoice ?? (opts.tools ? "auto" : "none"),
    prompt: opts.prompt,
    stopWhen: opts.stopWhen, // forward stop condition
  })

  console.log("[agent-runner] result", {
    textLen: (result.text || "").length,
    toolResults: (result.toolResults || []).length,
  })

  if (result.toolResults && result.toolResults.length > 0) {
    result.toolResults.forEach((toolResult, index) => {
      console.log(`[agent-runner] toolResult[${index}]:`, {
        toolCallId: toolResult.toolCallId,
        toolName: toolResult.toolName,
        resultType: typeof toolResult.result,
        resultKeys:
          toolResult.result && typeof toolResult.result === "object" ? Object.keys(toolResult.result) : "not-object",
        hasResult: toolResult.result !== undefined && toolResult.result !== null,
      })
    })
  }

  const text = result.text
  const toolResults = (result.toolResults || []) as ToolResult[]
  return { text, toolResults }
}
