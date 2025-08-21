"use client";

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface NavState {
  // UI State
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  sidebarLayout: 'overlay' | 'push' | 'static';
  mobileMenuOpen: boolean;
  activeItem?: string;
  
  // Settings
  persistCollapsedState: boolean;
  autoCollapseOnMobile: boolean;
  
  // Hydration state
  _hasHydrated: boolean;
  
  // Actions
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  collapseSidebar: () => void;
  expandSidebar: () => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  setSidebarLayout: (layout: 'overlay' | 'push' | 'static') => void;
  
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  
  setActiveItem: (itemId: string) => void;
  updateSettings: (settings: Partial<Pick<NavState, 'persistCollapsedState' | 'autoCollapseOnMobile'>>) => void;
  
  // Hydration
  setHasHydrated: (hasHydrated: boolean) => void;
  reset: () => void;
}

const initialState = {
  sidebarOpen: false,
  sidebarCollapsed: false,
  sidebarLayout: 'overlay' as const,
  mobileMenuOpen: false,
  activeItem: undefined,
  persistCollapsedState: true,
  autoCollapseOnMobile: true,
  _hasHydrated: false,
};

/**
 * Navigation UI store with proper SSR support
 * Fixed infinite loop and hydration issues
 */
export const useNavStore = create<NavState>()(
  subscribeWithSelector((set) => ({
    ...initialState,
    
    // Sidebar open/close actions
    openSidebar: () => set({ sidebarOpen: true }),
    closeSidebar: () => set({ sidebarOpen: false, mobileMenuOpen: false }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    
    // Sidebar collapse actions
    collapseSidebar: () => set({ sidebarCollapsed: true }),
    expandSidebar: () => set({ sidebarCollapsed: false }),
    toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
    
    // Layout actions
    setSidebarLayout: (layout) => set({ sidebarLayout: layout }),
    
    // Mobile menu actions
    openMobileMenu: () => set({ mobileMenuOpen: true }),
    closeMobileMenu: () => set({ mobileMenuOpen: false }),
    toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
    
    // Navigation actions
    setActiveItem: (itemId: string) => set({ activeItem: itemId }),
    
    // Settings actions
    updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
    
    // Hydration management
    setHasHydrated: (hasHydrated: boolean) => set({ _hasHydrated: hasHydrated }),
    
    // Reset to initial state
    reset: () => set(initialState),
  }))
);

// Only subscribe to persistence after hydration to prevent SSR issues
let hasSetupPersistence = false;

const setupPersistence = () => {
  if (hasSetupPersistence || typeof window === 'undefined') return;
  hasSetupPersistence = true;

  // Import storage utilities only on client
  import('../utils/storage').then(({ setNavigationStorage }) => {
    useNavStore.subscribe(
      (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarLayout: state.sidebarLayout,
        persistCollapsedState: state.persistCollapsedState,
        hasHydrated: state._hasHydrated,
      }),
      (current, previous) => {
        // Only persist after hydration and if settings allow
        if (current.hasHydrated && current.persistCollapsedState) {
          if (current.sidebarCollapsed !== previous.sidebarCollapsed) {
            setNavigationStorage({ sidebarCollapsed: current.sidebarCollapsed });
          }
          if (current.sidebarLayout !== previous.sidebarLayout) {
            setNavigationStorage({ sidebarLayout: current.sidebarLayout });
          }
        }
      },
      {
        equalityFn: (a, b) => 
          a.sidebarCollapsed === b.sidebarCollapsed &&
          a.sidebarLayout === b.sidebarLayout &&
          a.persistCollapsedState === b.persistCollapsedState &&
          a.hasHydrated === b.hasHydrated
      }
    );
  });
};

/**
 * Hook for initializing store with client-side data
 * Prevents infinite loops by using a single useEffect without store subscriptions
 */
export const useNavStoreHydration = () => {
  React.useEffect(() => {
    const currentState = useNavStore.getState();
    if (currentState._hasHydrated) return;

    // Setup persistence listener first
    setupPersistence();

    // Then hydrate from storage
    import('../utils/storage').then(({ getNavigationStorage }) => {
      const stored = getNavigationStorage();
      
      // Use setState directly without triggering additional subscriptions
      useNavStore.setState({
        sidebarCollapsed: stored.sidebarCollapsed ?? false,
        sidebarLayout: stored.sidebarLayout ?? 'overlay',
        _hasHydrated: true,
      });
    });
  }, []); // Empty dependency array - only run once
};

// Add React import for the effect
import React from 'react';

/**
 * SSR-safe convenience hooks with proper memoization
 */
export function useSidebarState(): {
  isOpen: boolean;
  isCollapsed: boolean;
  layout: 'overlay' | 'push' | 'static';
} {
  return useNavStore(
    (state) => ({
      isOpen: state.sidebarOpen,
      isCollapsed: state.sidebarCollapsed,
      layout: state.sidebarLayout,
    })
  );
}

export function useSidebarActions(): {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  collapse: () => void;
  expand: () => void;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setLayout: (layout: 'overlay' | 'push' | 'static') => void;
} {
  return useNavStore(
    (state) => ({
      open: state.openSidebar,
      close: state.closeSidebar,
      toggle: state.toggleSidebar,
      setOpen: state.setSidebarOpen,
      collapse: state.collapseSidebar,
      expand: state.expandSidebar,
      toggleCollapse: state.toggleSidebarCollapse,
      setCollapsed: state.setSidebarCollapsed,
      setLayout: state.setSidebarLayout,
    })
  );
}

export function useMobileMenuState() {
  return useNavStore(
    (state) => ({
      isOpen: state.mobileMenuOpen,
      open: state.openMobileMenu,
      close: state.closeMobileMenu,
      toggle: state.toggleMobileMenu,
    })
  );
}

export function useActiveNavItem() {
  return useNavStore(
    (state) => ({
      activeItem: state.activeItem,
      setActiveItem: state.setActiveItem,
    })
  );
}

/**
 * Combined hook for easier migration from old provider
 */
export function useNavigation() {
  const sidebarState = useSidebarState();
  const sidebarActions = useSidebarActions();
  const mobileMenu = useMobileMenuState();
  const { activeItem, setActiveItem } = useActiveNavItem();
  
  return React.useMemo(() => ({
    // Sidebar state
    sidebarOpen: sidebarState.isOpen,
    sidebarCollapsed: sidebarState.isCollapsed,
    sidebarLayout: sidebarState.layout,
    
    // Mobile menu
    mobileMenuOpen: mobileMenu.isOpen,
    
    // Active item
    activeItem,
    
    // All actions
    ...sidebarActions,
    ...mobileMenu,
    setActiveItem,
  }), [sidebarState, sidebarActions, mobileMenu, activeItem, setActiveItem]);
}