"use client"

import { Button } from "@/components/ui/button"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Italic,
  Underline,
  Strikethrough,
  MoreHorizontal,
} from "lucide-react"

interface AlignmentButtonsProps {
  value: string
  onChange: (value: string) => void
  type: "text" | "flex" | "decoration"
  className?: string
}

export function AlignmentButtons({ value, onChange, type, className }: AlignmentButtonsProps) {
  const getButtons = () => {
    switch (type) {
      case "text":
        return [
          { value: "left", icon: AlignLeft },
          { value: "center", icon: AlignCenter },
          { value: "right", icon: AlignRight },
          { value: "justify", icon: AlignJustify },
        ]
      case "flex":
        return [
          { value: "start", icon: ArrowLeft },
          { value: "center", icon: MoreHorizontal },
          { value: "end", icon: ArrowRight },
          { value: "between", icon: ArrowUp },
          { value: "around", icon: ArrowDown },
        ]
      case "decoration":
        return [
          { value: "italic", icon: Italic },
          { value: "underline", icon: Underline },
          { value: "strikethrough", icon: Strikethrough },
          { value: "none", icon: MoreHorizontal },
        ]
      default:
        return []
    }
  }

  const buttons = getButtons()

  return (
    <div className={`flex gap-1 ${className}`}>
      {buttons.map(({ value: buttonValue, icon: Icon }) => (
        <Button
          key={buttonValue}
          variant={value === buttonValue ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onChange(buttonValue)}
        >
          <Icon className="h-3 w-3" />
        </Button>
      ))}
    </div>
  )
}
