"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
export type JsonDialogMode = "import" | "export" | "widget"

interface UnifiedJsonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: JsonDialogMode
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string, mode: JsonDialogMode) => void
  readonly?: boolean
}

export function UnifiedJsonDialog({
  open,
  onOpenChange,
  mode,
  value,
  onChange,
  onSubmit,
  readonly = false,
}: UnifiedJsonDialogProps) {
  const titles = {
    import: "Import Schema",
    export: "Export Widget",
    widget: "Add Widget from JSON",
  }

  const descriptions = {
    import: "Paste a JSON schema to replace the current canvas content.",
    export: "Copy this widget JSON to use in other projects.",
    widget: "Paste a widget JSON to add it to the current canvas.",
  }

  const handleSubmit = () => {
    onSubmit(value, mode)
    if (mode !== "export") {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {titles[mode]}
            <Badge variant="outline">{mode}</Badge>
          </DialogTitle>
          <DialogDescription>{descriptions[mode]}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[56vh] pr-2">
          <div className="space-y-2">
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={readonly ? "" : "Paste JSON here..."}
            className="min-h-[300px] font-mono text-sm"
            readOnly={readonly}
          />
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {mode === "export" ? (
            <Button onClick={handleSubmit}>Copy to Clipboard</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!value?.trim()}>
              {mode === "import" ? "Import" : "Add Widget"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
