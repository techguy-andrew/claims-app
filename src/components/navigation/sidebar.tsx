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

export interface SidebarProps extends VariantProps<typeof sidebarVariants> {
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

// Sidebar Item Component
export const SidebarItem = memo<SidebarItemProps>(({ 
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
  const indentLevel = level * 12;

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(prev => !prev);
      return;
    }
    
    // For items with hrefs, let the Link handle navigation
    // For items with onClick, call it and prevent default
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
    }
    
    // Always call onItemClick for sidebar management
    onItemClick?.(item);
  }, [hasChildren, item, onItemClick]);

  const itemContent = useMemo(() => (
    <>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {item.icon && (
          <item.icon 
            className={cn(
              "flex-shrink-0",
              isCollapsed ? "w-5 h-5" : "w-4 h-4",
              item.disabled && "opacity-50"
            )} 
            aria-hidden="true"
          />
        )}
        {!isCollapsed && (
          <>
            <span className={cn(
              "truncate", 
              item.disabled && "opacity-50"
            )}>
              {item.label}
            </span>
            {item.badge && (
              <span className="ml-auto flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {item.badge}
              </span>
            )}
          </>
        )}
      </div>
      {hasChildren && !isCollapsed && (
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          )}
        </div>
      )}
    </>
  ), [item, isCollapsed, isExpanded, hasChildren]);

  const itemClasses = cn(
    "flex items-center gap-3 px-4 py-3 mx-2 rounded-2xl transition-all duration-300",
    "hover:-translate-y-0.5 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/20",
    isActive 
      ? "bg-gradient-to-r from-blue-600 to-blue-700 !text-white shadow-lg [&>*]:!text-white [&_span]:!text-white" 
      : "bg-white/60 backdrop-blur-xl text-gray-700 hover:bg-white/80 hover:shadow-md",
    item.disabled && "opacity-50 cursor-not-allowed hover:transform-none hover:scale-100"
  );

  const buttonProps = useMemo(() => ({
    className: itemClasses,
    style: { paddingLeft: `${12 + indentLevel}px` },
    title: isCollapsed ? item.label : undefined,
    'aria-expanded': hasChildren ? isExpanded : undefined,
    'aria-disabled': item.disabled,
    onClick: handleClick,
  }), [itemClasses, indentLevel, isCollapsed, item.label, hasChildren, isExpanded, item.disabled, handleClick]);

  const handleLinkClick = useCallback(() => {
    // For navigation links, call onItemClick to handle sidebar closing
    onItemClick?.(item);
  }, [item, onItemClick]);

  const ItemElement = useMemo(() => {
    if (item.href && !item.disabled) {
      return (
        <Link
          href={item.href}
          className={itemClasses}
          style={{ paddingLeft: `${12 + indentLevel}px` }}
          title={isCollapsed ? item.label : undefined}
          aria-current={isActive ? 'page' : undefined}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-disabled={item.disabled}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
          onClick={handleLinkClick}
        >
          {itemContent}
        </Link>
      );
    }

    return (
      <button
        type="button"
        disabled={item.disabled}
        {...buttonProps}
      >
        {itemContent}
      </button>
    );
  }, [item, itemClasses, indentLevel, isCollapsed, isActive, hasChildren, isExpanded, buttonProps, itemContent, handleLinkClick]);

  return (
    <div>
      {ItemElement}
      
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="space-y-1" role="group" aria-label={`${item.label} submenu`}>
          {item.children!.map((child) => (
            <SidebarItem
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
      )}
    </div>
  );
});

SidebarItem.displayName = 'SidebarItem';

// Sidebar Section Component
export const SidebarSection = memo<SidebarSectionProps>(({ 
  title, 
  children, 
  isCollapsed = false,
  className 
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      {title && !isCollapsed && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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

SidebarSection.displayName = 'SidebarSection';

// User Profile Component
export const SidebarProfile = memo<{
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
        <div 
          className={cn(styles.userAvatar, "cursor-pointer")} 
          title={userInfo.name}
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleMenu();
            }
          }}
        >
          {userInitials}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 mt-4 border-t border-gray-100/50" ref={menuRef}>
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="w-full flex items-center gap-3 p-4 bg-white/60 backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
              "w-4 h-4 transition-transform duration-300 text-gray-500 flex-shrink-0",
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

// Main Sidebar Component
export const Sidebar = memo<SidebarProps>(({ 
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
      <nav className="px-0 space-y-6" aria-label={ariaLabel}>
        <SidebarSection isCollapsed={isCollapsed}>
          <div className="space-y-2">
            {navigation.map((item, index) => (
              <div 
                key={item.id}
                style={{ animation: `slideUp 0.6s ease-out ${(index * 100) + 200}ms both` }}
              >
                <SidebarItem
                  item={item}
                  isActive={isItemActive(item)}
                  isCollapsed={isCollapsed}
                  theme={currentTheme}
                  onItemClick={handleItemClick}
                  isItemActive={isItemActive}
                />
              </div>
            ))}
          </div>
        </SidebarSection>
      </nav>
    );
  }, [children, ariaLabel, isCollapsed, navigation, isItemActive, currentTheme, handleItemClick]);

  return (
    <>
      {/* Animation styles */}
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

      {/* Glass Morphism Backdrop for overlay layout */}
      {layout === 'overlay' && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 z-999"
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
        {/* Floating Header */}
        <div className="flex items-center h-20 px-6 pt-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <span className="font-bold text-xl text-gray-900">Menu</span>
            {onClose && (
              <button
                onClick={onClose}
                className="p-3 bg-white/80 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {!isCollapsed ? (
                <Link href="/" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/60 backdrop-blur-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-gray-900">Claims App</span>
                </Link>
              ) : (
                <Link 
                  href="/" 
                  className="flex items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  aria-label="Claims App home"
                >
                  <Home className="w-5 h-5 text-white" />
                </Link>
              )}
            </div>
            
            {/* Floating Desktop Controls */}
            <div className="flex items-center gap-2">
              {onToggleCollapse && !isCollapsed && (
                <button
                  onClick={onToggleCollapse}
                  className="p-2 bg-white/60 backdrop-blur rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              )}
              
              {onClose && layout === 'overlay' && (
                <button
                  onClick={onClose}
                  className="p-2 bg-white/60 backdrop-blur rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  aria-label="Close sidebar"
                  title="Close sidebar"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto py-6">
          {navigationContent}
        </div>

        {/* User Profile */}
        {showProfile && (
          <SidebarProfile
            userInfo={userInfo}
            isCollapsed={isCollapsed}
            theme={currentTheme}
            onSignOut={() => console.log('Sign out clicked')}
          />
        )}
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';