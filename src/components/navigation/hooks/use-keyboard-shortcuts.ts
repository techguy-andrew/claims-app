"use client";

import { useEffect, useRef } from 'react';

interface KeyboardShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  allowInInputs?: boolean;
  allowInContentEditable?: boolean;
  requireFocus?: boolean;
}

interface KeyboardShortcut {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: (event: KeyboardEvent) => void;
  options?: KeyboardShortcutOptions;
}

/**
 * Hook for managing keyboard shortcuts with context awareness
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const shortcutsRef = useRef<KeyboardShortcut[]>([]);
  
  // Update shortcuts ref to avoid stale closures
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if any modals are open or if we're in a restricted context
      if (isRestrictedContext()) {
        return;
      }

      for (const shortcut of shortcutsRef.current) {
        if (matchesShortcut(event, shortcut)) {
          const { options = {} } = shortcut;
          
          // Check if shortcut is enabled
          if (options.enabled === false) continue;
          
          // Check input restrictions
          if (!shouldAllowInCurrentElement(event, options)) continue;
          
          // Check focus requirements
          if (options.requireFocus && !document.hasFocus()) continue;

          // Prevent default and stop propagation if requested
          if (options.preventDefault !== false) {
            event.preventDefault();
          }
          if (options.stopPropagation) {
            event.stopPropagation();
          }

          // Execute handler
          shortcut.handler(event);
          break; // Only execute first matching shortcut
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

/**
 * Check if keyboard shortcuts should be disabled in current context
 */
function isRestrictedContext(): boolean {
  // Check if any modal, dialog, or overlay is open
  const modalElements = document.querySelectorAll('[role="dialog"], [role="alertdialog"], .modal-open');
  if (modalElements.length > 0) {
    return true;
  }

  // Check if we're in a form with unsaved changes (could be extended)
  const forms = document.querySelectorAll('form[data-unsaved="true"]');
  if (forms.length > 0) {
    return true;
  }

  return false;
}

/**
 * Check if the shortcut matches the current key event
 */
function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  // Check key match (case insensitive)
  if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
    return false;
  }

  // Check modifier keys
  if (!!shortcut.meta !== !!(event.metaKey)) return false;
  if (!!shortcut.ctrl !== !!(event.ctrlKey)) return false;
  if (!!shortcut.shift !== !!(event.shiftKey)) return false;
  if (!!shortcut.alt !== !!(event.altKey)) return false;

  return true;
}

/**
 * Check if shortcut should be allowed in the current element
 */
function shouldAllowInCurrentElement(event: KeyboardEvent, options: KeyboardShortcutOptions): boolean {
  const target = event.target as HTMLElement;
  
  if (!target) return true;

  // Check if we're in an input element
  const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
  if (isInput && !options.allowInInputs) {
    return false;
  }

  // Check if we're in a content editable element
  const isContentEditable = target.isContentEditable || target.closest('[contenteditable="true"]');
  if (isContentEditable && !options.allowInContentEditable) {
    return false;
  }

  return true;
}

/**
 * Predefined shortcut configurations for common navigation actions
 */
export const createNavShortcuts = (actions: {
  toggleSidebar?: () => void;
  closeSidebar?: () => void;
  toggleTheme?: () => void;
  focusSearch?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [];

  if (actions.toggleSidebar) {
    shortcuts.push({
      key: 'b',
      meta: true, // Cmd on Mac
      handler: actions.toggleSidebar,
      options: {
        allowInInputs: false,
        allowInContentEditable: false,
      }
    });
    
    shortcuts.push({
      key: 'b',
      ctrl: true, // Ctrl on Windows/Linux
      handler: actions.toggleSidebar,
      options: {
        allowInInputs: false,
        allowInContentEditable: false,
      }
    });
  }

  if (actions.closeSidebar) {
    shortcuts.push({
      key: 'Escape',
      handler: actions.closeSidebar,
      options: {
        allowInInputs: true,
        allowInContentEditable: true,
      }
    });
  }

  if (actions.toggleTheme) {
    shortcuts.push({
      key: 'd',
      meta: true,
      shift: true,
      handler: actions.toggleTheme,
      options: {
        allowInInputs: false,
        allowInContentEditable: false,
      }
    });
  }

  if (actions.focusSearch) {
    shortcuts.push({
      key: 'k',
      meta: true,
      handler: actions.focusSearch,
      options: {
        allowInInputs: false,
        allowInContentEditable: false,
      }
    });
    
    shortcuts.push({
      key: '/',
      handler: actions.focusSearch,
      options: {
        allowInInputs: false,
        allowInContentEditable: false,
      }
    });
  }

  return shortcuts;
};

/**
 * Hook specifically for navigation shortcuts
 */
export function useNavigationShortcuts(actions: {
  toggleSidebar?: () => void;
  closeSidebar?: () => void;
  toggleTheme?: () => void;
  focusSearch?: () => void;
}) {
  const shortcuts = createNavShortcuts(actions);
  useKeyboardShortcuts(shortcuts);
}

/**
 * Hook for roving tabindex (keyboard navigation within groups)
 */
export function useRovingTabIndex<T extends HTMLElement = HTMLElement>(
  items: T[],
  activeIndex: number,
  onIndexChange: (index: number) => void,
  options: {
    enabled?: boolean;
    loop?: boolean;
    horizontal?: boolean;
    vertical?: boolean;
  } = {}
) {
  const { enabled = true, loop = true, horizontal = true, vertical = true } = options;

  useEffect(() => {
    if (!enabled || items.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const currentIndex = items.indexOf(target as T);
      
      if (currentIndex === -1) return;

      let newIndex = currentIndex;
      let handled = false;

      switch (event.key) {
        case 'ArrowRight':
          if (horizontal) {
            newIndex = loop 
              ? (currentIndex + 1) % items.length 
              : Math.min(currentIndex + 1, items.length - 1);
            handled = true;
          }
          break;
        case 'ArrowLeft':
          if (horizontal) {
            newIndex = loop 
              ? (currentIndex - 1 + items.length) % items.length 
              : Math.max(currentIndex - 1, 0);
            handled = true;
          }
          break;
        case 'ArrowDown':
          if (vertical) {
            newIndex = loop 
              ? (currentIndex + 1) % items.length 
              : Math.min(currentIndex + 1, items.length - 1);
            handled = true;
          }
          break;
        case 'ArrowUp':
          if (vertical) {
            newIndex = loop 
              ? (currentIndex - 1 + items.length) % items.length 
              : Math.max(currentIndex - 1, 0);
            handled = true;
          }
          break;
        case 'Home':
          newIndex = 0;
          handled = true;
          break;
        case 'End':
          newIndex = items.length - 1;
          handled = true;
          break;
      }

      if (handled) {
        event.preventDefault();
        onIndexChange(newIndex);
        items[newIndex]?.focus();
      }
    };

    // Add event listeners to all items
    items.forEach(item => {
      item.addEventListener('keydown', handleKeyDown);
    });

    return () => {
      items.forEach(item => {
        item.removeEventListener('keydown', handleKeyDown);
      });
    };
  }, [items, activeIndex, onIndexChange, enabled, loop, horizontal, vertical]);

  // Update tabindex for all items
  useEffect(() => {
    items.forEach((item, index) => {
      item.tabIndex = index === activeIndex ? 0 : -1;
    });
  }, [items, activeIndex]);
}