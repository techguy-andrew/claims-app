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
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 transition-all duration-300"
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