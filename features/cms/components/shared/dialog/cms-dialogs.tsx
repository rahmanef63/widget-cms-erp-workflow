"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UnifiedJsonDialog, type JsonDialogMode } from "./dialog-unified-json"
import { TwoWaysDialog } from "./dialog-two-ways"
import type { CMSSchema } from "@/shared/types/schema"

interface CMSDialogsProps {
  // JSON Dialog
  jsonDialogOpen: boolean
  setJsonDialogOpen: (open: boolean) => void
  jsonDialogMode: JsonDialogMode
  jsonDialogValue: string
  setJsonDialogValue: (value: string) => void
  onJsonSubmit: (value: string, mode: JsonDialogMode) => void

  // Two Ways Dialog
  twoWaysOpen: boolean
  setTwoWaysOpen: (open: boolean) => void
  twoBusy: boolean
  twoA: CMSSchema | null
  twoB: CMSSchema | null
  onUseVariant: (which: "A" | "B") => void

  // Inline Config Dialog
  inlineConfigOpen: boolean
  setInlineConfigOpen: (open: boolean) => void
  cfgModelName: string
  setCfgModelName: (name: string) => void
  cfgApiKey: string
  setCfgApiKey: (key: string) => void
  onPersistConfig: () => void
}

export function CMSDialogs({
  jsonDialogOpen,
  setJsonDialogOpen,
  jsonDialogMode,
  jsonDialogValue,
  setJsonDialogValue,
  onJsonSubmit,
  twoWaysOpen,
  setTwoWaysOpen,
  twoBusy,
  twoA,
  twoB,
  onUseVariant,
  inlineConfigOpen,
  setInlineConfigOpen,
  cfgModelName,
  setCfgModelName,
  cfgApiKey,
  setCfgApiKey,
  onPersistConfig,
}: CMSDialogsProps) {
  return (
    <>
      <UnifiedJsonDialog
        open={jsonDialogOpen}
        onOpenChange={setJsonDialogOpen}
        mode={jsonDialogMode}
        value={jsonDialogValue}
        onChange={setJsonDialogValue}
        onSubmit={onJsonSubmit}
        readonly={jsonDialogMode === "export"}
      />

      <TwoWaysDialog
        open={twoWaysOpen}
        onOpenChange={setTwoWaysOpen}
        busy={twoBusy}
        variantA={twoA}
        variantB={twoB}
        onUseVariant={onUseVariant}
      />

      <Dialog open={inlineConfigOpen} onOpenChange={setInlineConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Model</DialogTitle>
            <DialogDescription>Set a custom model name or API key for this provider.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Model Name</label>
              <Input
                value={cfgModelName}
                onChange={(e) => setCfgModelName(e.target.value)}
                placeholder="e.g., grok-3"
              />
            </div>
            <div>
              <label className="text-sm font-medium">API Key</label>
              <Input
                type="password"
                value={cfgApiKey}
                onChange={(e) => setCfgApiKey(e.target.value)}
                placeholder="Paste API key..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInlineConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onPersistConfig}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
