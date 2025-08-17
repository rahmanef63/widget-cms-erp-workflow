"use client"

import { useMemo } from "react"
import { loadChatSettings, saveChatSettings, setAgentConfig, getAgentConfig } from "@/shared/settings/chat"
import type { ModelOption } from "@/features/agent/types"

export function useAgentSettings(models: ModelOption[]) {
  const settings = loadChatSettings()
  const effectiveModels = useMemo(
    () =>
      (models.length ? models : [{ id: "xai:grok-3", label: "Grok-3 (default)", available: true }]).map((m) => ({
        ...m,
        available: m.available || Boolean(getAgentConfig(settings, m.id)?.apiKey),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(models), JSON.stringify(settings)],
  )

  function pickModel(id: string) {
    const next = { ...settings, selectedModelId: id }
    saveChatSettings(next)
  }
  function updateAgentConfig(modelId: string, cfg: { modelName?: string; apiKey?: string }) {
    const next = { ...settings }
    setAgentConfig(next, modelId, cfg)
    saveChatSettings(next)
  }

  return { settings, effectiveModels, pickModel, updateAgentConfig }
}
