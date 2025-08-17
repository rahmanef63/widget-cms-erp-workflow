"use client"
import type React from "react"
import { Sidebar } from "../sidebar/sidebar"
import { CanvasArea } from "../canvas/canvas-area"
import { InspectorWrapper } from "@/features/cms/components/inspector/InspectorWrapper"

interface MainLayoutProps {
  // Layout state
  sidebarOpen: boolean
  sidebarPinned: boolean
  inspectorOpen: boolean
  inspectorPinned: boolean
  onToggleSidebarPin: () => void
  onCloseSidebar: () => void
  onToggleInspectorPin: () => void
  onCloseInspector: () => void
  onToggleSidebar: () => void
  onToggleInspector: () => void

  // CMS state
  nodes: any[]
  edges: any[]
  hasSelection: boolean
  selected: any
  selectedNodeId: string | null
  onNodesChange: (changes: any) => void
  onEdgesChange: (changes: any) => void
  onConnect: (connection: any) => void
  onSelectionChange: (selection: any) => void
  onAddComponent: (type: string) => void
  onUpdateSelected: (updates: any) => void
  onRemoveSelected: () => void
  onReorderChildren: (parentId: string, childIds: string[]) => void

  // Canvas interaction
  selRect: any
  onContextMenu: (e: React.MouseEvent) => void
  onMouseDown: (e: React.MouseEvent) => void
  canvasRef: React.RefObject<HTMLDivElement>

  // Actions
  onOpenChat: () => void
  onGenerateTwoWays: () => void
  onOpenImport: () => void
  onExportSchema: () => void
  onExportSingleFile: () => void
  onExportEachRootAsFile: () => void
  onExportStandaloneHTML: () => void
  onRefreshPreview: () => void
  onShareLink: () => void
  onOpenWidgetDialog: () => void
}

const LAYOUT = { sidebarWidth: 250, inspectorWidth: 300 }

export function MainLayout({
  sidebarOpen,
  sidebarPinned,
  inspectorOpen,
  inspectorPinned,
  onToggleSidebarPin,
  onCloseSidebar,
  onToggleInspectorPin,
  onCloseInspector,
  onToggleSidebar,
  onToggleInspector,
  nodes,
  edges,
  hasSelection,
  selected,
  selectedNodeId,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectionChange,
  onAddComponent,
  onUpdateSelected,
  onRemoveSelected,
  onReorderChildren,
  selRect,
  onContextMenu,
  onMouseDown,
  canvasRef,
  onOpenChat,
  onGenerateTwoWays,
  onOpenImport,
  onExportSchema,
  onExportSingleFile,
  onExportEachRootAsFile,
  onExportStandaloneHTML,
  onRefreshPreview,
  onShareLink,
  onOpenWidgetDialog,
}: MainLayoutProps) {
  const layoutCols = `${sidebarOpen ? `${LAYOUT.sidebarWidth}px` : "0px"} 1fr ${inspectorOpen ? `${LAYOUT.inspectorWidth}px` : "0px"}`

  return (
    <main className="h-dvh w-full" style={{ display: "grid", gridTemplateColumns: layoutCols }}>
      <Sidebar
        open={sidebarOpen}
        pinned={sidebarPinned}
        hasSelection={hasSelection}
        onTogglePin={onToggleSidebarPin}
        onClose={onCloseSidebar}
        onAddComponent={onAddComponent}
        onOpenChat={onOpenChat}
        onGenerateTwoWays={onGenerateTwoWays}
        onCreateJsonFromSelection={() => {}} // TODO: Implement
        onOpenImport={onOpenImport}
        onLoadExample={() => {}} // TODO: Implement
        onExportSchema={onExportSchema}
        onExportSingleFile={onExportSingleFile}
        onExportEachRootAsFile={onExportEachRootAsFile}
        onExportStandaloneHTML={onExportStandaloneHTML}
        onRefreshPreview={onRefreshPreview}
        onShareLink={onShareLink}
        onOpenWidgetDialog={onOpenWidgetDialog}
      />

      <CanvasArea
        sidebarOpen={sidebarOpen}
        inspectorOpen={inspectorOpen}
        onToggleSidebar={onToggleSidebar}
        onToggleInspector={onToggleInspector}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        selRect={selRect}
        onContextMenu={onContextMenu}
        onMouseDown={onMouseDown}
        canvasRef={canvasRef}
      />

      <InspectorWrapper
        open={inspectorOpen}
        pinned={inspectorPinned}
        onTogglePin={onToggleInspectorPin}
        onRequestClose={onCloseInspector}
        selected={selected}
        onChange={onUpdateSelected}
        onDelete={onRemoveSelected}
        onReorderChildren={onReorderChildren}
      />
    </main>
  )
}
