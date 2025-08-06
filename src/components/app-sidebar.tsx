"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui';
import { useCustomSidebar } from '@/components/custom-sidebar';

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isOpen, close, isMobile, isTablet, isDesktop } = useCustomSidebar();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Claims', href: '/claims', icon: '📋' },
  ];

  // Handle navigation link clicks - close sidebar on mobile/tablet
  const handleNavClick = () => {
    if (isMobile || isTablet) {
      close();
      
      // Return focus to hamburger button after navigation
      setTimeout(() => {
        const hamburgerButton = document.querySelector('[aria-label*="Close navigation menu"]') as HTMLElement;
        if (hamburgerButton) {
          hamburgerButton.focus();
        }
      }, 100);
    }
  };


  // Don't render if closed on mobile/tablet
  if (!isOpen && (isMobile || isTablet)) {
    return null;
  }

  return (
    <>
      {/* Sidebar - Floats On Top */}
      <div
        id="main-navigation"
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col
          transition-transform duration-250 ease-in-out shadow-xl
          ${isDesktop 
            ? 'translate-x-0' 
            : isOpen 
              ? 'translate-x-0' 
              : '-translate-x-full'
          }
        `}
        style={{ 
          zIndex: isDesktop ? 10 : 999
        }}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={!isOpen && (isMobile || isTablet)}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Claims App</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium 
                      min-h-11 touch-target
                      transition-colors duration-200 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="text-lg" aria-hidden="true">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="secondary" 
            size="small"
            className="w-full justify-start min-h-11 touch-target focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Open user profile"
          >
            <span aria-hidden="true">👤</span> Profile
          </Button>
        </div>
      </div>
    </>
  );
};