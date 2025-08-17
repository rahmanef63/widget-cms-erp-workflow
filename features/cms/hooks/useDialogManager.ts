"use client"
import { useState, useCallback } from "react"
import type { CMSSchema } from "@/shared/types/schema"

type JsonDialogMode = "import" | "export" | "widget"

export function useDialogManager() {
  // JSON dialog state
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false)
  const [jsonDialogMode, setJsonDialogMode] = useState<JsonDialogMode>("import")
  const [jsonDialogValue, setJsonDialogValue] = useState("")

  // Two ways dialog state
  const [twoWaysOpen, setTwoWaysOpen] = useState(false)
  const [twoBusy, setTwoBusy] = useState(false)
  const [twoA, setTwoA] = useState<CMSSchema | null>(null)
  const [twoB, setTwoB] = useState<CMSSchema | null>(null)

  // Configuration dialog state
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [configValues, setConfigValues] = useState<Record<string, any>>({})

  // Generic dialog state for extensibility
  const [customDialogs, setCustomDialogs] = useState<Map<string, { open: boolean; data?: any }>>(new Map())

  // JSON dialog operations
  const openImportDialog = useCallback(() => {
    setJsonDialogMode("import")
    setJsonDialogValue("")
    setJsonDialogOpen(true)
  }, [])

  const openWidgetDialog = useCallback(() => {
    setJsonDialogMode("widget")
    setJsonDialogValue("")
    setJsonDialogOpen(true)
  }, [])

  const openExportDialog = useCallback((value: string) => {
    setJsonDialogMode("export")
    setJsonDialogValue(value)
    setJsonDialogOpen(true)
  }, [])

  const closeJsonDialog = useCallback(() => {
    setJsonDialogOpen(false)
    setJsonDialogValue("")
  }, [])

  // Two ways dialog operations
  const openTwoWaysDialog = useCallback((schemaA?: CMSSchema, schemaB?: CMSSchema) => {
    setTwoA(schemaA || null)
    setTwoB(schemaB || null)
    setTwoBusy(false)
    setTwoWaysOpen(true)
  }, [])

  const closeTwoWaysDialog = useCallback(() => {
    setTwoWaysOpen(false)
    setTwoA(null)
    setTwoB(null)
    setTwoBusy(false)
  }, [])

  const setTwoWaysBusy = useCallback((busy: boolean) => {
    setTwoBusy(busy)
  }, [])

  // Configuration dialog operations
  const openConfigDialog = useCallback((initialValues: Record<string, any> = {}) => {
    setConfigValues(initialValues)
    setConfigDialogOpen(true)
  }, [])

  const closeConfigDialog = useCallback(() => {
    setConfigDialogOpen(false)
    setConfigValues({})
  }, [])

  const updateConfigValue = useCallback((key: string, value: any) => {
    setConfigValues(prev => ({ ...prev, [key]: value }))
  }, [])

  // Custom dialog operations for extensibility
  const openCustomDialog = useCallback((id: string, data?: any) => {
    setCustomDialogs(prev => new Map(prev).set(id, { open: true, data }))
  }, [])

  const closeCustomDialog = useCallback((id: string) => {
    setCustomDialogs(prev => {
      const next = new Map(prev)
      const current = next.get(id)
      if (current) {
        next.set(id, { ...current, open: false })
      }
      return next
    })
  }, [])

  const updateCustomDialogData = useCallback((id: string, data: any) => {
    setCustomDialogs(prev => {
      const next = new Map(prev)
      const current = next.get(id)
      if (current) {
        next.set(id, { ...current, data })
      }
      return next
    })
  }, [])

  const getCustomDialog = useCallback((id: string) => {
    return customDialogs.get(id) || { open: false, data: undefined }
  }, [customDialogs])

  // Bulk operations
  const closeAllDialogs = useCallback(() => {
    setJsonDialogOpen(false)
    setTwoWaysOpen(false)
    setConfigDialogOpen(false)
    setCustomDialogs(prev => {
      const next = new Map()
      prev.forEach((value, key) => {
        next.set(key, { ...value, open: false })
      })
      return next
    })
  }, [])

  const hasOpenDialogs = useCallback(() => {
    if (jsonDialogOpen || twoWaysOpen || configDialogOpen) return true
    return Array.from(customDialogs.values()).some(dialog => dialog.open)
  }, [jsonDialogOpen, twoWaysOpen, configDialogOpen, customDialogs])

  return {
    // JSON dialog
    jsonDialogOpen,
    setJsonDialogOpen,
    jsonDialogMode,
    setJsonDialogMode,
    jsonDialogValue,
    setJsonDialogValue,
    openImportDialog,
    openWidgetDialog,
    openExportDialog,
    closeJsonDialog,

    // Two ways dialog
    twoWaysOpen,
    setTwoWaysOpen,
    twoBusy,
    setTwoBusy,
    twoA,
    setTwoA,
    twoB,
    setTwoB,
    openTwoWaysDialog,
    closeTwoWaysDialog,
    setTwoWaysBusy,

    // Configuration dialog
    configDialogOpen,
    setConfigDialogOpen,
    configValues,
    setConfigValues,
    openConfigDialog,
    closeConfigDialog,
    updateConfigValue,

    // Custom dialogs
    customDialogs,
    openCustomDialog,
    closeCustomDialog,
    updateCustomDialogData,
    getCustomDialog,

    // Bulk operations
    closeAllDialogs,
    hasOpenDialogs,
  }
}
