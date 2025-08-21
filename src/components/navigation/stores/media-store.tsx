"use client";

import React, { createContext, useContext } from 'react';
import { useScreenSizeSync, useUserPreferencesSync } from '../hooks/use-media-sync';

interface MediaState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  prefersReducedMotion: boolean;
  prefersReducedTransparency: boolean;
  prefersDarkScheme: boolean;
}

const MediaContext = createContext<MediaState | undefined>(undefined);

interface MediaProviderProps {
  children: React.ReactNode;
}

/**
 * Dedicated provider for media queries and user preferences
 * Uses useSyncExternalStore for proper SSR handling
 */
export function MediaProvider({ children }: MediaProviderProps) {
  const screenData = useScreenSizeSync();
  const userPrefs = useUserPreferencesSync();

  const state: MediaState = {
    ...screenData,
    ...userPrefs,
  };

  return (
    <MediaContext.Provider value={state}>
      {children}
    </MediaContext.Provider>
  );
}

/**
 * Hook to access media query state
 */
export function useMediaStore(): MediaState {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMediaStore must be used within a MediaProvider');
  }
  return context;
}

/**
 * Convenience hooks for specific media queries
 */
export function useIsMobileDevice() {
  return useMediaStore().isMobile;
}

export function useIsTabletDevice() {
  return useMediaStore().isTablet;
}

export function useIsDesktopDevice() {
  return useMediaStore().isDesktop;
}

export function useCurrentScreenSize() {
  return useMediaStore().screenSize;
}

export function useMotionPreference() {
  const { prefersReducedMotion } = useMediaStore();
  return {
    prefersReducedMotion,
    shouldAnimate: !prefersReducedMotion,
  };
}

export function useTransparencyPreference() {
  const { prefersReducedTransparency } = useMediaStore();
  return {
    prefersReducedTransparency,
    shouldUseBackdrop: !prefersReducedTransparency,
  };
}