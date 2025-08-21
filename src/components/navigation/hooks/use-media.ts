"use client";

import { useEffect, useState, useMemo } from 'react';

/**
 * Hook to listen to CSS media queries from JavaScript
 * More reliable than window.innerWidth calculations
 */
export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    // Initialize with proper value on client side
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Update current value in case it changed since initialization
    setMatches(mediaQuery.matches);

    // Create stable event handler
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handler);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

/**
 * Predefined media query hooks for common breakpoints
 */
export function useIsMobile() {
  return useMedia('(max-width: 767.98px)');
}

export function useIsTablet() {
  return useMedia('(min-width: 768px) and (max-width: 1023.98px)');
}

export function useIsDesktop() {
  return useMedia('(min-width: 1024px)');
}

/**
 * Hook for user preference detection
 */
export function usePrefersReducedMotion() {
  return useMedia('(prefers-reduced-motion: reduce)');
}

export function usePrefersReducedTransparency() {
  return useMedia('(prefers-reduced-transparency: reduce)');
}

export function usePrefersDarkScheme() {
  return useMedia('(prefers-color-scheme: dark)');
}

/**
 * Hook that combines all screen size queries into a single object
 */
export function useScreenSize() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  return useMemo(() => ({
    isMobile,
    isTablet,
    isDesktop,
    // For backward compatibility
    screenSize: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  } as const), [isMobile, isTablet, isDesktop]);
}

/**
 * Hook for all user preferences
 */
export function useUserPreferences() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const prefersReducedTransparency = usePrefersReducedTransparency();
  const prefersDarkScheme = usePrefersDarkScheme();

  return useMemo(() => ({
    prefersReducedMotion,
    prefersReducedTransparency,
    prefersDarkScheme,
  }), [prefersReducedMotion, prefersReducedTransparency, prefersDarkScheme]);
}