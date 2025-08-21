"use client";

import React, { useState, memo, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  Settings, 
  User, 
  ChevronDown, 
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';

// New imports for enhanced functionality
import { Portal } from './portal';
import { useOverlayAccessibility } from './hooks/use-focus-trap';
import { useScreenSizeSync, useUserPreferencesSync } from './hooks/use-media-sync';
import { useSidebarState, useSidebarActions } from './stores/nav-store';
import { useTheme } from './stores/theme-store';
import { cn } from './utils';
import styles from './navigation.module.css';

// Types
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavigationItem[];
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
}

export interface UserInfo {
  name: string;
  email?: string;
  avatar?: string;
  initials?: string;
}

export interface SidebarEnhancedProps {
  navigation?: NavigationItem[];
  showProfile?: boolean;
  userInfo?: UserInfo;
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}

// Enhanced Sidebar Item with proper disclosure pattern
const SidebarItem = memo<{
  item: NavigationItem;
  isActive?: boolean;
  level?: number;
  onItemClick?: (item: NavigationItem) => void;
  isItemActive?: (item: NavigationItem) => boolean;
}>(({ item, isActive = false, level = 0, onItemClick, isItemActive }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = Boolean(item.children?.length);
  const { prefersReducedMotion } = useUserPreferencesSync();

  const handleToggle = useCallback(() => {
    if (!item.disabled && hasChildren) {
      setIsExpanded(prev => !prev);
    }
  }, [item.disabled, hasChildren]);

  const handleItemClick = useCallback(() => {
    if (item.onClick) {
      item.onClick();
    }
    onItemClick?.(item);
  }, [item, onItemClick]);

  const itemClasses = cn(
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
    "min-h-[var(--nav-touch-target-min)] md:min-h-[var(--nav-touch-target-desktop)]",
    !prefersReducedMotion && "duration-[var(--nav-transition-duration)]",
    isActive 
      ? "bg-blue-50 text-blue-700 font-medium" 
      : "text-gray-700 hover:bg-gray-100",
    item.disabled && "opacity-50 cursor-not-allowed",
    level > 0 && "ml-4"
  );

  // For collapsible items, use proper disclosure pattern
  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          className={itemClasses}
          onClick={handleToggle}
          aria-expanded={isExpanded}
          aria-controls={`nav-section-${item.id}`}
          disabled={item.disabled}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {item.icon && (
              <item.icon 
                className="w-5 h-5 md:w-4 md:h-4 flex-shrink-0" 
                aria-hidden="true"
              />
            )}
            <span className="text-base md:text-sm truncate">
              {item.label}
            </span>
            {item.badge && (
              <span className="ml-auto flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {item.badge}
              </span>
            )}
          </div>
          <ChevronRight 
            className={cn(
              "w-4 h-4 transition-transform",
              !prefersReducedMotion && "duration-200",
              isExpanded && "rotate-90"
            )}
            aria-hidden="true" 
          />
        </button>
        
        {isExpanded && (
          <div 
            id={`nav-section-${item.id}`}
            role="region"
            aria-labelledby={`nav-section-${item.id}`}
            className="space-y-1 mt-1"
          >
            {item.children!.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                isActive={isItemActive ? isItemActive(child) : false}
                level={level + 1}
                onItemClick={onItemClick}
                isItemActive={isItemActive}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // For navigation items with hrefs
  if (item.href && !item.disabled) {
    return (
      <Link
        href={item.href}
        className={itemClasses}
        onClick={handleItemClick}
        aria-current={isActive ? 'page' : undefined}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {item.icon && (
            <item.icon 
              className="w-5 h-5 md:w-4 md:h-4 flex-shrink-0" 
              aria-hidden="true"
            />
          )}
          <span className="text-base md:text-sm truncate">
            {item.label}
          </span>
          {item.badge && (
            <span className="ml-auto flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
              {item.badge}
            </span>
          )}
        </div>
      </Link>
    );
  }

  // For action items without hrefs
  return (
    <button
      type="button"
      className={itemClasses}
      onClick={handleItemClick}
      disabled={item.disabled}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {item.icon && (
          <item.icon 
            className="w-5 h-5 md:w-4 md:h-4 flex-shrink-0" 
            aria-hidden="true"
          />
        )}
        <span className="text-base md:text-sm truncate">
          {item.label}
        </span>
        {item.badge && (
          <span className="ml-auto flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
            {item.badge}
          </span>
        )}
      </div>
    </button>
  );
});

SidebarItem.displayName = 'SidebarItem';

// User Profile Component
const SidebarProfile = memo<{
  userInfo: UserInfo;
  onSignOut?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}>(({ userInfo, onSignOut, onProfileClick, onSettingsClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { prefersReducedMotion } = useUserPreferencesSync();

  const userInitials = useMemo(() => {
    return userInfo.initials || userInfo.name.charAt(0).toUpperCase();
  }, [userInfo.initials, userInfo.name]);

  const handleProfileClick = useCallback(() => {
    setIsMenuOpen(false);
    onProfileClick?.();
  }, [onProfileClick]);

  const handleSettingsClick = useCallback(() => {
    setIsMenuOpen(false);
    onSettingsClick?.();
  }, [onSettingsClick]);

  const handleSignOut = useCallback(() => {
    setIsMenuOpen(false);
    onSignOut?.();
  }, [onSignOut]);

  return (
    <div className="px-4 py-6 mt-4 border-t border-gray-100/50">
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "w-full flex items-center gap-3 p-4 bg-white/60 backdrop-blur-xl rounded-2xl shadow-sm",
            "hover:shadow-md hover:-translate-y-0.5",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            "transition-all",
            !prefersReducedMotion && "duration-[var(--nav-transition-duration)]"
          )}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          aria-label={`User menu for ${userInfo.name}`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-medium flex-shrink-0" aria-hidden="true">
            {userInitials}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-semibold truncate text-gray-900 leading-tight">
              {userInfo.name}
            </p>
            {userInfo.email && (
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {userInfo.email}
              </p>
            )}
          </div>
          <ChevronDown 
            className={cn(
              "w-4 h-4 transition-transform text-gray-500 flex-shrink-0",
              !prefersReducedMotion && "duration-[var(--nav-transition-duration)]",
              isMenuOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        {isMenuOpen && (
          <div 
            className="absolute bottom-full left-0 right-0 mb-2 bg-white/80 backdrop-blur-xl border border-gray-100/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] py-2 z-50"
            role="menu"
            aria-orientation="vertical"
          >
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/60 rounded-xl mx-1 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 transition-all hover:scale-[1.02]"
              role="menuitem"
            >
              <User className="w-4 h-4" aria-hidden="true" />
              View Profile
            </button>
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/60 rounded-xl mx-1 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 transition-all hover:scale-[1.02]"
              role="menuitem"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
              Settings
            </button>
            <hr className="my-2 border-gray-100/50 mx-2" role="separator" />
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 rounded-xl mx-1 text-red-600 text-left focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all hover:scale-[1.02]"
              role="menuitem"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

SidebarProfile.displayName = 'SidebarProfile';

// Default navigation data
const DEFAULT_NAVIGATION: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: Home },
  { id: 'claims', label: 'Claims', href: '/claims', icon: FileText },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    children: [
      { id: 'general', label: 'General', href: '/settings/general' },
      { id: 'users', label: 'Users', href: '/settings/users' },
      { id: 'billing', label: 'Billing', href: '/settings/billing' },
    ]
  },
];

const DEFAULT_USER_INFO: UserInfo = {
  name: 'John Doe',
  email: 'john@example.com',
  initials: 'JD'
};

// Main Enhanced Sidebar Component
export const SidebarEnhanced = memo<SidebarEnhancedProps>(({ 
  navigation = DEFAULT_NAVIGATION,
  showProfile = true,
  userInfo = DEFAULT_USER_INFO,
  className = '',
  'aria-label': ariaLabel = 'Main navigation',
  ...props
}) => {
  const pathname = usePathname();
  const { isOpen, layout } = useSidebarState();
  const { close } = useSidebarActions();
  const { resolvedTheme } = useTheme();
  const { isMobile, isTablet } = useScreenSizeSync();
  const { prefersReducedMotion, prefersReducedTransparency } = useUserPreferencesSync();

  // Enhanced accessibility management
  const { containerRef } = useOverlayAccessibility(
    isOpen && layout === 'overlay', 
    {
      excludeFromInert: '[data-portal]',
      enableFocusTrap: true,
      enableScrollLock: true,
    }
  );

  const isItemActive = useCallback((item: NavigationItem): boolean => {
    if (item.href) {
      return pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    }
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return false;
  }, [pathname]);

  const handleItemClick = useCallback((item: NavigationItem) => {
    // Close sidebar on mobile when clicking navigation items with hrefs
    if (item.href && (layout === 'overlay' || isMobile || isTablet)) {
      setTimeout(() => close(), 150);
    }
  }, [layout, isMobile, isTablet, close]);

  const sidebarClasses = cn(
    styles.sidebar,
    'z-[var(--z-nav)]',
    isOpen ? styles.visible : styles.hidden,
    resolvedTheme === 'dark' && styles.dark,
    className,
    "transition-transform",
    !prefersReducedMotion && "duration-[var(--nav-transition-duration)] ease-[var(--nav-transition-timing)]"
  );

  const backdropClasses = cn(
    "fixed inset-0 bg-black/20 transition-all z-[var(--z-overlay)]",
    !prefersReducedMotion && "duration-[var(--nav-transition-duration)]",
    !prefersReducedTransparency && "backdrop-blur-[var(--nav-backdrop-blur)]"
  );

  const sidebarContent = (
    <aside
      ref={containerRef}
      className={sidebarClasses}
      role="navigation"
      aria-label={ariaLabel}
      data-portal
      {...props}
    >
      {/* Header */}
      <div className="flex items-center h-20 px-6 pt-6">
        <div className="lg:hidden flex items-center justify-between w-full">
          <span className="font-bold text-xl text-gray-900">Menu</span>
          <button
            onClick={close}
            className="p-3 bg-white/80 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        
        <div className="hidden lg:flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/60 backdrop-blur-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Claims App</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-0 space-y-6" aria-label={ariaLabel}>
          <div className="space-y-2 px-6">
            {navigation.map((item, index) => (
              <div 
                key={item.id}
                style={{ 
                  animation: !prefersReducedMotion 
                    ? `slideUp 0.6s ease-out ${(index * 100) + 200}ms both` 
                    : undefined 
                }}
              >
                <SidebarItem
                  item={item}
                  isActive={isItemActive(item)}
                  onItemClick={handleItemClick}
                  isItemActive={isItemActive}
                />
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* User Profile */}
      {showProfile && (
        <SidebarProfile
          userInfo={userInfo}
          onSignOut={() => console.log('Sign out clicked')}
        />
      )}

      {/* Animation styles */}
      {!prefersReducedMotion && (
        <style jsx>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      )}
    </aside>
  );

  // Don't render anything if not open and using overlay layout
  if (!isOpen && layout === 'overlay') {
    return null;
  }

  // For overlay layout, use Portal
  if (layout === 'overlay') {
    return (
      <Portal>
        {/* Backdrop */}
        <div 
          className={backdropClasses}
          onClick={close}
          aria-hidden="true"
        />
        {/* Sidebar */}
        {sidebarContent}
      </Portal>
    );
  }

  // For static/push layouts, render normally
  return sidebarContent;
});

SidebarEnhanced.displayName = 'SidebarEnhanced';