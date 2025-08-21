"use client";

import React from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
  _hasHydrated: boolean;
  
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSystemTheme: (theme: 'light' | 'dark') => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

/**
 * Theme store with proper SSR support
 */
export const useThemeStore = create<ThemeState>()(
  subscribeWithSelector((set, get) => ({
    theme: 'light',
    resolvedTheme: 'light',
    systemTheme: 'light',
    _hasHydrated: false,
    
    setTheme: (theme: Theme) => {
      set((state) => ({
        theme,
        resolvedTheme: theme === 'system' ? state.systemTheme : theme,
      }));
    },
    
    toggleTheme: () => {
      const { theme } = get();
      if (theme === 'system') {
        // If system, toggle to opposite of current resolved theme
        const { resolvedTheme } = get();
        set({ 
          theme: resolvedTheme === 'light' ? 'dark' : 'light',
          resolvedTheme: resolvedTheme === 'light' ? 'dark' : 'light',
        });
      } else {
        // Toggle between light and dark
        const newTheme = theme === 'light' ? 'dark' : 'light';
        set({ 
          theme: newTheme,
          resolvedTheme: newTheme,
        });
      }
    },
    
    setSystemTheme: (systemTheme: 'light' | 'dark') => {
      set((state) => ({
        systemTheme,
        resolvedTheme: state.theme === 'system' ? systemTheme : state.resolvedTheme,
      }));
    },
    
    setHasHydrated: (hasHydrated: boolean) => set({ _hasHydrated: hasHydrated }),
  }))
);

// Only setup persistence after hydration
let hasSetupThemePersistence = false;

const setupThemePersistence = () => {
  if (hasSetupThemePersistence || typeof window === 'undefined') return;
  hasSetupThemePersistence = true;

  import('../utils/storage').then(({ setStorageItem, STORAGE_KEYS }) => {
    useThemeStore.subscribe(
      (state) => ({
        theme: state.theme,
        resolvedTheme: state.resolvedTheme,
        hasHydrated: state._hasHydrated,
      }),
      (current, previous) => {
        // Only persist and apply after hydration
        if (current.hasHydrated) {
          if (current.theme !== previous.theme) {
            setStorageItem(STORAGE_KEYS.THEME, current.theme);
          }
          
          // Apply theme to document when resolved theme changes
          if (current.resolvedTheme !== previous.resolvedTheme) {
            document.documentElement.classList.toggle('dark', current.resolvedTheme === 'dark');
            document.documentElement.setAttribute('data-theme', current.resolvedTheme);
          }
        }
      },
      {
        equalityFn: (a, b) => 
          a.theme === b.theme &&
          a.resolvedTheme === b.resolvedTheme &&
          a.hasHydrated === b.hasHydrated
      }
    );
  });
};

/**
 * Hook to initialize theme with system preference detection
 * Must be called only once after component mount
 */
export function useThemeInitializer() {
  const { setSystemTheme, setTheme, setHasHydrated } = useThemeStore();
  const hasHydrated = useThemeStore((state) => state._hasHydrated);
  
  React.useEffect(() => {
    if (hasHydrated) return;

    // Setup persistence listener first
    setupThemePersistence();
    
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    
    // Initialize from storage
    import('../utils/storage').then(({ getStorageItem, STORAGE_KEYS }) => {
      const storedTheme = getStorageItem<Theme>(STORAGE_KEYS.THEME, 'light');
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        setTheme(storedTheme);
      }
      setHasHydrated(true);
    });
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [hasHydrated, setSystemTheme, setTheme, setHasHydrated]);
}

/**
 * Convenience hooks with memoization
 */
export function useTheme() {
  const themeState = useThemeStore(
    (state) => ({
      theme: state.theme,
      resolvedTheme: state.resolvedTheme,
      setTheme: state.setTheme,
      toggleTheme: state.toggleTheme,
    })
  );
  
  const { theme, resolvedTheme, setTheme, toggleTheme } = themeState;
  
  return React.useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
  }), [theme, resolvedTheme, setTheme, toggleTheme]);
}

export function useResolvedTheme() {
  return useThemeStore((state) => state.resolvedTheme);
}

export function useIsDarkTheme() {
  return useThemeStore((state) => state.resolvedTheme === 'dark');
}