"use client"
import { useState, useCallback } from "react"
import type { CMSSchema } from "@/shared/types/schema"
import type { JsonDialogMode } from "../components/shared/dialog/dialog-unified-json"

export function useDialogState() {
  // JSON dialog
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false)
  const [jsonDialogMode, setJsonDialogMode] = useState<JsonDialogMode>("import")
  const [jsonDialogValue, setJsonDialogValue] = useState("")

  // Two ways dialog
  const [twoWaysOpen, setTwoWaysOpen] = useState(false)
  const [twoBusy, setTwoBusy] = useState(false)
  const [twoA, setTwoA] = useState<CMSSchema | null>(null)
  const [twoB, setTwoB] = useState<CMSSchema | null>(null)

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

    // Two ways dialog
    twoWaysOpen,
    setTwoWaysOpen,
    twoBusy,
    setTwoBusy,
    twoA,
    setTwoA,
    twoB,
    setTwoB,
  }
}
