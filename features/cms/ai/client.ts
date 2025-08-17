"use client"

import { toast } from "@/shared/hooks/use-toast"
import type { CMSSchema } from "@/shared/types/schema"
import type { ChatSettings } from "@/shared/settings/chat"

// Function to generate schema from prompt
export async function generateSchemaFromPrompt(
  prompt: string,
  settings: ChatSettings,
  modelId: string,
): Promise<CMSSchema | null> {
  try {
    console.log("🔄 [CLIENT] Generating schema from prompt:", prompt.slice(0, 50) + "...")

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (modelId) {
      headers["x-model-id"] = modelId
    }

    const config = settings.models?.[modelId]
    if (config?.modelName) {
      headers["x-model-name"] = config.modelName
    }
    if (config?.apiKey) {
      headers["x-api-key"] = config.apiKey
    }

    const response = await fetch("/api/ai", {
      method: "POST",
      headers,
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("✅ [CLIENT] Schema generation response:", data)

    // Check if we have a valid schema
    if (data && (data.source === "tool" || data.source === "fallback") && data.schema) {
      // Ensure all section nodes are connected to preview
      const schema = ensurePreviewConnections(data.schema)
      return schema
    } else {
      console.error("❌ [CLIENT] Invalid schema format received:", data)
      return null
    }
  } catch (error) {
    console.error("❌ [CLIENT] Error generating schema:", error)
    toast({
      title: "Generation Error",
      description: error instanceof Error ? error.message : "Failed to generate schema",
      variant: "destructive",
    })
    return null
  }
}

// Function to retry with tool preference
export async function retryPreferTool(
  prompt: string,
  settings: ChatSettings,
  modelId: string,
): Promise<CMSSchema | null> {
  try {
    console.log("🔄 [CLIENT] Retrying with tool preference:", prompt.slice(0, 50) + "...")

    const enhancedPrompt = `
      You are a CMS page architect. Generate a JSON schema with nodes/edges only.
      Follow these rules:
      - Edges represent child -> parent.
      - Connect at least one root to the "preview" node.
      - Use proper component types: section, row, column, text, image, button, card, badge, avatar, alert, separator.
      - Set realistic positions (x, y) for visual layout.
      - Include detailed props for each component.
      - IMPORTANT: Return ONLY via createSchema tool call.
      
      User request: ${prompt}
    `.trim()

    return await generateSchemaFromPrompt(enhancedPrompt, settings, modelId)
  } catch (error) {
    console.error("❌ [CLIENT] Error in retry with tool:", error)
    toast({
      title: "Retry Error",
      description: error instanceof Error ? error.message : "Failed to retry with tool",
      variant: "destructive",
    })
    return null
  }
}

// Function to generate variant
export async function generateVariant(
  basePrompt: string,
  variant: string,
  settings: ChatSettings,
  modelId: string,
): Promise<CMSSchema | null> {
  try {
    console.log("🔄 [CLIENT] Generating variant:", variant)

    const enhancedPrompt = `
      You are a CMS page architect. Generate a JSON schema with nodes/edges only.
      Follow these rules:
      - Edges represent child -> parent.
      - Connect at least one root to the "preview" node.
      - Use proper component types: section, row, column, text, image, button, card, badge, avatar, alert, separator.
      - Set realistic positions (x, y) for visual layout.
      - Include detailed props for each component.
      - IMPORTANT: Return ONLY via createSchema tool call.
      
      Base request: ${basePrompt}
      
      Variant style: ${variant}
    `.trim()

    return await generateSchemaFromPrompt(enhancedPrompt, settings, modelId)
  } catch (error) {
    console.error("❌ [CLIENT] Error generating variant:", error)
    toast({
      title: "Variant Error",
      description: error instanceof Error ? error.message : "Failed to generate variant",
      variant: "destructive",
    })
    return null
  }
}

// Helper function to ensure all section nodes are connected to preview
function ensurePreviewConnections(schema: CMSSchema): CMSSchema {
  const { nodes, edges } = schema

  // Find all section nodes
  const sectionNodes = nodes.filter(
    (node) => node.data?.type === "section" || (node.rfType === "component" && node.data?.type === "section"),
  )

  // Find existing preview connections
  const previewConnections = new Set(edges.filter((edge) => edge.target === "preview").map((edge) => edge.source))

  // Create new edges for sections not connected to preview
  const newEdges = [...edges]
  let edgeIdCounter = edges.length + 1

  sectionNodes.forEach((node) => {
    if (!previewConnections.has(node.id)) {
      console.log(`🔄 [CLIENT] Adding missing preview connection for section: ${node.id}`)
      newEdges.push({
        id: `preview-edge-${edgeIdCounter++}`,
        source: node.id,
        target: "preview",
      })
    }
  })

  return {
    nodes,
    edges: newEdges,
  }
}
