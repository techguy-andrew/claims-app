"use client";

import { 
  Library001NavigationProvider as NavigationProvider, 
  useLibrary001Sidebar as useSidebar, 
  useLibrary001Theme as useTheme,
  Library001AppSidebar as SidebarV2,
  Library001MenuButton as MenuButton
} from "@/components-library001/navigation";
import { ToastProvider } from "@/context/toast-context";

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

      {/* Floating Hamburger Menu Button */}
      <MenuButton onClick={toggle} />

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
      <ToastProvider>
        <LayoutContent>{children}</LayoutContent>
      </ToastProvider>
    </NavigationProvider>
  );
}