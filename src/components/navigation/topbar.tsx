"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Search, Filter, MoreHorizontal, Menu } from 'lucide-react';
import { createVariants, cn, type VariantProps } from './utils';
import styles from './navigation.module.css';

const topbarVariants = {
  size: {
    compact: styles.compact,
    default: '',
    spacious: styles.spacious,
  },
  theme: {
    light: '',
    dark: styles.dark,
  },
} as const;

const getTopbarClasses = createVariants(topbarVariants);

export interface TopbarProps extends VariantProps<typeof topbarVariants> {
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  searchPlaceholder?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  showMenuButton?: boolean;
  onMenuToggle?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface TopbarActionProps {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
}

export interface TopbarSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export interface TopbarBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

// Breadcrumbs Component
export const TopbarBreadcrumbs: React.FC<TopbarBreadcrumbsProps> = ({ 
  items, 
  className 
}) => {
  if (!items.length) return null;

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" aria-hidden="true" />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 transition-colors",
                    isLast 
                      ? "text-gray-900 dark:text-white font-medium" 
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                    "hover:underline"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "flex items-center gap-1 transition-colors",
                    isLast 
                      ? "text-gray-900 dark:text-white font-medium" 
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Search Component
export const TopbarSearch: React.FC<TopbarSearchProps> = ({ 
  placeholder = "Search...", 
  onSearch,
  className 
}) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounced search
    if (onSearch) {
      const timeoutId = setTimeout(() => {
        onSearch(value);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className={styles.search}>
        <Search className="w-4 h-4 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn(styles.searchInput, "w-full")}
          aria-label="Search"
        />
      </div>
    </form>
  );
};

// Action Button Component
export const TopbarAction: React.FC<TopbarActionProps> = ({ 
  icon: Icon, 
  label, 
  variant = 'secondary',
  onClick,
  href,
  disabled = false,
  className 
}) => {
  const buttonVariants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]',
    secondary: 'bg-white/80 backdrop-blur-xl text-gray-700 border border-gray-100/50 shadow-sm hover:shadow-md hover:-translate-y-0.5',
    ghost: 'bg-white/60 backdrop-blur-xl text-gray-700 hover:bg-white/80 hover:scale-[1.02]'
  };

  const baseClasses = cn(
    "inline-flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    buttonVariants[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      aria-label={label}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
};

// Filter Button Component
export const TopbarFilter: React.FC<{
  isActive?: boolean;
  count?: number;
  onClick?: () => void;
  className?: string;
}> = ({ isActive = false, count, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2",
        isActive
          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
          : "bg-white/80 backdrop-blur-xl text-gray-700 border border-gray-100/50 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        className
      )}
      aria-label="Open filters"
    >
      <Filter className="w-4 h-4" />
      Filter
      {count !== undefined && count > 0 && (
        <span className="ml-1 bg-white/20 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
};

// Actions Menu Component
export const TopbarActionsMenu: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="More actions"
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
            {children}
          </div>
        </>
      )}
    </div>
  );
};

// Main TopBar Component
export const TopBar: React.FC<TopbarProps> = ({ 
  size = 'default',
  theme = 'light',
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  searchPlaceholder = "Search...",
  showSearch = false,
  onSearch,
  showMenuButton = false,
  onMenuToggle,
  className = '',
  children
}) => {
  return (
    <div className="relative">
      {/* Floating Glass Morphism Header */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-100/50 to-transparent pointer-events-none" />
      
      <div className={cn(
        "relative bg-white/80 backdrop-blur-xl border border-gray-100/50 mx-3 sm:mx-6 mt-4 sm:mt-6 rounded-2xl",
        "shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300",
        "hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)]",
        className
      )}>
        <div className="px-4 sm:px-6 py-4">
          {/* Left Section */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Floating Menu Button */}
            {showMenuButton && onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-3 bg-white/80 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            )}

            <div className="flex-1 min-w-0">
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <TopbarBreadcrumbs items={breadcrumbs} className="mb-2" />
              )}
              
              {/* Title & Subtitle */}
              {(title || subtitle) && (
                <div className="space-y-1">
                  {title && (
                    <h1 className="text-2xl font-bold text-gray-900 truncate">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-sm text-gray-600 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
              
              {/* Custom Content */}
              {children}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Floating Search */}
              {showSearch && (
                <div className="relative hidden sm:block">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    onChange={(e) => onSearch?.(e.target.value)}
                    className="pl-11 pr-4 py-3 w-48 md:w-64 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-300 text-sm"
                  />
                </div>
              )}
              
              {/* Mobile Search Toggle */}
              {showSearch && (
                <button className="sm:hidden p-3 bg-white/80 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <Search className="h-5 w-5 text-gray-600" />
                </button>
              )}
              
              {/* Floating Actions */}
              {actions && (
                <div className="flex items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pre-built TopBar Variants
export const TopBarWithBreadcrumbs: React.FC<{
  breadcrumbs: BreadcrumbItem[];
  title: string;
  actions?: React.ReactNode;
}> = ({ breadcrumbs, title, actions }) => (
  <TopBar breadcrumbs={breadcrumbs} title={title} actions={actions} />
);

export const TopBarWithSearch: React.FC<{
  title: string;
  onSearch: (query: string) => void;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
}> = ({ title, onSearch, searchPlaceholder, actions }) => (
  <TopBar 
    title={title} 
    showSearch 
    onSearch={onSearch}
    searchPlaceholder={searchPlaceholder}
    actions={actions} 
  />
);

export const TopBarWithFilter: React.FC<{
  title: string;
  filterCount?: number;
  isFilterActive?: boolean;
  onFilterClick?: () => void;
  actions?: React.ReactNode;
}> = ({ title, filterCount, isFilterActive, onFilterClick, actions }) => (
  <TopBar 
    title={title}
    actions={
      <div className="flex items-center gap-2">
        <TopbarFilter 
          count={filterCount}
          isActive={isFilterActive}
          onClick={onFilterClick}
        />
        {actions}
      </div>
    }
  />
);