"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
}

const CustomSidebarContext = createContext<SidebarContextType | undefined>(undefined);

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

export const CustomSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Responsive breakpoint detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.mobile) {
        setScreenSize('mobile');
      } else if (width < BREAKPOINTS.tablet) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close sidebar when switching to desktop
  useEffect(() => {
    if (screenSize === 'desktop') {
      setIsOpen(true); // Always open on desktop
    } else if (screenSize === 'mobile' || screenSize === 'tablet') {
      setIsOpen(false); // Closed by default on mobile/tablet
    }
  }, [screenSize]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Close sidebar on Escape key for mobile/tablet
      if (event.key === 'Escape' && isOpen && (screenSize === 'mobile' || screenSize === 'tablet')) {
        setIsOpen(false);
        
        // Return focus to hamburger button after closing
        const hamburgerButton = document.querySelector('[aria-label*="Open navigation menu"]') as HTMLElement;
        if (hamburgerButton) {
          hamburgerButton.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, screenSize]);


  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const contextValue: SidebarContextType = {
    isOpen,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    toggle,
    open,
    close,
    setOpen: setIsOpen,
  };

  return (
    <CustomSidebarContext.Provider value={contextValue}>
      {children}
    </CustomSidebarContext.Provider>
  );
};

export const useCustomSidebar = () => {
  const context = useContext(CustomSidebarContext);
  if (context === undefined) {
    throw new Error('useCustomSidebar must be used within a CustomSidebarProvider');
  }
  return context;
};