"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, AlertCircle } from "lucide-react"

interface Model {
  id: string
  label: string
  available: boolean
}

interface ModelSelectorProps {
  modelId: string
  models: Model[]
  onPickModel: (modelId: string) => void
  onOpenConfig: () => void
}

export function ModelSelector({ modelId, models, onPickModel, onOpenConfig }: ModelSelectorProps) {
  const selectedModel = models.find((m) => m.id === modelId)
  const isModelAvailable = selectedModel?.available ?? false

  return (
    <div className="space-y-4">
      {/* Model Selection */}
      <div className="flex items-center gap-2">
        <Select value={modelId} onValueChange={onPickModel}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex items-center gap-2">
                  <span>{model.label}</span>
                  {model.available ? (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Config Needed
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={onOpenConfig}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Model Status Alert */}
      {!isModelAvailable && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Model configuration required. Click the settings button to configure.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
