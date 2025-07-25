"use client"

import React from 'react';
import { useCustomSidebar } from '@/components/custom-sidebar';
import { HamburgerMenu } from '@/components/hamburger-menu';

export const MobileHeader: React.FC = () => {
  const { isOpen, isMobile, isTablet } = useCustomSidebar();

  // Only show on mobile and tablet
  if (!isMobile && !isTablet) {
    return null;
  }

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0" style={{ zIndex: 30 }}>
      <HamburgerMenu />
      <h2 className="text-lg font-semibold text-gray-900">
        {isOpen ? 'Menu' : 'Claims App'}
      </h2>
      <div className="w-10" /> {/* Spacer for centering */}
    </div>
  );
};