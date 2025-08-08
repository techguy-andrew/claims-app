"use client";

import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
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
import { createVariants, cn, type VariantProps } from './utils';
import styles from './navigation.module.css';
import { useNavigation } from './navigation-provider';
import { Button } from '@/components/ui/button';

// Base style utilities for consistency - mobile-first approach
const baseItemStyles = "flex items-center gap-3 px-4 py-3 md:px-3 md:py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[44px] md:min-h-[36px]";
const baseButtonStyles = "p-3 md:p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[44px] md:min-h-[36px]";

// Types and Interfaces
const sidebarVariants = {
  layout: {
    overlay: styles.overlay,
    push: styles.push,
    static: styles.static,
  },
  size: {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  },
  theme: {
    light: '',
    dark: styles.dark,
  },
} as const;

const getSidebarClasses = createVariants(sidebarVariants);

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

export interface SidebarV2Props extends VariantProps<typeof sidebarVariants> {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  onToggleCollapse?: () => void;
  navigation?: NavigationItem[];
  showProfile?: boolean;
  userInfo?: UserInfo;
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}

export interface SidebarItemProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  item: NavigationItem;
  isActive?: boolean;
  isCollapsed?: boolean;
  level?: number;
  theme?: 'light' | 'dark';
  onItemClick?: (item: NavigationItem) => void;
  isItemActive?: (item: NavigationItem) => boolean;
}

export interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
  className?: string;
}

// Custom hooks
const useClickOutside = (
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  active: boolean = true
) => {
  useEffect(() => {
    if (!active) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler, active]);
};

const useKeyboard = (isOpen: boolean, onClose?: () => void) => {
  useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
};

// Sidebar Item Component with improved accessibility
export const SidebarItemV2 = memo<SidebarItemProps>(({ 
  item, 
  isActive = false, 
  isCollapsed = false,
  level = 0,
  theme = 'light',
  onItemClick,
  isItemActive
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = Boolean(item.children?.length);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleItemClick = useCallback(() => {
    if (item.onClick) {
      item.onClick();
    }
    onItemClick?.(item);
  }, [item, onItemClick]);

  // Use details/summary for better accessibility
  if (hasChildren && !isCollapsed) {
    return (
      <details open={isExpanded} className="group">
        <summary 
          className={cn(
            baseItemStyles,
            "cursor-pointer list-none",
            isActive 
              ? "bg-blue-50 text-blue-700 font-medium" 
              : "text-gray-700 hover:bg-gray-100",
            item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
            level > 0 && "ml-4"
          )}
          onClick={(e) => {
            e.preventDefault();
            if (!item.disabled) {
              handleToggleExpand();
            }
          }}
          role="button"
          aria-expanded={isExpanded}
          aria-disabled={item.disabled}
          tabIndex={item.disabled ? -1 : 0}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {item.icon && (
              <item.icon 
                className="w-5 h-5 md:w-4 md:h-4 flex-shrink-0" 
                aria-hidden="true"
              />
            )}
            <span className="text-base md:text-sm truncate font-normal">
              {item.label}
            </span>
            {item.badge && (
              <span className="ml-auto flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 md:py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {item.badge}
              </span>
            )}
          </div>
          <ChevronRight 
            className={cn(
              "w-5 h-5 md:w-4 md:h-4 transition-transform duration-200",
              isExpanded && "rotate-90"
            )}
            aria-hidden="true" 
          />
        </summary>
        
        <div className="mt-1 space-y-1" role="group" aria-label={`${item.label} submenu`}>
          {item.children!.map((child) => (
            <SidebarItemV2
              key={child.id}
              item={child}
              isActive={isItemActive ? isItemActive(child) : false}
              isCollapsed={isCollapsed}
              level={level + 1}
              theme={theme}
              onItemClick={onItemClick}
              isItemActive={isItemActive}
            />
          ))}
        </div>
      </details>
    );
  }

  // Regular item (with or without href)
  const itemContent = (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {item.icon && (
        <item.icon 
          className="w-5 h-5 md:w-4 md:h-4 flex-shrink-0" 
          aria-hidden="true"
        />
      )}
      {!isCollapsed && (
        <>
          <span className="text-base md:text-sm truncate font-normal">
            {item.label}
          </span>
          {item.badge && (
            <span className="ml-auto flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 md:py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
              {item.badge}
            </span>
          )}
        </>
      )}
    </div>
  );

  const itemClasses = cn(
    baseItemStyles,
    isActive 
      ? "bg-blue-50 text-blue-700 font-medium" 
      : "text-gray-700 hover:bg-gray-100",
    item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    level > 0 && "ml-4"
  );

  if (item.href && !item.disabled) {
    return (
      <Link
        href={item.href}
        className={itemClasses}
        title={isCollapsed ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={item.disabled}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        onClick={handleItemClick}
      >
        {itemContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={itemClasses}
      title={isCollapsed ? item.label : undefined}
      aria-disabled={item.disabled}
      disabled={item.disabled}
      onClick={handleItemClick}
    >
      {itemContent}
    </button>
  );
});

SidebarItemV2.displayName = 'SidebarItemV2';

// Sidebar Section Component
export const SidebarSectionV2 = memo<SidebarSectionProps>(({ 
  title, 
  children, 
  isCollapsed = false,
  className 
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      {title && !isCollapsed && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <div role="group" aria-label={title}>
        {children}
      </div>
    </div>
  );
});

SidebarSectionV2.displayName = 'SidebarSectionV2';

// User Profile Component
export const SidebarProfileV2 = memo<{
  userInfo: UserInfo;
  isCollapsed?: boolean;
  theme?: 'light' | 'dark';
  onSignOut?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}>(({ 
  userInfo, 
  isCollapsed = false, 
  onSignOut,
  onProfileClick,
  onSettingsClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  useClickOutside(menuRef, closeMenu, isMenuOpen);

  const handleProfileClick = useCallback(() => {
    closeMenu();
    onProfileClick?.();
  }, [closeMenu, onProfileClick]);

  const handleSettingsClick = useCallback(() => {
    closeMenu();
    onSettingsClick?.();
  }, [closeMenu, onSettingsClick]);

  const handleSignOut = useCallback(() => {
    closeMenu();
    onSignOut?.();
  }, [closeMenu, onSignOut]);

  const userInitials = useMemo(() => {
    return userInfo.initials || userInfo.name.charAt(0).toUpperCase();
  }, [userInfo.initials, userInfo.name]);

  if (isCollapsed) {
    return (
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="modern"
          size="small"
          className="w-8 h-8 rounded-lg text-sm font-medium" 
          title={userInfo.name}
          onClick={toggleMenu}
          aria-label={`User menu for ${userInfo.name}`}
        >
          {userInitials}
        </Button>
      </div>
    );
  }

  return (
    <div className="px-3 py-4" ref={menuRef}>
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[44px] md:min-h-[40px] md:p-3"
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          aria-label={`User menu for ${userInfo.name}`}
        >
          <div className="w-10 h-10 md:w-8 md:h-8 rounded-lg text-white text-sm font-medium flex items-center justify-center flex-shrink-0" 
               style={{background: 'linear-gradient(90deg, rgba(0, 122, 255, 0.5) 0%, rgba(0, 91, 181, 0.5) 100%)'}} 
               aria-hidden="true">
            {userInitials}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm md:text-sm font-medium truncate text-gray-900 leading-tight">
              {userInfo.name}
            </p>
            {userInfo.email && (
              <p className="text-xs text-gray-600 truncate mt-0.5">
                {userInfo.email}
              </p>
            )}
          </div>
          <ChevronDown 
            className={cn(
              "w-5 h-5 md:w-4 md:h-4 transition-transform duration-200 text-gray-500 flex-shrink-0",
              isMenuOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        {isMenuOpen && (
          <div 
            className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
            role="menu"
            aria-orientation="vertical"
          >
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 px-4 py-3 md:px-3 md:py-2 text-sm hover:bg-gray-100 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 transition-colors min-h-[44px] md:min-h-[36px]"
              role="menuitem"
            >
              <User className="w-5 h-5 md:w-4 md:h-4" aria-hidden="true" />
              View Profile
            </button>
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center gap-3 px-4 py-3 md:px-3 md:py-2 text-sm hover:bg-gray-100 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 transition-colors min-h-[44px] md:min-h-[36px]"
              role="menuitem"
            >
              <Settings className="w-5 h-5 md:w-4 md:h-4" aria-hidden="true" />
              Settings
            </button>
            <hr className="my-1 border-gray-200" role="separator" />
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 md:px-3 md:py-2 text-sm hover:bg-red-50 text-red-600 text-left focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-colors min-h-[44px] md:min-h-[36px]"
              role="menuitem"
            >
              <LogOut className="w-5 h-5 md:w-4 md:h-4" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

SidebarProfileV2.displayName = 'SidebarProfileV2';

// Default navigation data
const DEFAULT_NAVIGATION: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: Home },
  { id: 'claims', label: 'Claims', href: '/claims', icon: FileText },
];

const DEFAULT_USER_INFO: UserInfo = {
  name: 'John Doe',
  email: 'john@example.com',
  initials: 'JD'
};

// Main Sidebar Component
export const SidebarV2 = memo<SidebarV2Props>(({ 
  layout = 'overlay',
  size = 'md',
  theme,
  isOpen = false,
  isCollapsed = false,
  onClose,
  onToggleCollapse,
  navigation = DEFAULT_NAVIGATION,
  showProfile = true,
  userInfo = DEFAULT_USER_INFO,
  className = '',
  children,
  'aria-label': ariaLabel = 'Main navigation',
  ...props
}) => {
  const { theme: contextTheme, isMobile, isTablet } = useNavigation();
  const pathname = usePathname();
  
  const currentTheme = theme || contextTheme || 'light';

  // Use keyboard hook
  useKeyboard(isOpen, onClose);

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
    // Only close sidebar on mobile when clicking navigation items with hrefs (actual navigation)
    if (item.href && (layout === 'overlay' || isMobile || isTablet) && onClose) {
      // Small delay to allow navigation to complete before closing
      setTimeout(() => onClose(), 150);
    }
  }, [layout, isMobile, isTablet, onClose]);

  const sidebarClasses = cn(
    styles.sidebar,
    getSidebarClasses({ 
      layout: layout as 'overlay' | 'push' | 'static', 
      size: size as 'sm' | 'md' | 'lg', 
      theme: currentTheme as 'light' | 'dark' 
    }),
    isCollapsed && styles.collapsed,
    isOpen ? styles.visible : styles.hidden,
    className,
    "transition-all duration-300 ease-in-out"
  );

  const navigationContent = useMemo(() => {
    if (children) return children;

    return (
      <nav className="px-0 space-y-4" aria-label={ariaLabel}>
        <SidebarSectionV2 isCollapsed={isCollapsed}>
          <div className="space-y-1">
            {navigation.map((item) => (
              <SidebarItemV2
                key={item.id}
                item={item}
                isActive={isItemActive(item)}
                isCollapsed={isCollapsed}
                theme={currentTheme}
                onItemClick={handleItemClick}
                isItemActive={isItemActive}
              />
            ))}
          </div>
        </SidebarSectionV2>
      </nav>
    );
  }, [children, ariaLabel, isCollapsed, navigation, isItemActive, currentTheme, handleItemClick]);

  return (
    <>
      {/* Backdrop for overlay layout */}
      {layout === 'overlay' && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 transition-opacity duration-300 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={sidebarClasses}
        role="navigation"
        aria-label={ariaLabel}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 md:h-14 px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <span className="font-semibold text-xl md:text-lg text-gray-900">Menu</span>
            {onClose && (
              <button
                onClick={onClose}
                className={cn(baseButtonStyles, "hover:bg-gray-100")}
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6 md:w-5 md:h-5 text-gray-700" />
              </button>
            )}
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {!isCollapsed ? (
                <Link href="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <div className="p-1 rounded-lg" style={{background: 'linear-gradient(90deg, rgba(0, 122, 255, 0.5) 0%, rgba(0, 91, 181, 0.5) 100%)'}}>
                    <Home className="w-5 h-5 md:w-4 md:h-4 text-white" />
                  </div>
                  <span className="font-semibold text-base text-gray-900">Claims App</span>
                </Link>
              ) : (
                <Link 
                  href="/" 
                  className="flex items-center justify-center p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  style={{background: 'linear-gradient(90deg, rgba(0, 122, 255, 0.5) 0%, rgba(0, 91, 181, 0.5) 100%)'}}
                  aria-label="Claims App home"
                >
                  <Home className="w-5 h-5 md:w-4 md:h-4 text-white" />
                </Link>
              )}
            </div>
            
            {/* Desktop Controls */}
            <div className="flex items-center gap-1">
              {onToggleCollapse && !isCollapsed && (
                <button
                  onClick={onToggleCollapse}
                  className={cn(baseButtonStyles, "hover:bg-gray-100")}
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                >
                  <ChevronRight className="w-5 h-5 md:w-4 md:h-4 text-gray-600" />
                </button>
              )}
              
              {onClose && layout === 'overlay' && (
                <button
                  onClick={onClose}
                  className={cn(baseButtonStyles, "hover:bg-gray-100")}
                  aria-label="Close sidebar"
                  title="Close sidebar"
                >
                  <X className="w-5 h-5 md:w-4 md:h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable area that respects profile section */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 min-h-0">
          <div className="pb-4"> {/* Add padding bottom to prevent content cutoff */}
            {navigationContent}
          </div>
        </div>

        {/* User Profile - Always visible at bottom */}
        {showProfile && (
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
            <SidebarProfileV2
              userInfo={userInfo}
              isCollapsed={isCollapsed}
              theme={currentTheme}
              onSignOut={() => console.log('Sign out clicked')}
            />
          </div>
        )}
      </aside>
    </>
  );
});

SidebarV2.displayName = 'SidebarV2';