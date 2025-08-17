"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { CMSSchema } from "@/shared/types/schema"

interface TwoWaysDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  busy: boolean
  variantA: CMSSchema | null
  variantB: CMSSchema | null
  onUseVariant: (which: "A" | "B") => void
}

export function TwoWaysDialog({ open, onOpenChange, busy, variantA, variantB, onUseVariant }: TwoWaysDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose Your Preferred Layout</DialogTitle>
          <DialogDescription>Two different interpretations of your request. Pick the one you prefer.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Variant A</CardTitle>
            </CardHeader>
            <CardContent>
              {busy && !variantA ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : variantA ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">Centered hero layout with single-column content</p>
                  <Button onClick={() => onUseVariant("A")} className="w-full">
                    Use This Layout
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">Failed to generate</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Variant B</CardTitle>
            </CardHeader>
            <CardContent>
              {busy && !variantB ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : variantB ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">Two-column layout with sidebar profile card</p>
                  <Button onClick={() => onUseVariant("B")} className="w-full">
                    Use This Layout
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">Failed to generate</div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
