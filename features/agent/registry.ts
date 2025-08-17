import { xai, createXai } from "@ai-sdk/xai"
import { groq, createGroq } from "@ai-sdk/groq"
import { deepinfra, createDeepInfra } from "@ai-sdk/deepinfra"
import { openai, createOpenAI } from "@ai-sdk/openai"
import { anthropic, createAnthropic } from "@ai-sdk/anthropic"
import { google, createGoogleGenerativeAI } from "@ai-sdk/google"

import { XAI_MODELS, type XaiIds } from "./models/xai"
import { GROQ_MODELS, type GroqIds } from "./models/groq"
import { DEEPINFRA_MODELS, type DeepInfraIds } from "./models/deepinfra"
import { OPENAI_MODELS, type OpenAIIds } from "./models/openai"
import { ANTHROPIC_MODELS, type AnthropicIds } from "./models/anthropic"
import { GOOGLE_MODELS, type GoogleIds } from "./models/google"

export type ModelId = XaiIds | GroqIds | DeepInfraIds | OpenAIIds | AnthropicIds | GoogleIds

export type ModelInfo = {
  id: ModelId
  label: string
  provider: "xai" | "groq" | "deepinfra" | "openai" | "anthropic" | "google"
  model: string
  envVar: string
}

export const MODEL_REGISTRY: ModelInfo[] = [
  { id: "xai:grok-3", label: "Grok-3", provider: "xai", model: XAI_MODELS.default, envVar: "XAI_API_KEY" },
  { id: "xai:grok-3-mini", label: "Grok-3 Mini", provider: "xai", model: XAI_MODELS.mini, envVar: "XAI_API_KEY" },

  {
    id: "groq:llama-3.1-70b",
    label: "Llama 3.1 70B (Groq)",
    provider: "groq",
    model: GROQ_MODELS.llama70b,
    envVar: "GROQ_API_KEY",
  },
  {
    id: "groq:llama-3.1-8b",
    label: "Llama 3.1 8B (Groq)",
    provider: "groq",
    model: GROQ_MODELS.llama8b,
    envVar: "GROQ_API_KEY",
  },
  {
    id: "groq:gpt-oss-120b",
    label: "OpenAI GPT-OSS 120B (Groq)",
    provider: "groq",
    model: GROQ_MODELS.gptOss120b,
    envVar: "GROQ_API_KEY",
  },

  {
    id: "deepinfra:meta-llama-3-70b-instruct",
    label: "Llama 3 70B (DeepInfra)",
    provider: "deepinfra",
    model: DEEPINFRA_MODELS.llama3_70b_instruct,
    envVar: "DEEPINFRA_API_KEY",
  },

  {
    id: "openai:gpt-4o",
    label: "GPT-4o (OpenAI)",
    provider: "openai",
    model: OPENAI_MODELS.gpt4o,
    envVar: "OPENAI_API_KEY",
  },
  {
    id: "openai:gpt-4o-mini",
    label: "GPT-4o mini (OpenAI)",
    provider: "openai",
    model: OPENAI_MODELS.gpt4oMini,
    envVar: "OPENAI_API_KEY",
  },

  {
    id: "anthropic:claude-3-5-sonnet",
    label: "Claude 3.5 Sonnet",
    provider: "anthropic",
    model: ANTHROPIC_MODELS.claudeSonnet,
    envVar: "ANTHROPIC_API_KEY",
  },
  {
    id: "anthropic:claude-3-5-haiku",
    label: "Claude 3.5 Haiku",
    provider: "anthropic",
    model: ANTHROPIC_MODELS.claudeHaiku,
    envVar: "ANTHROPIC_API_KEY",
  },

  {
    id: "google:gemini-1.5-pro",
    label: "Gemini 1.5 Pro",
    provider: "google",
    model: GOOGLE_MODELS.gemini15Pro,
    envVar: "GOOGLE_GENERATIVE_AI_API_KEY",
  },
  {
    id: "google:gemini-1.5-flash",
    label: "Gemini 1.5 Flash",
    provider: "google",
    model: GOOGLE_MODELS.gemini15Flash,
    envVar: "GOOGLE_GENERATIVE_AI_API_KEY",
  },
]

export const DEFAULT_MODEL_ID: ModelId = "xai:grok-3"

export type OverrideConfig = { modelName?: string; apiKey?: string }

export function getModelFromId(id: ModelId) {
  const info = MODEL_REGISTRY.find((m) => m.id === id) || MODEL_REGISTRY[0]
  switch (info.provider) {
    case "xai":
      return xai(info.model)
    case "groq":
      return groq(info.model)
    case "deepinfra":
      return deepinfra(info.model)
    case "openai":
      return openai(info.model)
    case "anthropic":
      return anthropic(info.model)
    case "google":
      return google(info.model)
    default:
      return xai(XAI_MODELS.default)
  }
}

// Dynamic override: if apiKey/modelName provided, create a provider instance with that apiKey. [^1]
export function getModelFromIdWithOverride(id: ModelId, override?: OverrideConfig) {
  const info = MODEL_REGISTRY.find((m) => m.id === id) || MODEL_REGISTRY[0]
  const modelName = override?.modelName || info.model
  const key = override?.apiKey

  switch (info.provider) {
    case "xai":
      return key ? createXai({ apiKey: key })(modelName) : xai(modelName)
    case "groq":
      return key ? createGroq({ apiKey: key })(modelName) : groq(modelName)
    case "deepinfra":
      return key ? createDeepInfra({ apiKey: key })(modelName) : deepinfra(modelName)
    case "openai":
      return key ? createOpenAI({ apiKey: key })(modelName) : openai(modelName)
    case "anthropic":
      return key ? createAnthropic({ apiKey: key })(modelName) : anthropic(modelName)
    case "google":
      return key ? createGoogleGenerativeAI({ apiKey: key })(modelName) : google(modelName)
    default:
      return xai(modelName)
  }
}

export function isModelAvailable(id: ModelId) {
  const info = MODEL_REGISTRY.find((m) => m.id === id)
  if (!info) return false
  if (typeof process === "undefined" || !process.env) return true
  return Boolean(process.env[info.envVar as keyof NodeJS.ProcessEnv])
}

export function listModels() {
  return MODEL_REGISTRY.map((m) => ({
    id: m.id,
    label: m.label,
    provider: m.provider,
    available: isModelAvailable(m.id),
  }))
}
