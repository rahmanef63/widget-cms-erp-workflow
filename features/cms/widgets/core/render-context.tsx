import React, { createContext, useContext, ReactNode } from 'react'

export type RenderProfile = 'semantic' | 'shadcn'

interface RenderContextValue {
  profile: RenderProfile
  setProfile: (profile: RenderProfile) => void
}

const RenderContext = createContext<RenderContextValue | undefined>(undefined)

export interface RenderProviderProps {
  profile: RenderProfile
  children: ReactNode
}

/**
 * Provider for render profile context
 * Allows switching between semantic HTML and ShadCN styled rendering
 */
export function RenderProvider({ profile: initialProfile, children }: RenderProviderProps) {
  const [profile, setProfile] = React.useState<RenderProfile>(initialProfile)

  const value = React.useMemo(() => ({
    profile,
    setProfile
  }), [profile])

  return (
    <RenderContext.Provider value={value}>
      {children}
    </RenderContext.Provider>
  )
}

/**
 * Hook to access current render profile
 */
export function useRenderProfile(): RenderProfile {
  const context = useContext(RenderContext)
  if (context === undefined) {
    // Default to semantic if no provider
    return 'semantic'
  }
  return context.profile
}

/**
 * Hook to access render profile controls
 */
export function useRenderProfileControls(): RenderContextValue {
  const context = useContext(RenderContext)
  if (context === undefined) {
    throw new Error('useRenderProfileControls must be used within a RenderProvider')
  }
  return context
}

export default RenderContext
