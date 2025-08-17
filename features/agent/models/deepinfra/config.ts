export const PROVIDER_CONFIG = {
  idPrefix: "deepinfra",
  label: "DeepInfra",
  envVar: "DEEPINFRA_API_KEY",
  apiKeyHeader: "X-Api-Key",
  modelNameHeader: "X-Model-Name",
  docs: "https://sdk.vercel.ai",
  defaults: {
    models: ["meta-llama/Meta-Llama-3-70B-Instruct"],
  },
} as const
