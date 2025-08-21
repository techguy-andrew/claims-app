"use client";

import { useSyncExternalStore, useMemo } from 'react';

// Cached server snapshot function to prevent infinite loops
const getServerSnapshotFalse = () => false;

/**
 * Create a media query store that works properly with SSR
 * Uses useSyncExternalStore for React 18 compatibility
 */
function createMediaStore(query: string) {
  const listeners: Set<() => void> = new Set();
  let mediaQuery: MediaQueryList | null = null;
  let currentSnapshot = false;
  
  const subscribe = (callback: () => void) => {
    // Initialize mediaQuery on first subscription (client-side only)
    if (typeof window !== 'undefined' && !mediaQuery) {
      mediaQuery = window.matchMedia(query);
      currentSnapshot = mediaQuery.matches;
      
      const handler = () => {
        const newValue = mediaQuery!.matches;
        if (newValue !== currentSnapshot) {
          currentSnapshot = newValue;
          listeners.forEach(listener => listener());
        }
      };
      mediaQuery.addEventListener('change', handler);
    }
    
    listeners.add(callback);
    
    return () => {
      listeners.delete(callback);
    };
  };
  
  const getSnapshot = () => {
    return currentSnapshot;
  };
  
  return { subscribe, getSnapshot, getServerSnapshot: getServerSnapshotFalse };
}

// Create stores for common breakpoints (outside component scope)
const mobileStore = createMediaStore('(max-width: 767.98px)');
const tabletStore = createMediaStore('(min-width: 768px) and (max-width: 1023.98px)');
const desktopStore = createMediaStore('(min-width: 1024px)');
const reducedMotionStore = createMediaStore('(prefers-reduced-motion: reduce)');
const reducedTransparencyStore = createMediaStore('(prefers-reduced-transparency: reduce)');
const darkSchemeStore = createMediaStore('(prefers-color-scheme: dark)');

/**
 * SSR-safe media query hooks using useSyncExternalStore
 */
export function useIsMobileSync() {
  return useSyncExternalStore(
    mobileStore.subscribe,
    mobileStore.getSnapshot,
    mobileStore.getServerSnapshot
  );
}

export function useIsTabletSync() {
  return useSyncExternalStore(
    tabletStore.subscribe,
    tabletStore.getSnapshot,
    tabletStore.getServerSnapshot
  );
}

export function useIsDesktopSync() {
  return useSyncExternalStore(
    desktopStore.subscribe,
    desktopStore.getSnapshot,
    desktopStore.getServerSnapshot
  );
}

export function usePrefersReducedMotionSync() {
  return useSyncExternalStore(
    reducedMotionStore.subscribe,
    reducedMotionStore.getSnapshot,
    reducedMotionStore.getServerSnapshot
  );
}

export function usePrefersReducedTransparencySync() {
  return useSyncExternalStore(
    reducedTransparencyStore.subscribe,
    reducedTransparencyStore.getSnapshot,
    reducedTransparencyStore.getServerSnapshot
  );
}

export function usePrefersDarkSchemeSync() {
  return useSyncExternalStore(
    darkSchemeStore.subscribe,
    darkSchemeStore.getSnapshot,
    darkSchemeStore.getServerSnapshot
  );
}

// Cached stable objects to prevent recreation
const stableDesktopSize = { isMobile: false, isTablet: false, isDesktop: true, screenSize: 'desktop' } as const;
const stableTabletSize = { isMobile: false, isTablet: true, isDesktop: false, screenSize: 'tablet' } as const;
const stableMobileSize = { isMobile: true, isTablet: false, isDesktop: false, screenSize: 'mobile' } as const;

const stableDefaultPrefs = { prefersReducedMotion: false, prefersReducedTransparency: false, prefersDarkScheme: false };

/**
 * Combined hooks for convenience with stable references
 */
export function useScreenSizeSync() {
  const isMobile = useIsMobileSync();
  const isTablet = useIsTabletSync();

  return useMemo(() => {
    if (isMobile) return stableMobileSize;
    if (isTablet) return stableTabletSize;
    return stableDesktopSize;
  }, [isMobile, isTablet]);
}

export function useUserPreferencesSync() {
  const prefersReducedMotion = usePrefersReducedMotionSync();
  const prefersReducedTransparency = usePrefersReducedTransparencySync();
  const prefersDarkScheme = usePrefersDarkSchemeSync();

  return useMemo(() => {
    // If all preferences are false, return stable default object
    if (!prefersReducedMotion && !prefersReducedTransparency && !prefersDarkScheme) {
      return stableDefaultPrefs;
    }
    
    // Otherwise create new object
    return {
      prefersReducedMotion,
      prefersReducedTransparency,
      prefersDarkScheme,
    };
  }, [prefersReducedMotion, prefersReducedTransparency, prefersDarkScheme]);
}