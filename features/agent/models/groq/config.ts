export const PROVIDER_CONFIG = {
  idPrefix: "groq",
  label: "Groq",
  envVar: "GROQ_API_KEY",
  apiKeyHeader: "X-Api-Key",
  modelNameHeader: "X-Model-Name",
  docs: "https://sdk.vercel.ai",
  defaults: {
    models: ["llama-3.1-70b-versatile", "llama-3.1-8b-instant", "openai/gpt-oss-120b"],
  },
} as const
