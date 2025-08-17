export const PROVIDER_CONFIG = {
  idPrefix: "google",
  label: "Google",
  envVar: "GOOGLE_GENERATIVE_AI_API_KEY",
  apiKeyHeader: "X-Api-Key",
  modelNameHeader: "X-Model-Name",
  docs: "https://sdk.vercel.ai", // AI SDK Google provider
  defaults: {
    models: ["gemini-1.5-pro", "gemini-1.5-flash"],
  },
} as const
