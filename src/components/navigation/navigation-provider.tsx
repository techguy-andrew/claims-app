"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useReducer } from 'react';
import { getScreenSize, type ScreenSize, BREAKPOINTS } from './utils';

export interface NavigationState {
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  sidebarLayout: 'overlay' | 'push' | 'static';
  
  // Screen size
  screenSize: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  
  // Navigation theme
  theme: 'light' | 'dark';
  
  // Mobile menu state
  mobileMenuOpen: boolean;
  
  // Active navigation item
  activeItem?: string;
  
  // Settings
  persistCollapsedState: boolean;
  autoCollapseOnMobile: boolean;
}

export interface NavigationActions {
  // Sidebar actions
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Sidebar collapse actions
  collapseSidebar: () => void;
  expandSidebar: () => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Layout actions
  setSidebarLayout: (layout: 'overlay' | 'push' | 'static') => void;
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  // Mobile menu actions
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  
  // Navigation actions
  setActiveItem: (itemId: string) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<NavigationSettings>) => void;
}

export interface NavigationSettings {
  persistCollapsedState: boolean;
  autoCollapseOnMobile: boolean;
  defaultSidebarLayout: 'overlay' | 'push' | 'static';
  defaultTheme: 'light' | 'dark';
}

export type NavigationContextType = NavigationState & NavigationActions;

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Action types for reducer
type NavigationActionType =
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'SET_SIDEBAR_LAYOUT'; payload: 'overlay' | 'push' | 'static' }
  | { type: 'SET_SCREEN_SIZE'; payload: ScreenSize }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_MOBILE_MENU_OPEN'; payload: boolean }
  | { type: 'SET_ACTIVE_ITEM'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<NavigationSettings> };

// Reducer function
const navigationReducer = (state: NavigationState, action: NavigationActionType): NavigationState => {
  switch (action.type) {
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
    
    case 'SET_SIDEBAR_COLLAPSED':
      return { ...state, sidebarCollapsed: action.payload };
    
    case 'SET_SIDEBAR_LAYOUT':
      return { ...state, sidebarLayout: action.payload };
    
    case 'SET_SCREEN_SIZE':
      return {
        ...state,
        screenSize: action.payload,
        isMobile: action.payload === 'mobile',
        isTablet: action.payload === 'tablet',
        isDesktop: action.payload === 'desktop',
      };
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'SET_MOBILE_MENU_OPEN':
      return { ...state, mobileMenuOpen: action.payload };
    
    case 'SET_ACTIVE_ITEM':
      return { ...state, activeItem: action.payload };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        persistCollapsedState: action.payload.persistCollapsedState ?? state.persistCollapsedState,
        autoCollapseOnMobile: action.payload.autoCollapseOnMobile ?? state.autoCollapseOnMobile,
      };
    
    default:
      return state;
  }
};

// Local storage keys
const STORAGE_KEYS = {
  SIDEBAR_COLLAPSED: 'navigation-sidebar-collapsed',
  THEME: 'navigation-theme',
  SIDEBAR_LAYOUT: 'navigation-sidebar-layout',
} as const;

export interface NavigationProviderProps {
  children: React.ReactNode;
  defaultSettings?: Partial<NavigationSettings>;
  initialTheme?: 'light' | 'dark';
  initialSidebarLayout?: 'overlay' | 'push' | 'static';
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children,
  defaultSettings = {},
  initialTheme = 'light',
  initialSidebarLayout = 'overlay'
}) => {
  const [mounted, setMounted] = useState(false);
  
  // Default settings
  const settings: NavigationSettings = {
    persistCollapsedState: true,
    autoCollapseOnMobile: true,
    defaultSidebarLayout: initialSidebarLayout,
    defaultTheme: initialTheme,
    ...defaultSettings,
  };

  // Get initial state
  const getInitialState = (): NavigationState => {
    // Always start with desktop as default for SSR consistency
    const screenSize = 'desktop';
    
    let theme = settings.defaultTheme;
    let sidebarCollapsed = false;
    let sidebarLayout = settings.defaultSidebarLayout;

    // Only access localStorage on client side after mount
    // This prevents hydration mismatches

    return {
      sidebarOpen: false, // Always start closed to prevent hydration mismatch
      sidebarCollapsed: false,
      sidebarLayout,
      screenSize,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      theme,
      mobileMenuOpen: false,
      activeItem: undefined,
      persistCollapsedState: settings.persistCollapsedState,
      autoCollapseOnMobile: settings.autoCollapseOnMobile,
    };
  };

  const [state, dispatch] = useReducer(navigationReducer, getInitialState());

  // Handle screen size changes
  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      const newScreenSize = getScreenSize(window.innerWidth);
      dispatch({ type: 'SET_SCREEN_SIZE', payload: newScreenSize });
      
      // Auto-adjust sidebar based on screen size
      if (settings.autoCollapseOnMobile) {
        if (newScreenSize === 'desktop') {
          dispatch({ type: 'SET_SIDEBAR_OPEN', payload: true });
        } else {
          dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
          dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: false });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mounted, settings.autoCollapseOnMobile]);

  // Persist settings to localStorage
  useEffect(() => {
    if (!mounted) return;

    if (settings.persistCollapsedState) {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(state.sidebarCollapsed));
    }
  }, [state.sidebarCollapsed, settings.persistCollapsedState, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
  }, [state.theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_LAYOUT, state.sidebarLayout);
  }, [state.sidebarLayout, mounted]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + B: Toggle sidebar
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault();
        if (state.isDesktop) {
          dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: !state.sidebarCollapsed });
        } else {
          dispatch({ type: 'SET_SIDEBAR_OPEN', payload: !state.sidebarOpen });
        }
      }
      
      // Escape: Close mobile menu or sidebar
      if (event.key === 'Escape') {
        if (state.mobileMenuOpen) {
          dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: false });
        } else if (state.sidebarOpen && !state.isDesktop) {
          dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.sidebarOpen, state.sidebarCollapsed, state.mobileMenuOpen, state.isDesktop, mounted]);

  // Set mounted flag and initialize client-side state
  useEffect(() => {
    setMounted(true);
    
    // Initialize client-side state after mount to prevent hydration mismatch
    const screenSize = getScreenSize(window.innerWidth);
    dispatch({ type: 'SET_SCREEN_SIZE', payload: screenSize });
    
    // Load saved settings from localStorage
    let actualTheme = settings.defaultTheme;
    let sidebarCollapsed = false;
    let actualSidebarLayout = settings.defaultSidebarLayout;
    
    if (settings.persistCollapsedState) {
      const savedCollapsed = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
      if (savedCollapsed !== null) {
        sidebarCollapsed = JSON.parse(savedCollapsed);
      }
    }
    
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      actualTheme = savedTheme;
    }
    
    const savedLayout = localStorage.getItem(STORAGE_KEYS.SIDEBAR_LAYOUT);
    if (savedLayout && ['overlay', 'push', 'static'].includes(savedLayout)) {
      actualSidebarLayout = savedLayout as 'overlay' | 'push' | 'static';
    }
    
    // Apply loaded settings
    dispatch({ type: 'SET_THEME', payload: actualTheme });
    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: sidebarCollapsed });
    dispatch({ type: 'SET_SIDEBAR_LAYOUT', payload: actualSidebarLayout });
    
    // Set initial sidebar state based on screen size
    if (settings.autoCollapseOnMobile) {
      if (screenSize === 'desktop') {
        dispatch({ type: 'SET_SIDEBAR_OPEN', payload: true });
      } else {
        dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
      }
    }
  }, [settings.defaultTheme, settings.persistCollapsedState, settings.defaultSidebarLayout, settings.autoCollapseOnMobile]);

  // Action creators
  const actions: NavigationActions = {
    // Sidebar actions
    openSidebar: useCallback(() => {
      dispatch({ type: 'SET_SIDEBAR_OPEN', payload: true });
    }, []),
    
    closeSidebar: useCallback(() => {
      dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
    }, []),
    
    toggleSidebar: useCallback(() => {
      dispatch({ type: 'SET_SIDEBAR_OPEN', payload: !state.sidebarOpen });
    }, [state.sidebarOpen]),
    
    setSidebarOpen: useCallback((open: boolean) => {
      dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });
    }, []),

    // Sidebar collapse actions
    collapseSidebar: useCallback(() => {
      dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: true });
    }, []),
    
    expandSidebar: useCallback(() => {
      dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: false });
    }, []),
    
    toggleSidebarCollapse: useCallback(() => {
      dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: !state.sidebarCollapsed });
    }, [state.sidebarCollapsed]),
    
    setSidebarCollapsed: useCallback((collapsed: boolean) => {
      dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed });
    }, []),

    // Layout actions
    setSidebarLayout: useCallback((layout: 'overlay' | 'push' | 'static') => {
      dispatch({ type: 'SET_SIDEBAR_LAYOUT', payload: layout });
    }, []),

    // Theme actions
    setTheme: useCallback((theme: 'light' | 'dark') => {
      dispatch({ type: 'SET_THEME', payload: theme });
    }, []),
    
    toggleTheme: useCallback(() => {
      dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
    }, [state.theme]),

    // Mobile menu actions
    openMobileMenu: useCallback(() => {
      dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: true });
    }, []),
    
    closeMobileMenu: useCallback(() => {
      dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: false });
    }, []),
    
    toggleMobileMenu: useCallback(() => {
      dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: !state.mobileMenuOpen });
    }, [state.mobileMenuOpen]),

    // Navigation actions
    setActiveItem: useCallback((itemId: string) => {
      dispatch({ type: 'SET_ACTIVE_ITEM', payload: itemId });
    }, []),

    // Settings actions
    updateSettings: useCallback((newSettings: Partial<NavigationSettings>) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
    }, []),
  };

  const contextValue: NavigationContextType = {
    ...state,
    ...actions,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

// Hook to use navigation context
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// Convenience hooks for specific navigation features
export const useSidebar = () => {
  const {
    sidebarOpen,
    sidebarCollapsed,
    sidebarLayout,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    setSidebarOpen,
    collapseSidebar,
    expandSidebar,
    toggleSidebarCollapse,
    setSidebarCollapsed,
    setSidebarLayout,
    isMobile,
    isTablet,
    isDesktop,
  } = useNavigation();

  return {
    isOpen: sidebarOpen,
    isCollapsed: sidebarCollapsed,
    layout: sidebarLayout,
    open: openSidebar,
    close: closeSidebar,
    toggle: toggleSidebar,
    setOpen: setSidebarOpen,
    collapse: collapseSidebar,
    expand: expandSidebar,
    toggleCollapse: toggleSidebarCollapse,
    setCollapsed: setSidebarCollapsed,
    setLayout: setSidebarLayout,
    isMobile,
    isTablet,
    isDesktop,
  };
};

export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useNavigation();
  
  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};

export const useMobileMenu = () => {
  const {
    mobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    isMobile,
    isTablet,
  } = useNavigation();

  return {
    isOpen: mobileMenuOpen,
    open: openMobileMenu,
    close: closeMobileMenu,
    toggle: toggleMobileMenu,
    isMobile,
    isTablet,
    shouldShow: isMobile || isTablet,
  };
};