"use client"
import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { getWidgetCategory } from "../../lib/widget-categorization"
import { CMSAgentChatContent } from "../../ai/components/ChatContent"
import { useCMSChatState } from "../../ai/hooks/useCMSChatState"
import { CMSAgentUtils } from "../../ai/utils"
import { useMemo } from "react"

interface InspectorTabsProps {
  selected?: Node<CompNodeData>
  pinned: boolean
  setPinned: (v: boolean) => void
  onClose: () => void
  onDelete: () => void
  inspectorState?: any
  // CMS state for context
  cmsState?: any
  dialogState?: any
}

export function InspectorTabs({
  selected,
  pinned,
  setPinned,
  onClose,
  onDelete,
  inspectorState,
  cmsState,
  dialogState,
}: InspectorTabsProps) {
  const chatState = useCMSChatState()

  // Initialize CMS agent utils
  const cmsAgentUtils = useMemo(
    () => (cmsState && dialogState ? new CMSAgentUtils(cmsState, chatState, dialogState) : null),
    [cmsState, chatState, dialogState],
  )

  const includeChildren = chatState?.includeChildren ?? false
  const setIncludeChildren = chatState?.setIncludeChildren ?? (() => {})

  // Handle context-aware chat send
  const handleContextAwareChat = async (context?: { selectedNode?: Node<CompNodeData>; includeChildren: boolean }) => {
    if (!cmsAgentUtils) return

    // Create full context with nodes and edges
    const fullContext = context
      ? {
          ...context,
          nodes: cmsState?.nodes || [],
          edges: cmsState?.edges || [],
        }
      : undefined

    await cmsAgentUtils.sendContextAwareChat(fullContext)
  }

  return (
    <div className="border-b border-gray-200 p-3 leading-7 px-3">
      <Tabs defaultValue={inspectorState?.activeTab || "design"} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="ai" className="text-xs">
            AI
          </TabsTrigger>
          <TabsTrigger value="design" className="text-xs">
            Design
          </TabsTrigger>
          <TabsTrigger value="export" className="text-xs">
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="mt-3">
          <div className="h-[400px]">
            <CMSAgentChatContent
              selectedNode={selected}
              includeChildren={includeChildren}
              onIncludeChildrenChange={setIncludeChildren}
              onSend={handleContextAwareChat}
            />
          </div>
        </TabsContent>

        <TabsContent value="design" className="mt-3">
          {selected && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                {getWidgetCategory(selected.data.componentType || selected.data.type)} ·{" "}
                {selected.data.componentType || selected.data.type}
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPinned(!pinned)}
                className={cn(pinned ? "bg-gray-100" : "")}
              >
                {pinned ? "Pinned" : "Pin"}
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-rose-600 hover:bg-rose-50 bg-transparent"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="export" className="mt-3">
          <div className="text-xs text-gray-500">Export functionality coming soon...</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
