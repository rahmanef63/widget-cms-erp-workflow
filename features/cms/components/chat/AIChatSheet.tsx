"use client"
import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import type React from "react"

import { AgentChatPanel } from "@/features/agent/components/agent-chat-panel"
import type { MenuGroup } from "@/features/agent/types"

export interface CMSAIChatSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  // Chat state
  modelId: string
  effectiveModels: any[]
  onPickModel: (modelId: string) => void
  onOpenConfig: () => void
  chatMessages: any[]
  aiTyping: boolean
  sending: boolean
  chatInput: string
  onChangeInput: (input: string) => void
  onSend: () => void
  attachments: any[]
  onRemoveAttachment: (idx: number) => void
  onFilePicked: (e: React.ChangeEvent<HTMLInputElement>) => void

  // Controls
  onRetryPreferTool: () => void
  onAskFollowups: () => void
  onEndInterview: () => void
  interviewActive: boolean
  autoGenerate: boolean
  onToggleAutoGenerate: (value: boolean) => void

  // Tools and menu
  tools: any
  menuGroups: MenuGroup[]
  presetPrompts: string[]
}

export function CMSAIChatSheet({
  open,
  onOpenChange,
  modelId,
  effectiveModels,
  onPickModel,
  onOpenConfig,
  chatMessages,
  aiTyping,
  sending,
  chatInput,
  onChangeInput,
  onSend,
  attachments,
  onRemoveAttachment,
  onFilePicked,
  onRetryPreferTool,
  onAskFollowups,
  onEndInterview,
  interviewActive,
  autoGenerate,
  onToggleAutoGenerate,
  tools,
  menuGroups,
  presetPrompts,
}: CMSAIChatSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>CMS AI Assistant</SheetTitle>
          <SheetDescription>
            Chat to generate and modify CMS components. Context-aware assistance for your selected components.
          </SheetDescription>
        </SheetHeader>
        <AgentChatPanel
          modelId={modelId}
          models={effectiveModels}
          onPickModel={onPickModel}
          onOpenConfig={onOpenConfig}
          prompts={presetPrompts}
          tools={tools}
          menuGroups={menuGroups}
          messages={chatMessages}
          aiTyping={aiTyping}
          sending={sending}
          input={chatInput}
          onChangeInput={onChangeInput}
          onSend={onSend}
          attachments={attachments}
          onRemoveAttachment={onRemoveAttachment}
          onFilePicked={onFilePicked}
          controls={{
            onRetryPreferTool,
            onAskFollowups,
            onEndInterview,
            interviewActive,
            autoGenerate,
            onToggleAutoGenerate,
          }}
        />
        <SheetFooter>
          <div className="text-xs text-muted-foreground">
            CMS-specific AI assistant with component context awareness
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// Legacy compatibility
export const AIChatSheet = CMSAIChatSheet
