"use client";

import { useEffect, useRef } from 'react';

/**
 * Hook for focus trapping within a container
 * Ensures focus stays within the specified element when active
 */
export function useFocusTrap(active: boolean = false) {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    
    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Get all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ];

      return Array.from(
        container.querySelectorAll(focusableSelectors.join(', '))
      ).filter(
        (element) => {
          // Additional checks for truly focusable elements
          const el = element as HTMLElement;
          return (
            el.offsetWidth > 0 ||
            el.offsetHeight > 0 ||
            el === document.activeElement
          );
        }
      ) as HTMLElement[];
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus the first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to the previously focused element
      if (previousActiveElement.current && previousActiveElement.current.focus) {
        previousActiveElement.current.focus();
      }
    };
  }, [active]);

  return containerRef;
}

/**
 * Hook for managing focus restoration
 * Useful for dialogs, modals, and overlays
 */
export function useFocusRestore(active: boolean = false) {
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (active) {
      // Store the currently focused element when becoming active
      triggerRef.current = document.activeElement as HTMLElement;
    } else if (triggerRef.current) {
      // Restore focus when becoming inactive
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [active]);

  return {
    /**
     * Call this to manually set the element that should receive focus
     * when the component becomes inactive
     */
    setTriggerElement: (element: HTMLElement | null) => {
      triggerRef.current = element;
    },
  };
}

/**
 * Hook for managing inert content
 * Marks content as inert when overlay is active
 */
export function useInertContent(active: boolean = false, excludeSelector?: string) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const body = document.body;
    const children = Array.from(body.children) as HTMLElement[];

    if (active) {
      children.forEach((child) => {
        // Skip if element matches exclude selector
        if (excludeSelector && child.matches(excludeSelector)) {
          return;
        }

        // Set inert if supported, otherwise use aria-hidden
        if ('inert' in child) {
          (child as HTMLElement & { inert?: boolean }).inert = true;
        } else {
          (child as HTMLElement).setAttribute('aria-hidden', 'true');
        }
      });
    } else {
      // Remove inert/aria-hidden from all children
      children.forEach((child) => {
        if ('inert' in child) {
          (child as HTMLElement & { inert?: boolean }).inert = false;
        } else {
          (child as HTMLElement).removeAttribute('aria-hidden');
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (!active) {
        children.forEach((child) => {
          if ('inert' in child) {
            (child as HTMLElement & { inert?: boolean }).inert = false;
          } else {
            (child as HTMLElement).removeAttribute('aria-hidden');
          }
        });
      }
    };
  }, [active, excludeSelector]);
}

/**
 * Hook for scroll locking
 * Prevents body scroll when overlay is active
 */
export function useScrollLock(active: boolean = false) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const body = document.body;
    const html = document.documentElement;

    if (active) {
      // Store original styles
      const originalBodyOverflow = body.style.overflow;
      const originalHtmlOverflow = html.style.overflow;
      const originalBodyPaddingRight = body.style.paddingRight;

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Apply scroll lock
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
      
      // Compensate for scrollbar width
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // Cleanup function
      return () => {
        body.style.overflow = originalBodyOverflow;
        html.style.overflow = originalHtmlOverflow;
        body.style.paddingRight = originalBodyPaddingRight;
      };
    }
  }, [active]);
}

/**
 * Combined hook that provides all focus and accessibility management
 */
export function useOverlayAccessibility(active: boolean = false, options?: {
  excludeFromInert?: string;
  enableFocusTrap?: boolean;
  enableScrollLock?: boolean;
}) {
  const {
    excludeFromInert,
    enableFocusTrap = true,
    enableScrollLock = true,
  } = options || {};

  const focusTrapRef = useFocusTrap(active && enableFocusTrap);
  const { setTriggerElement } = useFocusRestore(active);
  
  useInertContent(active, excludeFromInert);
  useScrollLock(active && enableScrollLock);

  return {
    containerRef: focusTrapRef,
    setTriggerElement,
  };
}