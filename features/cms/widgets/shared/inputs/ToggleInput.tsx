"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ToggleInputProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
  className?: string
}

export function ToggleInput({ label, value, onChange, className }: ToggleInputProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <Label className="text-xs font-medium text-gray-700">{label}</Label>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  )
}
