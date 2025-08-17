"use client"
import { useCallback, useEffect, useMemo } from "react"
import type React from "react"

import { useToast, useSilenceResizeObserver, useChunkReloadOnFailure } from "@/shared/hooks"
import { PRESET_PROMPTS } from "@/features/cms/ai/constants"
import { useRightRectangleSelect } from "@/features/cms/hooks/use-right-rectangle-select"

// Import components
import { AIChatSheet } from "@/features/cms/components/chat/AIChatSheet"
import { CMSDialogs } from "../components/shared/dialog/cms-dialogs"
import { MainLayout } from "../components/layout/MainLayout"
import { InspectorWrapper } from "../components/inspector/InspectorWrapper"

// Import custom hooks for state management
import { useCMSState } from "@/features/cms/hooks/use-cms-state"
import { useLayoutState } from "@/features/cms/hooks/use-layout-state"
import { useChatState } from "@/features/cms/hooks/use-chat-state"
import { useDialogState } from "@/features/cms/hooks/use-dialog-state"

// Import business logic handlers
import { AIChatHandlers } from "../lib/ai-chat-handlers"
import { ExportHandlers } from "../lib/export-handlers"

// Import utilities
import { validateDataFlow, logValidationResult } from "@/features/cms/lib/data-flow-validator"
import type { ToolsApi, MenuGroup } from "@/features/agent/types"

export default function CMSPage() {
  // Initialize utilities
  useChunkReloadOnFailure()
  useSilenceResizeObserver()
  const { toast } = useToast()

  // State management through custom hooks
  const cmsState = useCMSState()
  const layoutState = useLayoutState()
  const chatState = useChatState()
  const dialogState = useDialogState()

  // Business logic handlers
  const aiChatHandlers = useMemo(
    () => new AIChatHandlers(cmsState, chatState, dialogState),
    [cmsState, chatState, dialogState],
  )
  
  const exportHandlers = useMemo(
    () => new ExportHandlers(cmsState), 
    [cmsState]
  )

  // Canvas interaction handlers
  const {
    wrapRef: canvasWrapRef,
    rect: selRect,
    onContextMenu: onCanvasContextMenu,
  } = useRightRectangleSelect(cmsState.selectedNodeIds, cmsState.setSelectedNodeIds)

  // Data validation effect
  useEffect(() => {
    if (cmsState.nodes.length > 0) {
      const validationResult = validateDataFlow(cmsState.nodes, cmsState.edges)
      logValidationResult(validationResult)
    }
  }, [cmsState.nodes, cmsState.edges])

  // Tools API for agent integration
  const toolsApi: ToolsApi = useMemo(() => ({
    createSchema: aiChatHandlers.sendChat.bind(aiChatHandlers),
    followup: aiChatHandlers.askFollowups.bind(aiChatHandlers),
  }), [aiChatHandlers])

  // Menu groups for navigation
  const menuGroups: MenuGroup[] = useMemo(() => [
    {
      groupId: "main",
      groupName: "Main Actions",
      items: [
        { id: "new", label: "New Project", shortcut: "Ctrl+N" },
        { id: "save", label: "Save", shortcut: "Ctrl+S" },
        { id: "export", label: "Export", shortcut: "Ctrl+E" },
      ],
    },
  ], [])

  // Main render composition
  return (
    <div className="h-screen overflow-hidden">
      {/* Main Layout Component - handles all UI layout */}
      <MainLayout
        // CMS State
        nodes={cmsState.nodes}
        edges={cmsState.edges}
        selectedNodeIds={cmsState.selectedNodeId ? [cmsState.selectedNodeId] : []}
        onNodesChange={cmsState.onNodesChange}
        onEdgesChange={cmsState.onEdgesChange}
        onSelectionChange={(ids) => cmsState.setSelectedNodeId(ids[0] || null)}
        
        // Layout State
        showAIChat={layoutState.showAIChat}
        showPreview={layoutState.showPreview}
        sidebarCollapsed={layoutState.sidebarCollapsed}
        onToggleAIChat={layoutState.toggleAIChat}
        onTogglePreview={layoutState.togglePreview}
        onToggleSidebar={layoutState.toggleSidebar}
        
        // Canvas interaction
        canvasWrapRef={canvasWrapRef}
        selectionRect={selRect}
        onCanvasContextMenu={onCanvasContextMenu}
        
        // Handlers
        onExport={exportHandlers.handleExport}
        onImport={exportHandlers.handleImport}
        toolsApi={toolsApi}
        menuGroups={menuGroups}
      >
        {/* Inspector Panel */}
        <InspectorWrapper
          selectedNodeIds={cmsState.selectedNodeId ? [cmsState.selectedNodeId] : []}
          nodes={cmsState.nodes}
          onUpdateNode={cmsState.updateNodeData}
        />
      </MainLayout>

      {/* AI Chat Sheet */}
      <AIChatSheet
        isOpen={layoutState.showAIChat}
        onClose={layoutState.toggleAIChat}
        selectedNode={cmsState.selectedNode}
        includeChildren={chatState.includeChildren}
        onIncludeChildrenChange={chatState.setIncludeChildren}
        onSend={aiChatHandlers.handleSend}
        chatState={chatState}
      />

      {/* Dialog Components */}
      <CMSDialogs
        dialogState={dialogState}
        onExport={exportHandlers.handleExport}
        onImport={exportHandlers.handleImport}
        onUnifiedImport={exportHandlers.handleUnifiedImport}
      />
    </div>
  )
}
