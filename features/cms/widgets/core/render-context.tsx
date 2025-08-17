"use client"

import React from "react"
import type { RenderProfile } from "./unified-widget-system"

const RenderContext = React.createContext<RenderProfile>("semantic")

export const useRenderProfile = () => React.useContext(RenderContext)

export function RenderProvider({
  profile,
  children,
}: {
  profile: RenderProfile
  children: React.ReactNode
}) {
  return <RenderContext.Provider value={profile}>{children}</RenderContext.Provider>
}
