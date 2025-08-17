export const PROVIDER_CONFIG = {
  idPrefix: "anthropic",
  label: "Anthropic",
  envVar: "ANTHROPIC_API_KEY",
  apiKeyHeader: "X-Api-Key",
  modelNameHeader: "X-Model-Name",
  docs: "https://sdk.vercel.ai", // AI SDK Anthropic provider
  defaults: {
    models: ["claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"],
  },
} as const
