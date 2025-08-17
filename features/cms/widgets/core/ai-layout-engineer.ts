import type { Node, Edge } from "reactflow"
import type { ComponentType, CompProps } from "@/shared/types/schema"
import { DEFAULTS, VALIDATION_RULES, BRAND_TOKENS, DEVICE_PRESETS } from "./constants"
import { generateId } from "./utils"

export interface LayoutSnapshot {
  nodes: Node[]
  edges: Edge[]
  selectedId?: string
  devicePreset: string
  brandTokens: typeof BRAND_TOKENS
}

export interface ToolResult {
  ok: boolean
  message: string
  snapshot: {
    nodeCount: number
    edgeCount: number
    changedIds: string[]
  }
}

export class AILayoutEngineer {
  private snapshot: LayoutSnapshot
  private history: LayoutSnapshot[] = []
  private historyIndex = -1
  private maxHistory = 20

  constructor(initialSnapshot?: LayoutSnapshot) {
    this.snapshot = initialSnapshot || {
      nodes: [],
      edges: [],
      devicePreset: "desktop",
      brandTokens: BRAND_TOKENS,
    }
    this.saveToHistory()
  }

  private saveToHistory() {
    // Remove any future history if we're not at the end
    this.history = this.history.slice(0, this.historyIndex + 1)

    // Add current state
    this.history.push(JSON.parse(JSON.stringify(this.snapshot)))

    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift()
    } else {
      this.historyIndex++
    }
  }

  private validateProps(type: ComponentType, props: Partial<CompProps>): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const rules = VALIDATION_RULES[type as keyof typeof VALIDATION_RULES]

    if (!rules) return { valid: true, errors: [] }

    // Validate based on rules
    Object.entries(props).forEach(([key, value]) => {
      const rule = rules[key as keyof typeof rules]
      if (!rule) return

      if (typeof rule === "object" && "min" in rule && "max" in rule) {
        if (typeof value === "number" && (value < rule.min || value > rule.max)) {
          errors.push(`${key} must be between ${rule.min} and ${rule.max}`)
        }
      } else if (Array.isArray(rule)) {
        if (!rule.includes(value as any)) {
          errors.push(`${key} must be one of: ${rule.join(", ")}`)
        }
      }
    })

    return { valid: errors.length === 0, errors }
  }

  private detectCycles(childId: string, parentId: string): boolean {
    const visited = new Set<string>()
    const stack = [parentId]

    while (stack.length > 0) {
      const current = stack.pop()!
      if (current === childId) return true
      if (visited.has(current)) continue

      visited.add(current)
      const children = this.snapshot.edges.filter((edge) => edge.source === current).map((edge) => edge.target)

      stack.push(...children)
    }

    return false
  }

  // Tool implementations based on specification
  addNode(
    type: ComponentType,
    label: string,
    props: Partial<CompProps> = {},
    position: { x: number; y: number },
  ): ToolResult {
    try {
      // Validate props
      const validation = this.validateProps(type, props)
      if (!validation.valid) {
        return {
          ok: false,
          message: `Validation failed: ${validation.errors.join(", ")}`,
          snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
        }
      }

      const id = generateId()
      const defaultProps = DEFAULTS[type]
      const finalProps = { ...defaultProps, ...props }

      const newNode: Node = {
        id,
        type: "component",
        position,
        data: {
          label,
          componentType: type,
          props: finalProps,
        },
      }

      this.snapshot.nodes.push(newNode)
      this.saveToHistory()

      return {
        ok: true,
        message: `Added ${type} node: ${label}`,
        snapshot: {
          nodeCount: this.snapshot.nodes.length,
          edgeCount: this.snapshot.edges.length,
          changedIds: [id],
        },
      }
    } catch (error) {
      return {
        ok: false,
        message: `Failed to add node: ${error}`,
        snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
      }
    }
  }

  connectNodes(childId: string, parentId: string): ToolResult {
    try {
      // Check for cycles
      if (this.detectCycles(childId, parentId)) {
        return {
          ok: false,
          message: "Connection would create a cycle",
          snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
        }
      }

      // Check if nodes exist
      const childExists = this.snapshot.nodes.some((n) => n.id === childId)
      const parentExists = this.snapshot.nodes.some((n) => n.id === parentId)

      if (!childExists || !parentExists) {
        return {
          ok: false,
          message: "One or both nodes do not exist",
          snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
        }
      }

      // Check if connection already exists
      const existingEdge = this.snapshot.edges.find((edge) => edge.source === childId && edge.target === parentId)

      if (existingEdge) {
        return {
          ok: true,
          message: "Connection already exists",
          snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
        }
      }

      const newEdge: Edge = {
        id: `${childId}-${parentId}`,
        source: childId,
        target: parentId,
      }

      this.snapshot.edges.push(newEdge)
      this.saveToHistory()

      return {
        ok: true,
        message: `Connected ${childId} to ${parentId}`,
        snapshot: {
          nodeCount: this.snapshot.nodes.length,
          edgeCount: this.snapshot.edges.length,
          changedIds: [childId, parentId],
        },
      }
    } catch (error) {
      return {
        ok: false,
        message: `Failed to connect nodes: ${error}`,
        snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
      }
    }
  }

  updateNodeProps(id: string, patch: Partial<CompProps>): ToolResult {
    try {
      const nodeIndex = this.snapshot.nodes.findIndex((n) => n.id === id)
      if (nodeIndex === -1) {
        return {
          ok: false,
          message: "Node not found",
          snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
        }
      }

      const node = this.snapshot.nodes[nodeIndex]
      const type = node.data.componentType as ComponentType

      // Validate props
      const validation = this.validateProps(type, patch)
      if (!validation.valid) {
        return {
          ok: false,
          message: `Validation failed: ${validation.errors.join(", ")}. Auto-fix available.`,
          snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
        }
      }

      // Update props
      this.snapshot.nodes[nodeIndex] = {
        ...node,
        data: {
          ...node.data,
          props: { ...node.data.props, ...patch },
        },
      }

      this.saveToHistory()

      return {
        ok: true,
        message: `Updated props for ${node.data.label}`,
        snapshot: {
          nodeCount: this.snapshot.nodes.length,
          edgeCount: this.snapshot.edges.length,
          changedIds: [id],
        },
      }
    } catch (error) {
      return {
        ok: false,
        message: `Failed to update node props: ${error}`,
        snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
      }
    }
  }

  deleteNode(id: string, confirmed = false): ToolResult {
    try {
      const node = this.snapshot.nodes.find((n) => n.id === id)
      if (!node) {
        return {
          ok: false,
          message: "Node not found",
          snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
        }
      }

      // Check for children
      const hasChildren = this.snapshot.edges.some((edge) => edge.target === id)
      if (hasChildren && !confirmed) {
        return {
          ok: false,
          message: "Node has children. Please confirm deletion to remove all connected nodes.",
          snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
        }
      }

      // Remove node and all related edges
      this.snapshot.nodes = this.snapshot.nodes.filter((n) => n.id !== id)
      this.snapshot.edges = this.snapshot.edges.filter((edge) => edge.source !== id && edge.target !== id)

      this.saveToHistory()

      return {
        ok: true,
        message: `Deleted node ${node.data.label}`,
        snapshot: {
          nodeCount: this.snapshot.nodes.length,
          edgeCount: this.snapshot.edges.length,
          changedIds: [id],
        },
      }
    } catch (error) {
      return {
        ok: false,
        message: `Failed to delete node: ${error}`,
        snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
      }
    }
  }

  repositionNode(id: string, x: number, y: number): ToolResult {
    try {
      const nodeIndex = this.snapshot.nodes.findIndex((n) => n.id === id)
      if (nodeIndex === -1) {
        return {
          ok: false,
          message: "Node not found",
          snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
        }
      }

      this.snapshot.nodes[nodeIndex] = {
        ...this.snapshot.nodes[nodeIndex],
        position: { x, y },
      }

      this.saveToHistory()

      return {
        ok: true,
        message: `Repositioned node to (${x}, ${y})`,
        snapshot: {
          nodeCount: this.snapshot.nodes.length,
          edgeCount: this.snapshot.edges.length,
          changedIds: [id],
        },
      }
    } catch (error) {
      return {
        ok: false,
        message: `Failed to reposition node: ${error}`,
        snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
      }
    }
  }

  setDevicePreset(deviceKey: string): ToolResult {
    try {
      const preset = DEVICE_PRESETS.find((p) => p.key === deviceKey)
      if (!preset) {
        return {
          ok: false,
          message: `Invalid device preset: ${deviceKey}`,
          snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
        }
      }

      this.snapshot.devicePreset = deviceKey
      this.saveToHistory()

      return {
        ok: true,
        message: `Set device preset to ${preset.label}`,
        snapshot: {
          nodeCount: this.snapshot.nodes.length,
          edgeCount: this.snapshot.edges.length,
          changedIds: [],
        },
      }
    } catch (error) {
      return {
        ok: false,
        message: `Failed to set device preset: ${error}`,
        snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
      }
    }
  }

  runChecks(): { findings: string[]; suggestions: string[] } {
    const findings: string[] = []
    const suggestions: string[] = []

    // Check heading hierarchy
    const headings = this.snapshot.nodes
      .filter((n) => n.data.componentType === "text" && n.data.props.tag?.startsWith("h"))
      .sort((a, b) => Number.parseInt(a.data.props.tag.slice(1)) - Number.parseInt(b.data.props.tag.slice(1)))

    if (headings.length > 0) {
      const firstHeading = headings[0]
      if (firstHeading.data.props.tag !== "h1") {
        findings.push("Page should start with h1 heading")
        suggestions.push("Change first heading to h1")
      }
    }

    // Check image alt text
    const imagesWithoutAlt = this.snapshot.nodes.filter(
      (n) => n.data.componentType === "image" && (!n.data.props.alt || n.data.props.alt === "placeholder"),
    )

    if (imagesWithoutAlt.length > 0) {
      findings.push(`${imagesWithoutAlt.length} images missing descriptive alt text`)
      suggestions.push("Add meaningful alt text to all images")
    }

    // Check button labels
    const buttonsWithGenericLabels = this.snapshot.nodes.filter(
      (n) =>
        n.data.componentType === "button" && (n.data.props.label === "Click me" || n.data.props.label === "Button"),
    )

    if (buttonsWithGenericLabels.length > 0) {
      findings.push(`${buttonsWithGenericLabels.length} buttons have generic labels`)
      suggestions.push('Use descriptive button labels like "Book now", "Learn more"')
    }

    return { findings, suggestions }
  }

  undo(): ToolResult {
    if (this.historyIndex <= 0) {
      return {
        ok: false,
        message: "Nothing to undo",
        snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
      }
    }

    this.historyIndex--
    this.snapshot = JSON.parse(JSON.stringify(this.history[this.historyIndex]))

    return {
      ok: true,
      message: "Undid last action",
      snapshot: {
        nodeCount: this.snapshot.nodes.length,
        edgeCount: this.snapshot.edges.length,
        changedIds: [],
      },
    }
  }

  redo(): ToolResult {
    if (this.historyIndex >= this.history.length - 1) {
      return {
        ok: false,
        message: "Nothing to redo",
        snapshot: { nodeCount: this.snapshot.nodes.length, edgeCount: this.snapshot.edges.length, changedIds: [] },
      }
    }

    this.historyIndex++
    this.snapshot = JSON.parse(JSON.stringify(this.history[this.historyIndex]))

    return {
      ok: true,
      message: "Redid last action",
      snapshot: {
        nodeCount: this.snapshot.nodes.length,
        edgeCount: this.snapshot.edges.length,
        changedIds: [],
      },
    }
  }

  getSnapshot(): LayoutSnapshot {
    return JSON.parse(JSON.stringify(this.snapshot))
  }

  // Generate summary after batch operations
  generateSummary(): string {
    const { findings, suggestions } = this.runChecks()

    return `
Layout Summary:
- Nodes: ${this.snapshot.nodes.length}
- Edges: ${this.snapshot.edges.length}
- Device: ${this.snapshot.devicePreset}
- Findings: ${findings.length === 0 ? "None" : findings.join(", ")}
- Ready for export: ${findings.length === 0 ? "Yes" : "After fixes"}
    `.trim()
  }
}
