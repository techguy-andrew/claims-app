"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  Search, 
  Settings, 
  User, 
  ChevronDown, 
  ChevronRight,
  LogOut,
  Menu
} from 'lucide-react';
import { createVariants, cn, type VariantProps } from './utils';
import styles from './navigation.module.css';

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
}

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavigationItem[];
  onClick?: () => void;
}

export interface UserInfo {
  name: string;
  email?: string;
  avatar?: string;
  initials?: string;
}

export interface SidebarItemProps {
  item: NavigationItem;
  isActive?: boolean;
  isCollapsed?: boolean;
  level?: number;
  theme?: 'light' | 'dark';
  onItemClick?: (item: NavigationItem) => void;
}

export interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
  className?: string;
}

// Sidebar Item Component
export const SidebarItem: React.FC<SidebarItemProps> = ({ 
  item, 
  isActive = false, 
  isCollapsed = false,
  level = 0,
  theme = 'light',
  onItemClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const indentLevel = level * 12; // 12px per level

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    if (item.onClick) {
      item.onClick();
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const itemContent = (
    <>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {item.icon && (
          <item.icon className={cn(
            "flex-shrink-0",
            isCollapsed ? "w-5 h-5" : "w-4 h-4"
          )} />
        )}
        {!isCollapsed && (
          <>
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span className="ml-auto flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
      </div>
      {hasChildren && !isCollapsed && (
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      )}
    </>
  );

  const itemClasses = cn(
    styles.navItem,
    theme === 'dark' && styles.dark,
    isActive && styles.active,
    isActive && theme === 'dark' && styles.dark,
    "relative"
  );

  const ItemWrapper = item.href ? Link : 'button';
  const itemProps = item.href 
    ? { href: item.href } 
    : { type: 'button' as const, onClick: handleClick };

  return (
    <div>
      <ItemWrapper
        {...itemProps}
        className={itemClasses}
        style={{ paddingLeft: `${12 + indentLevel}px` }}
        title={isCollapsed ? item.label : undefined}
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        {itemContent}
      </ItemWrapper>
      
      {/* Children */}
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="space-y-1">
          {item.children!.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              level={level + 1}
              theme={theme}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Sidebar Section Component
export const SidebarSection: React.FC<SidebarSectionProps> = ({ 
  title, 
  children, 
  isCollapsed = false,
  className 
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      {title && !isCollapsed && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
};

// User Profile Component
export const SidebarProfile: React.FC<{
  userInfo: UserInfo;
  isCollapsed?: boolean;
  theme?: 'light' | 'dark';
  onSignOut?: () => void;
}> = ({ userInfo, isCollapsed = false, theme = 'light', onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isCollapsed) {
    return (
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className={styles.userAvatar} title={userInfo.name}>
          {userInfo.initials || userInfo.name.charAt(0).toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(styles.userMenu, "w-full")}
          aria-expanded={isMenuOpen}
        >
          <div className={styles.userAvatar}>
            {userInfo.initials || userInfo.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium truncate">{userInfo.name}</p>
            {userInfo.email && (
              <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
            )}
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            isMenuOpen && "rotate-180"
          )} />
        </button>

        {/* User Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                // Handle profile click
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
            >
              <User className="w-4 h-4" />
              View Profile
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                // Handle settings click
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (onSignOut) onSignOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Sidebar Component
export const Sidebar: React.FC<SidebarProps> = ({ 
  layout = 'overlay',
  size = 'md',
  theme = 'light',
  isOpen = false,
  isCollapsed = false,
  onClose,
  onToggle,
  onToggleCollapse,
  navigation = [],
  showProfile = true,
  userInfo,
  className = '',
  children
}) => {
  const pathname = usePathname();

  // Default navigation if none provided
  const defaultNavigation: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/', icon: Home },
    { id: 'claims', label: 'Claims', href: '/claims', icon: FileText, badge: '3' },
    { id: 'inspections', label: 'Inspections', href: '/inspections', icon: Search },
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

  const navItems = navigation.length > 0 ? navigation : defaultNavigation;

  const defaultUserInfo: UserInfo = {
    name: 'John Doe',
    email: 'john@example.com',
    initials: 'JD'
  };

  const currentUserInfo = userInfo || defaultUserInfo;

  // Check if item is active
  const isItemActive = (item: NavigationItem): boolean => {
    if (item.href) {
      return pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    }
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return false;
  };

  const sidebarClasses = cn(
    styles.sidebar,
    getSidebarClasses({ layout, size, theme }),
    isCollapsed && styles.collapsed,
    isOpen ? styles.visible : styles.hidden,
    className
  );

  const handleItemClick = (item: NavigationItem) => {
    // Close sidebar on mobile when navigation item is clicked
    if (layout === 'overlay' && onClose) {
      onClose();
    }
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop for overlay layout */}
      {layout === 'overlay' && isOpen && typeof window !== 'undefined' && (
        <div 
          className={cn(styles.backdrop, styles.visible)}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={sidebarClasses}
        role="navigation"
        aria-label="Sidebar navigation"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {/* Mobile: Hamburger + Menu text */}
          <div className="lg:hidden flex items-center gap-3 flex-1">
            {onToggle && (
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                <div className={cn(styles.hamburger, isOpen && styles.open)}>
                  <div className={styles.hamburgerLine} />
                  <div className={styles.hamburgerLine} />
                  <div className={styles.hamburgerLine} />
                </div>
              </button>
            )}
            <span className="font-medium text-lg">Menu</span>
          </div>
          
          {/* Desktop: Full logo */}
          <div className="hidden lg:flex items-center gap-3 flex-1">
            {!isCollapsed ? (
              <Link href="/" className="flex items-center gap-3">
                <Home className="w-6 h-6" />
                <span className="font-bold text-lg">Claims App</span>
              </Link>
            ) : (
              <Link href="/" className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <Home className="w-5 h-5 text-white" />
              </Link>
            )}
          </div>
          
          {/* Collapse Toggle (Desktop only) */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:block p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {children || (
            <nav className="px-3 space-y-6">
              <SidebarSection isCollapsed={isCollapsed}>
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      isActive={isItemActive(item)}
                      isCollapsed={isCollapsed}
                      theme={theme}
                      onItemClick={handleItemClick}
                    />
                  ))}
                </div>
              </SidebarSection>
            </nav>
          )}
        </div>

        {/* Profile Section */}
        {showProfile && (
          <SidebarProfile
            userInfo={currentUserInfo}
            isCollapsed={isCollapsed}
            theme={theme}
            onSignOut={() => {
              // Handle sign out
              console.log('Sign out clicked');
            }}
          />
        )}
      </aside>
    </>
  );
};