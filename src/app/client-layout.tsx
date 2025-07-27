"use client";

import { 
  NavigationProvider, 
  Sidebar,
  useSidebar, 
  useTheme 
} from "@/components/navigation";

// Layout content component that uses navigation hooks
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen, layout, isDesktop, toggle, close } = useSidebar();
  const { theme } = useTheme();

  // Calculate main content margin for static sidebar
  const getMainContentStyle = () => {
    if (layout === 'static' && isDesktop && isOpen) {
      return { marginLeft: '16rem' }; // 256px sidebar width
    }
    return {};
  };

  return (
    <div className={`min-h-screen w-full relative ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Mobile Menu Trigger - Only show when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={toggle}
          className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300"
          aria-label="Open menu"
        >
          <div className="w-5 h-5 flex flex-col justify-center">
            <span className="w-full h-0.5 bg-gray-900 transition-all duration-300" />
            <span className="w-full h-0.5 bg-gray-900 transition-all duration-300 mt-1" />
            <span className="w-full h-0.5 bg-gray-900 transition-all duration-300 mt-1" />
          </div>
        </button>
      )}

      {/* Sidebar */}
      <Sidebar
        layout={layout}
        size="md"
        theme={theme}
        isOpen={isOpen}
        onClose={close}
        onToggle={toggle}
        showProfile={true}
      />

      {/* Main Content Area */}
      <main 
        className="min-h-screen bg-white transition-all duration-300"
        style={getMainContentStyle()}
      >
        <div className="p-4 lg:p-6 pt-20 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider
      defaultSettings={{
        persistCollapsedState: true,
        autoCollapseOnMobile: true,
        defaultSidebarLayout: 'overlay',
        defaultTheme: 'light',
      }}
    >
      <LayoutContent>{children}</LayoutContent>
    </NavigationProvider>
  );
}