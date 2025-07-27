"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Search, Filter, Plus, MoreHorizontal } from 'lucide-react';
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
          const ItemComponent = item.href ? Link : 'span';
          const itemProps = item.href ? { href: item.href } : {};

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" aria-hidden="true" />
              )}
              <ItemComponent
                {...itemProps}
                className={cn(
                  "flex items-center gap-1 transition-colors",
                  isLast 
                    ? "text-gray-900 dark:text-white font-medium" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                  item.href && "hover:underline"
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </ItemComponent>
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
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };

  const baseClasses = cn(
    "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
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
        "relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        isActive
          ? "bg-blue-100 text-blue-700 border border-blue-200"
          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
        className
      )}
      aria-label="Open filters"
    >
      <Filter className="w-4 h-4" />
      Filter
      {count !== undefined && count > 0 && (
        <span className="ml-1 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
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
  className = '',
  children
}) => {
  const topbarClasses = cn(
    styles.topbar,
    getTopbarClasses({ size, theme }),
    className
  );

  return (
    <div className={topbarClasses}>
      {/* Left Section */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <TopbarBreadcrumbs items={breadcrumbs} className="mb-1" />
        )}
        
        {/* Title & Subtitle */}
        {(title || subtitle) && (
          <div className="space-y-1">
            {title && (
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
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
        {/* Search */}
        {showSearch && (
          <TopbarSearch
            placeholder={searchPlaceholder}
            onSearch={onSearch}
            className="hidden sm:block w-64"
          />
        )}
        
        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
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