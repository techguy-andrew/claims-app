import { useEffect, useLayoutEffect } from 'react'

// ============================================================================
// ISOMORPHIC LAYOUT EFFECT HOOK
// Fixes SSR warnings by using useEffect on server and useLayoutEffect on client
// ============================================================================

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect