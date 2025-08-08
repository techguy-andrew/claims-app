"use client";

import { 
  useSidebar,
  useTheme,
  useNavigation
} from '@/components/navigation';

export default function NavigationDemoPage() {
  const { layout, setLayout, toggleCollapse, isCollapsed, toggle } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();

  return (
    <div>
      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="pt-20 p-4 sm:p-6 space-y-8">
        {/* Page Header */}
        <div className="text-center mb-8" style={{ animation: 'fadeIn 0.8s ease-out' }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Navigation System Demo</h1>
          <p className="text-gray-600">Showcase of the simplified navigation system</p>
        </div>

        {/* Demo Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Navigation Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Theme Toggle */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Theme</h3>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Toggle Theme (Current: {theme})
            </button>
          </div>

          {/* Layout Toggle */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Layout</h3>
            <div className="space-y-2">
              <button
                onClick={() => setLayout('overlay')}
                className={`w-full px-3 py-2 text-sm rounded ${
                  layout === 'overlay' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Overlay
              </button>
              <button
                onClick={() => setLayout('static')}
                className={`w-full px-3 py-2 text-sm rounded ${
                  layout === 'static' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Static
              </button>
            </div>
          </div>

          {/* Sidebar Toggle */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Sidebar</h3>
            <div className="space-y-2">
              <button
                onClick={toggle}
                className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                Toggle Sidebar
              </button>
              <button
                onClick={toggleCollapse}
                className="w-full px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                disabled={!navigation.isDesktop}
              >
                {isCollapsed ? 'Expand' : 'Collapse'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Navigation Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Simplified Navigation</h2>
        <p className="text-gray-600 mb-4">The navigation system has been simplified to use only the sidebar with a floating hamburger menu button. All functionality is now accessible through the sidebar navigation.</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Key Features:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Floating hamburger menu button in top-left corner</li>
            <li>Glass morphism sidebar design</li>
            <li>Responsive behavior across all devices</li>
            <li>Clean, minimal interface focused on content</li>
          </ul>
        </div>
      </div>

      {/* Navigation State Display */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Current Navigation State</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Screen & Layout</h3>
            <ul className="space-y-1 text-gray-600">
              <li>Screen size: {navigation.screenSize}</li>
              <li>Is mobile: {navigation.isMobile ? 'Yes' : 'No'}</li>
              <li>Is tablet: {navigation.isTablet ? 'Yes' : 'No'}</li>
              <li>Is desktop: {navigation.isDesktop ? 'Yes' : 'No'}</li>
              <li>Layout: {layout}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Sidebar State</h3>
            <ul className="space-y-1 text-gray-600">
              <li>Is open: {navigation.sidebarOpen ? 'Yes' : 'No'}</li>
              <li>Is collapsed: {isCollapsed ? 'Yes' : 'No'}</li>
              <li>Theme: {theme}</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}