import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import type { ChatMsg, Attachment, ModelOption } from "@/features/agent/types"

export interface CMSAgentContext {
  selectedNode?: Node<CompNodeData>
  includeChildren: boolean
  nodes: Node<CompNodeData>[]
  edges: any[]
}

export interface CMSChatState {
  // Chat state
  aiTyping: boolean
  chatOpen: boolean
  chatMessages: ChatMsg[]
  chatInput: string
  sending: boolean
  autoGenerate: boolean
  attachments: Attachment[]

  // Context-aware features
  includeChildren: boolean
  contextMode: "global" | "component"

  // Model settings
  settings: any
  modelId: string
  models: ModelOption[]
  effectiveModels: ModelOption[]
  inlineConfigOpen: boolean
  cfgModelName: string
  cfgApiKey: string

  // Interview mode
  interviewActive: boolean
  interviewQuestions: string[]
  currentQ: number
  qaPairs: Array<{ q: string; a: string }>

  // Two ways
  twoA: any
  twoB: any
}

export interface CMSAgentTools {
  applyJsonFromChat: () => void
  openImportJson: () => void
  openWidgetDialog: () => void
  exportSchema: () => void
  exportSingleFile: () => void
  exportEachRootAsFile: () => void
  exportStandaloneHTML: () => void
  refreshPreview: () => void
  shareLink: () => void
}

export interface CMSAgentHandlers {
  sendContextAwareChat: (context?: CMSAgentContext) => Promise<void>
  generateTwoWays: () => Promise<void>
  retryWithTools: () => Promise<void>
  askFollowups: () => Promise<void>
  endInterview: () => void
  applyJsonFromChat: () => void
}
