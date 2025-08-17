export const PROVIDER_CONFIG = {
  idPrefix: "xai",
  label: "xAI",
  envVar: "XAI_API_KEY",
  apiKeyHeader: "X-Api-Key",
  modelNameHeader: "X-Model-Name",
  docs: "https://sdk.vercel.ai", // AI SDK consolidates provider usage
  defaults: {
    models: ["grok-3", "grok-3-mini"],
  },
} as const
