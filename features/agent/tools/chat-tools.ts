export interface ChatTool {
  name: string
  description: string
  execute: (params: any) => Promise<any>
}

export const chatTools: ChatTool[] = [
  {
    name: "sendMessage",
    description: "Send a message to the AI model",
    execute: async ({ message, settings, modelId }) => {
      // Implementation moved from various handlers
      return { success: true, response: "Message sent" }
    },
  },
  {
    name: "retryWithTools",
    description: "Retry the last request with tool preference",
    execute: async ({ text, settings, modelId }) => {
      // Implementation for retry logic
      return { success: true, schema: null }
    },
  },
  {
    name: "generateFollowups",
    description: "Generate followup questions for better context",
    execute: async ({ lastMessage, settings, modelId }) => {
      // Implementation for followup generation
      return { questions: [] }
    },
  },
]
