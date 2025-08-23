"use client";

import React from 'react';
import { Library001NavigationProvider, useLibrary001Sidebar, useLibrary001Theme } from './hooks';
import { Library001AppSidebar } from './components/library001-app-sidebar';
import { Library001MenuButton } from './components/library001-menu-button';
import type { Library001NavigationItem, Library001UserInfo } from './types';
import './styles/library001-variables.css';

// Layout content component that uses navigation hooks
function Library001NavigationLayoutContent({ 
  children,
  navigation,
  userInfo 
}: { 
  children: React.ReactNode;
  navigation?: Library001NavigationItem[];
  userInfo?: Library001UserInfo;
}) {
  const { isOpen, layout, toggle, close } = useLibrary001Sidebar();
  const { theme } = useLibrary001Theme();
  
  // Calculate main content margin for static sidebar and hamburger spacing
  const getMainContentStyle = () => {
    const styles: React.CSSProperties = {};
    
    // Mobile-first padding to prevent hamburger menu interference
    styles.paddingTop = '4.5rem'; // 72px on mobile for better clearance
    
    return styles;
  };

  return (
    <div className={`min-h-screen w-full relative ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Library001AppSidebar
        layout={layout}
        size="md"
        theme={theme}
        isOpen={isOpen}
        onClose={close}
        onToggle={toggle}
        showProfile={true}
        navigation={navigation}
        userInfo={userInfo}
      />

      {/* Floating Hamburger Menu Button */}
      <Library001MenuButton onClick={toggle} />

      {/* Main Content Area */}
      <main 
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 transition-all duration-300 md:pt-16"
        style={getMainContentStyle()}
      >
        {/* Decorative background elements */}
        <div className="fixed top-20 right-10 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-20 pointer-events-none" />
        <div className="fixed bottom-20 left-10 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 pointer-events-none" />
        {children}
      </main>
    </div>
  );
}

export interface Library001NavigationLayoutProps {
  children: React.ReactNode;
  navigation?: Library001NavigationItem[];
  userInfo?: Library001UserInfo;
  theme?: 'light' | 'dark';
  layout?: 'overlay' | 'push' | 'static';
  persistCollapsedState?: boolean;
  autoCollapseOnMobile?: boolean;
}

export function Library001NavigationLayout({ 
  children,
  navigation,
  userInfo,
  theme = 'light',
  layout = 'overlay',
  persistCollapsedState = false,
  autoCollapseOnMobile = true
}: Library001NavigationLayoutProps) {
  return (
    <Library001NavigationProvider
      defaultSettings={{
        persistCollapsedState,
        autoCollapseOnMobile,
        defaultSidebarLayout: layout,
        defaultTheme: theme,
      }}
    >
      <Library001NavigationLayoutContent
        navigation={navigation}
        userInfo={userInfo}
      >
        {children}
      </Library001NavigationLayoutContent>
    </Library001NavigationProvider>
  );
}

// Export default for convenience
export default Library001NavigationLayout;