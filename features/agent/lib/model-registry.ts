// Mock functions for when AI SDK packages are not available
const mockModel = () => null
const mockCreate = () => () => null

// AI SDK providers - will be loaded dynamically if available
let aiProviders: {
  xai?: any
  createXai?: any
  groq?: any
  createGroq?: any
  deepinfra?: any
  createDeepInfra?: any
  openai?: any
  createOpenAI?: any
  anthropic?: any
  createAnthropic?: any
  google?: any
  createGoogleGenerativeAI?: any
} = {}

import { XAI_MODELS, type XaiIds } from "../models/xai"
import { GROQ_MODELS, type GroqIds } from "../models/groq"
import { DEEPINFRA_MODELS, type DeepInfraIds } from "../models/deepinfra"
import { OPENAI_MODELS, type OpenAIIds } from "../models/openai"
import { ANTHROPIC_MODELS, type AnthropicIds } from "../models/anthropic"
import { GOOGLE_MODELS, type GoogleIds } from "../models/google"

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
  try {
    switch (info.provider) {
      case "xai":
        return aiProviders.xai ? aiProviders.xai(info.model) : null
      case "groq":
        return aiProviders.groq ? aiProviders.groq(info.model) : null
      case "deepinfra":
        return aiProviders.deepinfra ? aiProviders.deepinfra(info.model) : null
      case "openai":
        return aiProviders.openai ? aiProviders.openai(info.model) : null
      case "anthropic":
        return aiProviders.anthropic ? aiProviders.anthropic(info.model) : null
      case "google":
        return aiProviders.google ? aiProviders.google(info.model) : null
      default:
        return aiProviders.xai ? aiProviders.xai(XAI_MODELS.default) : null
    }
  } catch (error) {
    console.warn(`Failed to create model ${id}:`, error)
    return null
  }
}

// Dynamic override: if apiKey/modelName provided, create a provider instance with that apiKey.
export function getModelFromIdWithOverride(id: ModelId, override?: OverrideConfig) {
  const info = MODEL_REGISTRY.find((m) => m.id === id) || MODEL_REGISTRY[0]
  const modelName = override?.modelName || info.model
  const key = override?.apiKey

  try {
    switch (info.provider) {
      case "xai":
        return key && aiProviders.createXai ? aiProviders.createXai({ apiKey: key })(modelName) : aiProviders.xai ? aiProviders.xai(modelName) : null
      case "groq":
        return key && aiProviders.createGroq ? aiProviders.createGroq({ apiKey: key })(modelName) : aiProviders.groq ? aiProviders.groq(modelName) : null
      case "deepinfra":
        return key && aiProviders.createDeepInfra ? aiProviders.createDeepInfra({ apiKey: key })(modelName) : aiProviders.deepinfra ? aiProviders.deepinfra(modelName) : null
      case "openai":
        return key && aiProviders.createOpenAI ? aiProviders.createOpenAI({ apiKey: key })(modelName) : aiProviders.openai ? aiProviders.openai(modelName) : null
      case "anthropic":
        return key && aiProviders.createAnthropic ? aiProviders.createAnthropic({ apiKey: key })(modelName) : aiProviders.anthropic ? aiProviders.anthropic(modelName) : null
      case "google":
        return key && aiProviders.createGoogleGenerativeAI ? aiProviders.createGoogleGenerativeAI({ apiKey: key })(modelName) : aiProviders.google ? aiProviders.google(modelName) : null
      default:
        return aiProviders.xai ? aiProviders.xai(modelName) : null
    }
  } catch (error) {
    console.warn(`Failed to create model ${id} with override:`, error)
    return null
  }
}

export function isModelAvailable(id: ModelId) {
  const info = MODEL_REGISTRY.find((m) => m.id === id)
  if (!info) return false

  // Check if the AI SDK package is available
  const packageAvailable = (() => {
    switch (info.provider) {
      case "xai": return Boolean(aiProviders.xai)
      case "groq": return Boolean(aiProviders.groq)
      case "deepinfra": return Boolean(aiProviders.deepinfra)
      case "openai": return Boolean(aiProviders.openai)
      case "anthropic": return Boolean(aiProviders.anthropic)
      case "google": return Boolean(aiProviders.google)
      default: return false
    }
  })()

  // For now, return true to show models in the UI even if packages aren't installed
  // This allows users to see what models are available and configure them
  return true
}

export function listModels() {
  return MODEL_REGISTRY.map((m) => ({
    id: m.id,
    label: m.label,
    provider: m.provider,
    available: isModelAvailable(m.id),
  }))
}
