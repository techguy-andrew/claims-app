/**
 * Library001 Navigation Package - A self-contained, plug-and-play navigation system
 * 
 * Quick Start:
 * import { Library001NavigationLayout } from '@/components-library001/navigation';
 * 
 * <Library001NavigationLayout>
 *   {children}
 * </Library001NavigationLayout>
 */

// Main Layout Wrapper (recommended for most use cases)
export { Library001NavigationLayout, type Library001NavigationLayoutProps } from './library001-layout-wrapper';

// Components
export { 
  Library001AppSidebar, 
  Library001SidebarItem, 
  Library001SidebarSection, 
  Library001SidebarProfile 
} from './components/library001-app-sidebar';
export { Library001MenuButton } from './components/library001-menu-button';
export { Library001NavigationProvider } from './components/library001-navigation-context';

// Hooks
export { 
  Library001NavigationProvider as NavigationProvider,
  useLibrary001Navigation, 
  useLibrary001Sidebar, 
  useLibrary001Theme, 
  useLibrary001MobileMenu 
} from './hooks';

// Types
export type {
  Library001NavigationItem,
  Library001UserInfo,
  Library001AppSidebarProps,
  Library001SidebarItemProps,
  Library001SidebarSectionProps,
  Library001NavigationState,
  Library001NavigationActions,
  Library001NavigationSettings,
  Library001NavigationContextType,
  Library001NavigationProviderProps,
  Library001MenuButtonProps,
  Library001VariantProps,
  Library001ScreenSize
} from './types';

// Utilities
export { 
  library001Cn, 
  createLibrary001Variants, 
  getLibrary001ScreenSize, 
  LIBRARY001_BREAKPOINTS 
} from './utils';

// UI Components (internal but exported for flexibility)
export { Library001Button } from './ui/library001-button';

// For backward compatibility with existing code - provide aliases
export { Library001AppSidebar as SidebarV2 } from './components/library001-app-sidebar';

