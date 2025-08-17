// Main agent exports
export * from "./lib/agent-runner"
export * from "./lib/model-registry" 
export * from "./lib/fallback-generator"
export * from "./types"
export * from "./tools"

// Component exports
export { AgentChatPanel } from "./components/agent-chat-panel"

// Legacy compatibility
export { runAgent } from "./lib/agent-runner"
export { generateFallbackSchema as fallbackHeuristic } from "./lib/fallback-generator"
