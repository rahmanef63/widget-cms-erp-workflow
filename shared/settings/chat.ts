// Client-side chat configuration store for model agents.
// Persisted in localStorage and used by the chat UI to send overrides.

export type AgentConfig = {
  id: string
  modelName?: string
  apiKey?: string
}

export type ChatSettings = {
  selectedModelId: string
  agents: Record<string, AgentConfig>
}

const STORAGE_KEY = "cms_ai_chat_settings"

export const DEFAULT_SELECTED = "xai:grok-3"

export function getDefaultChatSettings(): ChatSettings {
  return {
    selectedModelId: DEFAULT_SELECTED,
    agents: {
      [DEFAULT_SELECTED]: { id: DEFAULT_SELECTED, modelName: "grok-3" },
    },
  }
}

export function loadChatSettings(): ChatSettings {
  if (typeof window === "undefined") return getDefaultChatSettings()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultChatSettings()
    const parsed = JSON.parse(raw) as ChatSettings
    if (!parsed || typeof parsed !== "object") return getDefaultChatSettings()
    if (!parsed.selectedModelId) parsed.selectedModelId = DEFAULT_SELECTED
    if (!parsed.agents) parsed.agents = {}
    return parsed
  } catch {
    return getDefaultChatSettings()
  }
}

export function saveChatSettings(s: ChatSettings) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

export function getAgentConfig(s: ChatSettings, id: string): AgentConfig | undefined {
  return s.agents[id]
}

export function setAgentConfig(s: ChatSettings, id: string, cfg: Partial<AgentConfig>) {
  s.agents[id] = { id, ...(s.agents[id] || {}), ...cfg }
}
