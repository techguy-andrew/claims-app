"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { createVariants, cn, type VariantProps } from './utils';
import styles from './navigation.module.css';

const navbarVariants = {
  theme: {
    light: styles.light,
    dark: styles.dark,
    transparent: styles.transparent,
  },
  size: {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  },
  position: {
    fixed: styles.fixed,
    sticky: styles.sticky,
    relative: styles.relative,
  },
} as const;

const getNavbarClasses = createVariants(navbarVariants);

export interface NavbarProps extends VariantProps<typeof navbarVariants> {
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  logo?: React.ReactNode;
  children?: React.ReactNode;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
  className?: string;
}

export interface NavbarMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
  children?: React.ReactNode;
}

export interface NavbarItemProps {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: boolean;
  danger?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

// Mobile Nav Item Component
export const NavbarMobileItem: React.FC<NavbarItemProps> = ({ 
  icon: Icon, 
  label, 
  badge, 
  danger, 
  onClick,
  href,
  className = ''
}) => {
  const itemContent = (
    <>
      <div className="relative">
        {Icon && <Icon className="w-5 h-5" />}
        {badge && <span className={styles.notificationBadge} />}
      </div>
      <span>{label}</span>
    </>
  );

  const itemClasses = cn(
    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
    danger 
      ? 'text-red-600 hover:bg-red-50' 
      : 'hover:bg-gray-100 dark:hover:bg-gray-800',
    className
  );

  if (href) {
    return (
      <Link href={href} className={itemClasses} onClick={onClick}>
        {itemContent}
      </Link>
    );
  }

  return (
    <button className={itemClasses} onClick={onClick}>
      {itemContent}
    </button>
  );
};

// Mobile Menu Component
export const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  theme = 'light',
  children 
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(styles.backdrop, styles.visible)}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Mobile Menu */}
      <div className={cn(
        'fixed inset-x-0 top-16 bottom-0 z-40 md:hidden',
        theme === 'dark' ? 'bg-gray-900' : 'bg-white',
        styles.slideIn
      )}>
        <div className="p-4 space-y-2">
          {children || (
            <>
              <NavbarMobileItem icon={Search} label="Search" />
              <NavbarMobileItem icon={Bell} label="Notifications" badge />
              <NavbarMobileItem icon={User} label="Profile" />
              <NavbarMobileItem icon={Settings} label="Settings" />
              <div className="border-t pt-2 mt-4">
                <NavbarMobileItem icon={LogOut} label="Sign Out" danger />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Main Navbar Component
export const Navbar: React.FC<NavbarProps> = ({ 
  theme = 'light',
  size = 'md',
  position = 'fixed',
  showSearch = true,
  showNotifications = true,
  showUserMenu = true,
  logo,
  children,
  onMenuToggle,
  isMenuOpen = false,
  className = '',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navbarClasses = cn(
    styles.navbar,
    getNavbarClasses({ theme, size, position }),
    className
  );

  const handleMenuToggle = () => {
    if (onMenuToggle) {
      onMenuToggle();
    } else {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const currentMenuState = onMenuToggle ? isMenuOpen : isMobileMenuOpen;

  return (
    <>
      <nav className={navbarClasses} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 h-full">
          <div className="flex items-center h-full">
            {/* Mobile Menu Button - Far Left */}
            <button
              onClick={handleMenuToggle}
              className={cn(styles.mobileNav, "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-3")}
              aria-label={currentMenuState ? 'Close menu' : 'Open menu'}
              aria-expanded={currentMenuState}
            >
              <div className={cn(styles.hamburger, currentMenuState && 'open')}>
                <div className={styles.hamburgerLine} />
                <div className={styles.hamburgerLine} />
                <div className={styles.hamburgerLine} />
              </div>
            </button>

            {/* Logo Section - No Home Icon */}
            <div className="flex items-center flex-1">
              {logo || (
                <Link href="/" className={styles.logo}>
                  <span className="font-bold text-lg">Claims App</span>
                </Link>
              )}
            </div>

            {/* Desktop Navigation - Right Side */}
            <div className={styles.desktopNav}>
              <div className="flex items-center gap-4">
                {showSearch && (
                  <div className={styles.search}>
                    <Search className="w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className={styles.searchInput}
                      aria-label="Search"
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {showNotifications && (
                    <button 
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                      aria-label="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      <span className={styles.notificationBadge} />
                    </button>
                  )}
                  
                  {showUserMenu && (
                    <div className={styles.userMenu}>
                      <div className={styles.userAvatar}>
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium hidden lg:block">John Doe</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom children content */}
        {children}
      </nav>

      {/* Mobile Menu (only if not using external menu control) */}
      {!onMenuToggle && (
        <NavbarMobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={handleMobileMenuClose}
          theme={theme}
        />
      )}
    </>
  );
};

// Button component for navbar actions
export interface NavbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export const NavbarButton: React.FC<NavbarButtonProps> = ({ 
  variant = 'ghost', 
  size = 'md', 
  icon: Icon,
  children, 
  className,
  ...props 
}) => {
  const buttonVariants = {
    variant: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
      danger: 'bg-red-600 text-white hover:bg-red-700'
    },
    size: {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2',
      lg: 'px-4 py-3 text-lg'
    }
  };

  return (
    <button 
      className={cn(
        'inline-flex items-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};