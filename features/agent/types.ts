export type ChatRole = "user" | "assistant"

export type ChatMsg = {
  role: ChatRole
  content: string
  profile?: string
}

export type Attachment = {
  name: string
  type: string
  size: number
}

export type ModelOption = { id: string; label: string; available: boolean }

// Generic tools API you can wire from any page.
export type ToolsApi = {
  // Common canvas/page actions:
  applyJsonFromChat?: () => void
  openImportJson?: () => void
  openWidgetDialog?: () => void
  exportSchema?: () => void
  exportSingleFile?: () => void
  exportEachRootAsFile?: () => void
  exportStandaloneHTML?: () => void
  refreshPreview?: () => void
  shareLink?: () => void
}

// Chat controls for the generic panel
export type AgentChatControls = {
  onRetryPreferTool?: () => void
  onAskFollowups?: () => void
  onEndInterview?: () => void
  interviewActive?: boolean
  autoGenerate?: boolean
  onToggleAutoGenerate?: (v: boolean) => void
}

export interface MenuGroup {
  label: string
  items: Array<{
    label: string
    onClick: () => void
  }>
}
