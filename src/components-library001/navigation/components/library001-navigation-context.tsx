"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useReducer } from 'react';
import { getLibrary001ScreenSize, type Library001ScreenSize } from '../utils';

export interface Library001NavigationState {
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  sidebarLayout: 'overlay' | 'push' | 'static';
  
  // Screen size
  screenSize: Library001ScreenSize;
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

export interface Library001NavigationActions {
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
  updateSettings: (settings: Partial<Library001NavigationSettings>) => void;
}

export interface Library001NavigationSettings {
  persistCollapsedState: boolean;
  autoCollapseOnMobile: boolean;
  defaultSidebarLayout: 'overlay' | 'push' | 'static';
  defaultTheme: 'light' | 'dark';
}

export type Library001NavigationContextType = Library001NavigationState & Library001NavigationActions;

const Library001NavigationContext = createContext<Library001NavigationContextType | undefined>(undefined);

// Action types for reducer
type Library001NavigationActionType =
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'SET_SIDEBAR_LAYOUT'; payload: 'overlay' | 'push' | 'static' }
  | { type: 'SET_SCREEN_SIZE'; payload: Library001ScreenSize }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_MOBILE_MENU_OPEN'; payload: boolean }
  | { type: 'SET_ACTIVE_ITEM'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Library001NavigationSettings> };

// Reducer function
const library001NavigationReducer = (state: Library001NavigationState, action: Library001NavigationActionType): Library001NavigationState => {
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
const LIBRARY001_STORAGE_KEYS = {
  SIDEBAR_COLLAPSED: 'library001-navigation-sidebar-collapsed',
  THEME: 'library001-navigation-theme',
  SIDEBAR_LAYOUT: 'library001-navigation-sidebar-layout',
} as const;

export interface Library001NavigationProviderProps {
  children: React.ReactNode;
  defaultSettings?: Partial<Library001NavigationSettings>;
  initialTheme?: 'light' | 'dark';
  initialSidebarLayout?: 'overlay' | 'push' | 'static';
}

export const Library001NavigationProvider: React.FC<Library001NavigationProviderProps> = ({ 
  children,
  defaultSettings = {},
  initialTheme = 'light',
  initialSidebarLayout = 'overlay'
}) => {
  const [mounted, setMounted] = useState(false);
  
  // Default settings
  const settings: Library001NavigationSettings = {
    persistCollapsedState: true,
    autoCollapseOnMobile: true,
    defaultSidebarLayout: initialSidebarLayout,
    defaultTheme: initialTheme,
    ...defaultSettings,
  };

  // Get initial state
  const getInitialState = (): Library001NavigationState => {
    // Always start with desktop as default for SSR consistency
    const screenSize = 'desktop';
    
    const theme = settings.defaultTheme;
    const sidebarLayout = settings.defaultSidebarLayout;

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

  const [state, dispatch] = useReducer(library001NavigationReducer, getInitialState());

  // Handle screen size changes
  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      const newScreenSize = getLibrary001ScreenSize(window.innerWidth);
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
      localStorage.setItem(LIBRARY001_STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(state.sidebarCollapsed));
    }
  }, [state.sidebarCollapsed, settings.persistCollapsedState, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(LIBRARY001_STORAGE_KEYS.THEME, state.theme);
  }, [state.theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(LIBRARY001_STORAGE_KEYS.SIDEBAR_LAYOUT, state.sidebarLayout);
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
    const screenSize = getLibrary001ScreenSize(window.innerWidth);
    dispatch({ type: 'SET_SCREEN_SIZE', payload: screenSize });
    
    // Load saved settings from localStorage
    let actualTheme = settings.defaultTheme;
    let sidebarCollapsed = false;
    let actualSidebarLayout = settings.defaultSidebarLayout;
    
    if (settings.persistCollapsedState) {
      const savedCollapsed = localStorage.getItem(LIBRARY001_STORAGE_KEYS.SIDEBAR_COLLAPSED);
      if (savedCollapsed !== null) {
        sidebarCollapsed = JSON.parse(savedCollapsed);
      }
    }
    
    const savedTheme = localStorage.getItem(LIBRARY001_STORAGE_KEYS.THEME);
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      actualTheme = savedTheme;
    }
    
    const savedLayout = localStorage.getItem(LIBRARY001_STORAGE_KEYS.SIDEBAR_LAYOUT);
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
  const actions: Library001NavigationActions = {
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
    updateSettings: useCallback((newSettings: Partial<Library001NavigationSettings>) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
    }, []),
  };

  const contextValue: Library001NavigationContextType = {
    ...state,
    ...actions,
  };

  return (
    <Library001NavigationContext.Provider value={contextValue}>
      {children}
    </Library001NavigationContext.Provider>
  );
};

// Hook to use navigation context
export const useLibrary001Navigation = (): Library001NavigationContextType => {
  const context = useContext(Library001NavigationContext);
  if (context === undefined) {
    throw new Error('useLibrary001Navigation must be used within a Library001NavigationProvider');
  }
  return context;
};

// Convenience hooks for specific navigation features
export const useLibrary001Sidebar = () => {
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
  } = useLibrary001Navigation();

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

export const useLibrary001Theme = () => {
  const { theme, setTheme, toggleTheme } = useLibrary001Navigation();
  
  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};

export const useLibrary001MobileMenu = () => {
  const {
    mobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    isMobile,
    isTablet,
  } = useLibrary001Navigation();

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

// Export default for convenience
export default Library001NavigationProvider;