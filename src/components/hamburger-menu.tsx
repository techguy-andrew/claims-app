"use client"

import React from 'react';
import { useCustomSidebar } from '@/components/custom-sidebar';
import styles from './ui/Button.module.css';

interface HamburgerMenuProps {
  className?: string;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ className = '' }) => {
  const { isOpen, toggle, isMobile, isTablet } = useCustomSidebar();

  // Only show hamburger menu on mobile and tablet
  if (!isMobile && !isTablet) {
    return null;
  }

  const handleClick = () => {
    toggle();
    
    // If opening sidebar, focus the first navigation item
    if (!isOpen) {
      // Small delay to allow sidebar to render
      setTimeout(() => {
        const firstNavLink = document.querySelector('[role="navigation"] a') as HTMLElement;
        if (firstNavLink) {
          firstNavLink.focus();
        }
      }, 50);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${styles.button} ${styles.ghost} ${styles.small}
        flex items-center justify-center
        w-10 h-10 rounded-lg touch-target
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transition-all duration-200 ease-in-out
        ${className}
      `}
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isOpen}
      aria-controls="main-navigation"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col justify-center">
          {/* Top line */}
          <div
            className={`
              h-0.5 bg-gray-700 rounded-full transition-all duration-300 ease-in-out
              ${isOpen 
                ? 'rotate-45 translate-y-0.5 w-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' 
                : 'rotate-0 translate-y-0 w-6 mb-1'
              }
            `}
          />
          
          {/* Middle line */}
          <div
            className={`
              h-0.5 bg-gray-700 rounded-full transition-all duration-300 ease-in-out
              ${isOpen 
                ? 'opacity-0 w-0' 
                : 'opacity-100 w-6 mb-1'
              }
            `}
          />
          
          {/* Bottom line */}
          <div
            className={`
              h-0.5 bg-gray-700 rounded-full transition-all duration-300 ease-in-out
              ${isOpen 
                ? '-rotate-45 w-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' 
                : 'rotate-0 translate-y-0 w-6'
              }
            `}
          />
        </div>
      </div>
    </button>
  );
};