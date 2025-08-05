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
        {children}
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