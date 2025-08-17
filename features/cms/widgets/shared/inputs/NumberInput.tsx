"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface NumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  className?: string
}

export function NumberInput({ label, value, onChange, min, max, step = 1, unit, className }: NumberInputProps) {
  return (
    <div className={className}>
      <Label className="text-xs font-medium text-gray-700 mb-2 block">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="h-8 text-xs pr-8"
        />
        {unit && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
