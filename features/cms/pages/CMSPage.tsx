"use client"
import { useCallback, useEffect, useMemo } from "react"
import type React from "react"
import {AIChatSheet} from "@/features/cms/components/chat/AIChatSheet" // Import AIChatSheet component

import { useToast, useSilenceResizeObserver, useChunkReloadOnFailure } from "@/shared/hooks"

import { PRESET_PROMPTS } from "@/features/cms/ai/constants"
import { useRightRectangleSelect } from "@/features/cms/hooks/use-right-rectangle-select"

import { CMSDialogs } from "../components/shared/dialog/cms-dialogs"
import { MainLayout } from "../components/layout/MainLayout"
import type { ToolsApi, MenuGroup } from "@/features/agent/types"
import { validateDataFlow, logValidationResult } from "@/features/cms/lib/data-flow-validator"

// Import hooks
import { useCMSState } from "@/features/cms/hooks/use-cms-state"
import { useLayoutState } from "@/features/cms/hooks/use-layout-state"
import { useChatState } from "@/features/cms/hooks/use-chat-state"
import { useDialogState } from "@/features/cms/hooks/use-dialog-state"

// Import handlers
import { AIChatHandlers } from "../lib/ai-chat-handlers"
import { ExportHandlers } from "../lib/export-handlers"
import { InspectorWrapper } from "../components/inspector/InspectorWrapper"

export default function CMSPage() {
  useChunkReloadOnFailure()
  useSilenceResizeObserver()

  const { toast } = useToast()

  // Custom hooks for state management
  const cmsState = useCMSState()
  const layoutState = useLayoutState()
  const chatState = useChatState()
  const dialogState = useDialogState()

  // Initialize handlers
  const aiChatHandlers = useMemo(
    () => new AIChatHandlers(cmsState, chatState, dialogState),
    [cmsState, chatState, dialogState],
  )
  const exportHandlers = useMemo(() => new ExportHandlers(cmsState), [cmsState])

  // Right-drag selection
  const {
    wrapRef: canvasWrapRef,
    rect: selRect,
    onContextMenu: onCanvasContextMenu,
    onMouseDown: onCanvasMouseDown,
    computeSelectedIds,
  } = useRightRectangleSelect()

  // Selection handling
  useEffect(() => {
    if (!selRect) return
    const onMouseUp = () => {
      const { ids } = computeSelectedIds()
      cmsState.setNodes((nds: any) => nds.map((n: any) => ({ ...n, selected: ids.has(n.id) })))
    }
    window.addEventListener("mouseup", onMouseUp, { once: true })
    return () => {}
  }, [selRect, computeSelectedIds, cmsState.setNodes])

  // Memoize the validation effect to prevent infinite loops
  const validationDeps = useMemo(
    () => ({
      nodes: cmsState.nodes,
      edges: cmsState.edges,
      selectedId: cmsState.selectedNodeId,
    }),
    [cmsState.nodes, cmsState.edges, cmsState.selectedNodeId],
  )

  // Validation with proper dependencies
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const result = validateDataFlow(validationDeps.nodes, validationDeps.edges, validationDeps.selectedId)
      if (!result.isValid || result.warnings.length > 0) {
        logValidationResult(result, "Canvas State")
      }
    }
  }, [validationDeps])

  // Schema operations
  const mergeSchema = useCallback(
    (schema: any) => {
      const basePrefix = `w-${Date.now().toString(36)}`
      const idMap = new Map<string, string>()
      const offsetX = (Math.max(0, ...cmsState.nodes.map((n: any) => n.position.x)) || 200) + 80
      const offsetY = (Math.max(0, ...cmsState.nodes.map((n: any) => n.position.y)) || 100) - 40

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

      cmsState.setNodes((nds: any) => [...nds, ...transformedNodes])
      cmsState.setEdges((eds: any) => [...eds, ...transformedEdges])
      toast({ title: "Widget added", description: `${transformedNodes.length} node(s) merged into canvas.` })
      cmsState.refreshPreview()
    },
    [cmsState, toast],
  )

  const handleUnifiedJsonSubmit = useCallback(
    (value: string, mode: any) => {
      try {
        const parsed = JSON.parse(value)

        switch (mode) {
          case "import":
            if (!parsed?.nodes) throw new Error("Invalid schema format: missing nodes")

            // Ensure all section nodes are connected to preview
            const sectionNodes = parsed.nodes.filter(
              (node: any) =>
                node.data?.type === "section" || (node.rfType === "component" && node.data?.type === "section"),
            )

            const previewConnections = new Set(
              parsed.edges.filter((edge: any) => edge.target === "preview").map((edge: any) => edge.source),
            )

            const newEdges = [...parsed.edges]
            let edgeIdCounter = parsed.edges.length + 1

            sectionNodes.forEach((node: any) => {
              if (!previewConnections.has(node.id)) {
                console.log(`🔄 [CLIENT] Adding missing preview connection for section: ${node.id}`)
                newEdges.push({
                  id: `preview-edge-${edgeIdCounter++}`,
                  source: node.id,
                  target: "preview",
                })
              }
            })

            parsed.edges = newEdges

            cmsState.applySchema(parsed)
            toast({ title: "Schema imported", description: "Canvas content replaced with imported schema." })
            break

          case "widget":
            if (parsed?.nodes && parsed?.edges) {
              mergeSchema(parsed)
            } else if (parsed?.id && parsed?.data) {
              const schema = { nodes: [parsed], edges: [] }
              mergeSchema(schema)
            } else {
              throw new Error("Expected schema with {nodes, edges} or a single node object")
            }
            break

          case "export":
            if (navigator.clipboard) {
              navigator.clipboard.writeText(value)
              toast({ title: "Copied to clipboard", description: "Widget JSON copied successfully." })
            }
            break
        }
      } catch (e: any) {
        toast({
          title: "JSON Error",
          description: e?.message ?? "Invalid JSON format",
          variant: "destructive",
        })
      }
    },
    [cmsState, mergeSchema, toast],
  )

  // File picker
  const onFilePicked = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0]
      if (!f) return

      try {
        console.log("🔄 [CHAT] File picked:", f.name, f.type)
        const type = f.type || "application/octet-stream"

        if (type.includes("json") || f.name.endsWith(".json")) {
          try {
            const txt = await f.text()
            const parsed = JSON.parse(txt)

            if (parsed?.nodes && parsed?.edges) {
              console.log("✅ [CHAT] Valid schema JSON detected, applying to canvas")
              cmsState.applySchema(parsed)
              toast({ title: "Schema imported", description: f.name })
              return
            }
          } catch (error) {
            console.error("❌ [CHAT] Error parsing JSON file:", error)
            toast({
              title: "Invalid JSON",
              description: "The file is not a valid schema JSON",
              variant: "destructive",
            })
            return
          }
        }

        chatState.setAttachments((a: any) => [
          ...a,
          { id: Date.now().toString(), name: f.name, type, size: f.size, url: "" },
        ])
        toast({ title: "Attachment added", description: `${f.name} (${type})` })
      } catch (error) {
        console.error("❌ [CHAT] Error handling file:", error)
        toast({
          title: "File Error",
          description: "Failed to process the file",
          variant: "destructive",
        })
      } finally {
        // Clear the input
        e.target.value = ""
      }
    },
    [chatState, cmsState, toast],
  )

  // Tools API
  const tools: ToolsApi = {
    applyJsonFromChat: aiChatHandlers.applyJsonFromChat.bind(aiChatHandlers),
    openImportJson: dialogState.openImportDialog,
    openWidgetDialog: dialogState.openWidgetDialog,
    exportSchema: exportHandlers.exportSchema,
    exportSingleFile: exportHandlers.exportSingleFile,
    exportEachRootAsFile: exportHandlers.exportEachRootAsFile,
    exportStandaloneHTML: exportHandlers.exportStandaloneHTML,
    refreshPreview: cmsState.refreshPreview,
    shareLink: exportHandlers.shareLink,
  }

  const menuGroups: MenuGroup[] = [
    {
      label: "Canvas Tools",
      items: [
        { label: "Apply JSON from chat", onClick: tools.applyJsonFromChat || (() => {}) },
        { label: "Open Import JSON", onClick: tools.openImportJson || (() => {}) },
        { label: "Create Widget from JSON…", onClick: tools.openWidgetDialog || (() => {}) },
      ],
    },
  ]

  return (
    <>
      <MainLayout
        sidebarOpen={layoutState.sidebarOpen}
        sidebarPinned={layoutState.sidebarPinned}
        inspectorOpen={layoutState.inspectorOpen}
        inspectorPinned={layoutState.inspectorPinned}
        onToggleSidebarPin={() => layoutState.setSidebarPinned((v) => !v)}
        onCloseSidebar={() => layoutState.setSidebarOpen(false)}
        onToggleInspectorPin={() => layoutState.setInspectorPinned((v) => !v)}
        onCloseInspector={() => layoutState.setInspectorOpen(false)}
        onToggleSidebar={() => layoutState.setSidebarOpen((v) => !v)}
        onToggleInspector={() => layoutState.setInspectorOpen((v) => !v)}
        nodes={cmsState.nodes as any}
        edges={cmsState.edges}
        hasSelection={cmsState.hasSelection}
        selected={cmsState.selected as any}
        selectedNodeId={cmsState.selectedNodeId}
        onNodesChange={cmsState.onNodesChange}
        onEdgesChange={cmsState.onEdgesChange}
        onConnect={cmsState.onConnect}
        onSelectionChange={({ nodes }: any) => {
          cmsState.setSelectedNodeId(nodes[0]?.id ?? null)
          if (!layoutState.inspectorPinned) layoutState.setInspectorOpen(Boolean(nodes[0]?.id))
        }}
        onAddComponent={(t) => cmsState.addComponent(t as any)}
        onUpdateSelected={cmsState.updateSelected}
        onRemoveSelected={cmsState.removeSelected}
        onReorderChildren={cmsState.reorderChildren}
        selRect={selRect}
        onContextMenu={onCanvasContextMenu}
        onMouseDown={onCanvasMouseDown}
        canvasRef={canvasWrapRef as React.RefObject<HTMLDivElement>}
        onOpenChat={() => chatState.setChatOpen(true)}
        onGenerateTwoWays={aiChatHandlers.generateTwoWays.bind(aiChatHandlers)}
        onOpenImport={dialogState.openImportDialog}
        onExportSchema={exportHandlers.exportSchema}
        onExportSingleFile={exportHandlers.exportSingleFile}
        onExportEachRootAsFile={exportHandlers.exportEachRootAsFile}
        onExportStandaloneHTML={exportHandlers.exportStandaloneHTML}
        onRefreshPreview={cmsState.refreshPreview}
        onShareLink={exportHandlers.shareLink}
        onOpenWidgetDialog={dialogState.openWidgetDialog}
      />

      <AIChatSheet
        open={chatState.chatOpen}
        onOpenChange={chatState.setChatOpen}
        modelId={chatState.modelId}
        effectiveModels={chatState.effectiveModels}
        onPickModel={chatState.handlePickModel}
        onOpenConfig={() => chatState.setInlineConfigOpen(true)}
        chatMessages={chatState.chatMessages}
        aiTyping={chatState.aiTyping}
        sending={chatState.sending}
        chatInput={chatState.chatInput}
        onChangeInput={chatState.setChatInput}
        onSend={aiChatHandlers.sendChat.bind(aiChatHandlers)}
        attachments={chatState.attachments}
        onRemoveAttachment={(idx) =>
          chatState.setAttachments((list: any) => list.filter((_: any, i: number) => i !== idx))
        }
        onFilePicked={onFilePicked}
        onRetryPreferTool={aiChatHandlers.retryWithTools.bind(aiChatHandlers)}
        onAskFollowups={aiChatHandlers.askFollowups.bind(aiChatHandlers)}
        onEndInterview={aiChatHandlers.endInterview.bind(aiChatHandlers)}
        interviewActive={chatState.interviewActive}
        autoGenerate={chatState.autoGenerate}
        onToggleAutoGenerate={chatState.setAutoGenerate}
        tools={tools}
        menuGroups={menuGroups}
        presetPrompts={PRESET_PROMPTS}
      />

      <CMSDialogs
        jsonDialogOpen={dialogState.jsonDialogOpen}
        setJsonDialogOpen={dialogState.setJsonDialogOpen}
        jsonDialogMode={dialogState.jsonDialogMode}
        jsonDialogValue={dialogState.jsonDialogValue}
        setJsonDialogValue={dialogState.setJsonDialogValue}
        onJsonSubmit={handleUnifiedJsonSubmit}
        twoWaysOpen={dialogState.twoWaysOpen}
        setTwoWaysOpen={dialogState.setTwoWaysOpen}
        twoBusy={dialogState.twoBusy}
        twoA={dialogState.twoA}
        twoB={dialogState.twoB}
        onUseVariant={(which) => {
          if (which === "A" && dialogState.twoA) cmsState.applySchema(dialogState.twoA)
          if (which === "B" && dialogState.twoB) cmsState.applySchema(dialogState.twoB)
          dialogState.setTwoWaysOpen(false)
        }}
        inlineConfigOpen={chatState.inlineConfigOpen}
        setInlineConfigOpen={chatState.setInlineConfigOpen}
        cfgModelName={chatState.cfgModelName}
        setCfgModelName={chatState.setCfgModelName}
        cfgApiKey={chatState.cfgApiKey}
        setCfgApiKey={chatState.setCfgApiKey}
        onPersistConfig={chatState.persistInlineConfig}
      />
    </>
  )
}
