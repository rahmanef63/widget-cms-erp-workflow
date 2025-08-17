import type { Edge, Node } from "reactflow"
import type { CompNodeData, CMSSchema } from "@/shared/types/schema"

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  stats: {
    nodeCount: number
    edgeCount: number
    orphanedNodes: string[]
    invalidEdges: string[]
    previewConnections: number
  }
}

export function validateDataFlow(
  nodes: Node<CompNodeData>[],
  edges: Edge[],
  selectedId?: string | null,
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const nodeIds = new Set(nodes.map((n) => n.id))
  const orphanedNodes: string[] = []
  const invalidEdges: string[] = []

  // Validate nodes
  nodes.forEach((node) => {
    if (!node.data || !node.data.type) {
      errors.push(`Node ${node.id} has invalid or missing data`)
    }

    if (!node.position || typeof node.position.x !== "number" || typeof node.position.y !== "number") {
      errors.push(`Node ${node.id} has invalid position data`)
    }
  })

  // Validate edges
  edges.forEach((edge) => {
    if (!nodeIds.has(edge.source)) {
      invalidEdges.push(edge.id)
      errors.push(`Edge ${edge.id} references missing source node: ${edge.source}`)
    }

    if (!nodeIds.has(edge.target) && edge.target !== "preview") {
      invalidEdges.push(edge.id)
      errors.push(`Edge ${edge.id} references missing target node: ${edge.target}`)
    }
  })

  // Find orphaned nodes (nodes not connected to anything)
  const connectedNodes = new Set([...edges.map((e) => e.source), ...edges.map((e) => e.target)])

  nodes.forEach((node) => {
    if (node.type !== "preview" && !connectedNodes.has(node.id)) {
      orphanedNodes.push(node.id)
      warnings.push(`Node ${node.id} is not connected to any other nodes`)
    }
  })

  // Check preview connections
  const previewConnections = edges.filter((e) => e.target === "preview").length
  if (previewConnections === 0) {
    warnings.push("No nodes are connected to the preview - canvas will appear empty")
  }

  // Validate selected node if provided
  if (selectedId && !nodeIds.has(selectedId)) {
    errors.push(`Selected node ${selectedId} does not exist in canvas`)
  }

  const stats = {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    orphanedNodes,
    invalidEdges,
    previewConnections,
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats,
  }
}

export function validateSchema(schema: CMSSchema): ValidationResult {
  const nodes = (schema.nodes || []).map((n) =>
    "rfType" in n ? { id: n.id, type: n.rfType, position: n.position, data: n.data } : n,
  ) as Node<CompNodeData>[]

  const edges = schema.edges || []

  return validateDataFlow(nodes, edges)
}

export function logValidationResult(result: ValidationResult, context = "Canvas") {
  console.group(`🔍 ${context} Validation Report`)

  console.log("📊 Statistics:", result.stats)

  if (result.errors.length > 0) {
    console.error("❌ Errors:", result.errors)
  }

  if (result.warnings.length > 0) {
    console.warn("⚠️ Warnings:", result.warnings)
  }

  if (result.isValid && result.warnings.length === 0) {
    console.log("✅ All validations passed!")
  }

  console.groupEnd()

  return result
}
