"use client";

/**
 * Safe localStorage utilities with SSR compatibility and error handling
 */

// Feature detection for localStorage availability
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const storage = window.localStorage;
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
    // localStorage is not available (private mode, quota exceeded, etc.)
    return false;
  }
}

/**
 * Safely get an item from localStorage
 */
export function getStorageItem<T = string>(
  key: string, 
  defaultValue: T | null = null
): T | null {
  if (!isStorageAvailable()) return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    // Try to parse as JSON, fall back to string
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  } catch {
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) return false;
  
  try {
    const serializedValue = typeof value === 'string' 
      ? value 
      : JSON.stringify(value);
    
    window.localStorage.setItem(key, serializedValue);
    return true;
  } catch {
    // Failed to save (quota exceeded, etc.)
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  if (!isStorageAvailable()) return false;
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get multiple items from localStorage at once
 */
export function getStorageItems<T extends Record<string, unknown>>(
  keys: (keyof T)[], 
  defaults: T
): T {
  const result = { ...defaults };
  
  for (const key of keys) {
    const value = getStorageItem(String(key));
    if (value !== null) {
      (result as Record<string, unknown>)[key as string] = value;
    }
  }
  
  return result;
}

/**
 * Clear all navigation-related storage items
 */
export function clearNavigationStorage(): boolean {
  const keys = [
    'navigation-sidebar-collapsed',
    'navigation-theme',
    'navigation-sidebar-layout',
  ];
  
  let success = true;
  for (const key of keys) {
    if (!removeStorageItem(key)) {
      success = false;
    }
  }
  
  return success;
}

/**
 * Storage keys for navigation settings
 */
export const STORAGE_KEYS = {
  SIDEBAR_COLLAPSED: 'navigation-sidebar-collapsed',
  THEME: 'navigation-theme',
  SIDEBAR_LAYOUT: 'navigation-sidebar-layout',
  USER_PREFERENCES: 'navigation-user-preferences',
} as const;

/**
 * Type-safe navigation storage operations
 */
export interface NavigationStorageData {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  sidebarLayout: 'overlay' | 'push' | 'static';
}

export function getNavigationStorage(): Partial<NavigationStorageData> {
  return {
    sidebarCollapsed: getStorageItem<boolean>(STORAGE_KEYS.SIDEBAR_COLLAPSED) ?? undefined,
    theme: getStorageItem<'light' | 'dark'>(STORAGE_KEYS.THEME) ?? undefined,
    sidebarLayout: getStorageItem<'overlay' | 'push' | 'static'>(STORAGE_KEYS.SIDEBAR_LAYOUT) ?? undefined,
  };
}

export function setNavigationStorage(data: Partial<NavigationStorageData>): void {
  if (data.sidebarCollapsed !== undefined) {
    setStorageItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, data.sidebarCollapsed);
  }
  if (data.theme !== undefined) {
    setStorageItem(STORAGE_KEYS.THEME, data.theme);
  }
  if (data.sidebarLayout !== undefined) {
    setStorageItem(STORAGE_KEYS.SIDEBAR_LAYOUT, data.sidebarLayout);
  }
}