"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  container?: Element | null;
}

/**
 * Portal component for rendering content outside the normal React tree
 * Used for overlays, modals, and navigation that need to escape z-index stacking
 */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  useEffect(() => {
    // Ensure we're on the client side before accessing document
    setMounted(true);
    
    // Use provided container or fall back to document.body
    const targetContainer = container || document.body;
    setPortalContainer(targetContainer);

    return () => {
      setMounted(false);
    };
  }, [container]);

  // Don't render anything during SSR or before mounting
  if (!mounted || !portalContainer) {
    return null;
  }

  return createPortal(children, portalContainer);
}

/**
 * Hook to create a stable portal container element
 * Useful when you need a dedicated container for portaled content
 */
export function usePortalContainer(id: string = 'portal-root') {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(id) as HTMLDivElement;
    
    if (!element) {
      element = document.createElement('div');
      element.id = id;
      element.style.position = 'absolute';
      element.style.top = '0';
      element.style.left = '0';
      element.style.zIndex = 'var(--z-portal, 9999)';
      document.body.appendChild(element);
    }

    setContainer(element);

    return () => {
      // Clean up if component unmounts and container is empty
      if (element && element.children.length === 0) {
        element.remove();
      }
    };
  }, [id]);

  return container;
}