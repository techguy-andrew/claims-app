"use client";

import { 
  NavigationProvider, 
  useSidebar, 
  useTheme 
} from "@/components/navigation";
import { SidebarV2 } from "@/components/navigation/sidebar-v2";
import { Menu } from "lucide-react";

// Layout content component that uses navigation hooks
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen, layout, toggle, close } = useSidebar();
  const { theme } = useTheme();
  

  // Calculate main content margin for static sidebar and hamburger spacing
  const getMainContentStyle = () => {
    const styles: React.CSSProperties = {};
    
    // Mobile-first padding to prevent hamburger menu interference
    styles.paddingTop = '4.5rem'; // 72px on mobile for better clearance
    
    return styles;
  };

  // Desktop adjustment via CSS
  const desktopContentAdjustment = {
    paddingTop: '4rem' // 64px on desktop
  };

  return (
    <div className={`min-h-screen w-full relative ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar */}
      <SidebarV2
        layout={layout}
        size="md"
        theme={theme}
        isOpen={isOpen}
        onClose={close}
        onToggle={toggle}
        showProfile={true}
      />

      {/* Floating Hamburger Menu Button - Ultra Mobile Optimized */}
      <button
        onClick={toggle}
        className="fixed top-4 left-4 z-50 p-4 md:p-2.5 bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-gray-200/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/98 active:scale-95 active:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-h-[52px] md:min-h-[40px] min-w-[52px] md:min-w-[40px] mobile-touch-feedback"
        aria-label="Toggle navigation menu"
      >
        <Menu className="w-6 h-6 md:w-5 md:h-5 text-gray-700" />
      </button>

      {/* Main Content Area - Mobile First */}
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

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider
      defaultSettings={{
        persistCollapsedState: false,
        autoCollapseOnMobile: true,
        defaultSidebarLayout: 'overlay',
        defaultTheme: 'light',
      }}
    >
      <LayoutContent>{children}</LayoutContent>
    </NavigationProvider>
  );
}