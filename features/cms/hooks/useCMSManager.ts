"use client"
import { useState, useCallback, useEffect, useMemo } from "react"
import { addEdge, useNodesState, useEdgesState, type Connection, type Edge, type Node } from "reactflow"
import type { CompNodeData, CMSSchema } from "@/shared/types/schema"
import { arraysEqual, DEFAULTS, computeChildrenMap } from "@/features/cms/widgets"
import { validateDataFlow, logValidationResult } from "@/features/cms/lib/data-flow-validator"

let idCounter = 1
const nextId = (p: string) => `${p}-${idCounter++}`

export function useCMSManager() {
  // Initialize with preview node
  const initialNodes: Node<CompNodeData>[] = useMemo(
    () => [
      {
        id: "preview",
        type: "preview",
        position: { x: 640, y: 240 },
        data: { type: "preview", label: "Preview", props: {}, previewRoots: [], previewBump: 0 },
      },
    ],
    [],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Computed values
  const nodesMap = useMemo(() => new Map(nodes.map((n) => [n.id, n] as const)), [nodes])
  const childrenOf = useMemo(() => computeChildrenMap(edges), [edges])
  const selected = useMemo(() => nodesMap.get(selectedNodeId || ""), [nodesMap, selectedNodeId])
  const hasSelection = Boolean(selectedNodeId && selected)

  // Update global context for preview system
  useEffect(() => {
    ;(window as any).__CMS_BUILDER__ = { nodesMap, childrenOf }
  }, [nodesMap, childrenOf])

  // Validation with proper dependencies
  const validationDeps = useMemo(
    () => ({
      nodes,
      edges,
      selectedId: selectedNodeId,
    }),
    [nodes, edges, selectedNodeId],
  )

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const result = validateDataFlow(validationDeps.nodes, validationDeps.edges, validationDeps.selectedId)
      if (!result.isValid || result.warnings.length > 0) {
        logValidationResult(result, "Canvas State")
      }
    }
  }, [validationDeps])

  // Update preview roots when edges change
  const getCurrentPreviewRoots = useCallback((): string[] => {
    const pv = nodes.find((n) => n.type === "preview")
    return (pv?.data as CompNodeData | undefined)?.previewRoots || []
  }, [nodes])

  useEffect(() => {
    const nextRoots = Array.from(
      new Set(edges.filter((e) => nodesMap.get(e.target)?.data.type === "preview").map((e) => e.source)),
    )
    const prevRoots = getCurrentPreviewRoots()
    if (arraysEqual(nextRoots, prevRoots)) return

    setNodes((nds) =>
      nds.map((n) => (n.type === "preview" ? { ...n, data: { ...(n.data as any), previewRoots: nextRoots } } : n)),
    )
  }, [nodes, edges, setNodes, getCurrentPreviewRoots, nodesMap])

  // Setup refresh function
  useEffect(() => {
    ;(window as any).__CMS_REFRESH__ = () => {
      setNodes((nds) =>
        nds.map((n) =>
          n.type === "preview"
            ? { ...n, data: { ...(n.data as any), previewBump: ((n.data as any).previewBump || 0) + 1 } }
            : n,
        ),
      )
    }
    return () => {
      if ((window as any).__CMS_REFRESH__) delete (window as any).__CMS_REFRESH__
    }
  }, [setNodes])

  // Canvas operations
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  )

  const addComponent = useCallback(
    (type: Exclude<CompNodeData["type"], "preview">) => {
      const id = nextId(type)
      const pos = { x: 120 + (idCounter % 6) * 80, y: 80 + (idCounter % 6) * 60 }
      const node: Node<CompNodeData> = {
        id,
        type: "component",
        position: pos,
        data: { type, label: `${type}`, props: { ...DEFAULTS[type] } },
      }
      setNodes((nds) => nds.concat(node))
    },
    [setNodes],
  )

  const removeSelected = useCallback(() => {
    if (!selectedNodeId) return
    setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId))
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId))
    setSelectedNodeId(null)
  }, [selectedNodeId, setEdges, setNodes])

  const updateSelected = useCallback(
    (updater: (d: CompNodeData) => CompNodeData) => {
      if (!selectedNodeId) return
      setNodes((nds) => nds.map((n) => (n.id === selectedNodeId ? { ...n, data: updater(n.data as CompNodeData) } : n)))
    },
    [selectedNodeId, setNodes],
  )

  const reorderChildren = useCallback(
    (parentId: string, newOrder: string[]) => {
      setNodes((nds) => {
        const map = new Map(nds.map((n) => [n.id, n] as const))
        const parent = map.get(parentId)
        const children = newOrder.map((id) => map.get(id)).filter(Boolean) as Node<CompNodeData>[]
        const baseX =
          children.length > 0 ? Math.min(...children.map((c) => c.position.x || 0)) : parent?.position.x || 200
        const gap = 80
        return nds.map((n) => {
          if (n.id === parentId) {
            const props = { ...(n.data as any).props, childOrder: newOrder.slice() }
            return { ...n, data: { ...(n.data as any), props } }
          }
          const idx = newOrder.indexOf(n.id)
          if (idx >= 0) {
            return { ...n, position: { x: baseX + idx * gap, y: n.position.y } }
          }
          return n
        })
      })
      ;(window as any).__CMS_REFRESH__?.()
    },
    [setNodes],
  )

  const exportSchema = useCallback(() => {
    return { nodes: nodes.map(({ id, type, data, position }) => ({ id, type, data, position })), edges }
  }, [nodes, edges])

  const applySchema = useCallback(
    (schema: CMSSchema) => {
      const previewNode = nodes.find((n) => n.type === "preview") || {
        id: "preview",
        type: "preview",
        position: { x: 640, y: 240 },
        data: { type: "preview", label: "Preview", props: {}, previewRoots: [], previewBump: 0 },
      }
      const normalizedNodes: Node<CompNodeData>[] = (schema.nodes || []).map((n: any) =>
        n.rfType ? { id: n.id, type: n.rfType, position: n.position, data: n.data } : n,
      )
      const withoutPreview = normalizedNodes.filter((n) => n.type !== "preview")
      const nextNodes = [previewNode as any, ...withoutPreview]
      const nextEdges = (schema.edges || []).filter((e) => e?.source && e?.target)
      setNodes(nextNodes)
      setEdges(nextEdges)
      setSelectedNodeId(null)
      refreshPreview()
    },
    [nodes, setNodes, setEdges],
  )

  const refreshPreview = useCallback(() => {
    ;(window as any).__CMS_REFRESH__?.()
  }, [])

  // Schema merge operation
  const mergeSchema = useCallback(
    (schema: CMSSchema) => {
      const basePrefix = `w-${Date.now().toString(36)}`
      const idMap = new Map<string, string>()
      const offsetX = (Math.max(0, ...nodes.map((n: any) => n.position.x)) || 200) + 80
      const offsetY = (Math.max(0, ...nodes.map((n: any) => n.position.y)) || 100) - 40

      const incomingNodes = (schema.nodes || []).map((n: any) =>
        n.rfType ? { id: n.id, type: n.rfType, position: n.position, data: n.data } : n,
      )
      const transformedNodes = incomingNodes
        .filter((n: any) => n.type !== "preview")
        .map((n: any, i: number) => {
          const newId = `${basePrefix}-${n.id || i}`
          idMap.set(n.id, newId)
          return { ...n, id: newId, position: { x: (n.position?.x || 0) + offsetX, y: (n.position?.y || 0) + offsetY } }
        })

      const transformedEdges = (schema.edges || [])
        .filter((e: any) => e?.source && e?.target && e.target !== "preview")
        .map((e: any, i: number) => ({
          id: `${basePrefix}-e-${i}`,
          source: idMap.get(e.source) || `${basePrefix}-${e.source}`,
          target: idMap.get(e.target) || `${basePrefix}-${e.target}`,
        }))

      setNodes((nds: any) => [...nds, ...transformedNodes])
      setEdges((eds: any) => [...eds, ...transformedEdges])
      refreshPreview()
    },
    [nodes, setNodes, setEdges, refreshPreview],
  )

  return {
    // State
    nodes,
    edges,
    selectedNodeId,
    selected,
    hasSelection,
    nodesMap,
    childrenOf,

    // Setters
    setNodes,
    setEdges,
    setSelectedNodeId,

    // React Flow handlers
    onNodesChange,
    onEdgesChange,
    onConnect,

    // Operations
    addComponent,
    removeSelected,
    updateSelected,
    reorderChildren,
    exportSchema,
    applySchema,
    mergeSchema,
    refreshPreview,
  }
}
