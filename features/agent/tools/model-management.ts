export interface ModelConfig {
  id: string
  label: string
  available: boolean
  apiKey?: string
  modelName?: string
}

export class ModelManager {
  static validateModel(modelId: string, config: ModelConfig): boolean {
    return config.available || Boolean(config.apiKey)
  }

  static getEffectiveModels(models: ModelConfig[], settings: any): ModelConfig[] {
    return models.map((m) => ({
      ...m,
      available: m.available || Boolean(settings.agents?.[m.id]?.apiKey),
    }))
  }

  static getDefaultModel(): ModelConfig {
    return { id: "xai:grok-3", label: "Grok-3 (default)", available: true }
  }
}
