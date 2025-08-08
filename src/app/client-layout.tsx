"use client";

import { 
  NavigationProvider, 
  Sidebar,
  useSidebar, 
  useTheme 
} from "@/components/navigation";
import { Menu } from "lucide-react";

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

      {/* Floating Hamburger Menu Button */}
      <button
        onClick={toggle}
        className="fixed top-6 left-6 z-50 p-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        aria-label="Toggle navigation menu"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

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