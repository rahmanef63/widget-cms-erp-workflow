export const PROVIDER_CONFIG = {
  idPrefix: "openai",
  label: "OpenAI",
  envVar: "OPENAI_API_KEY",
  apiKeyHeader: "X-Api-Key",
  modelNameHeader: "X-Model-Name",
  docs: "https://sdk.vercel.ai", // AI SDK OpenAI provider
  defaults: {
    models: ["gpt-4o", "gpt-4o-mini"],
  },
} as const
