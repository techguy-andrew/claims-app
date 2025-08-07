"use client";

import { useState } from 'react';
import { 
  TopBar, 
  TopbarAction, 
  TopBarWithBreadcrumbs,
  TopBarWithSearch,
  TopBarWithFilter,
  type BreadcrumbItem,
  useSidebar,
  useTheme,
  useNavigation
} from '@/components/navigation';
import { Plus, Download, Settings, Home, FileText, Code } from 'lucide-react';

export default function NavigationDemoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCount, setFilterCount] = useState(3);
  const [isFilterActive, setIsFilterActive] = useState(false);
  
  const { layout, setLayout, toggleCollapse, isCollapsed, toggle } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Navigation Demo', icon: Code },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search query:', query);
  };

  const handleFilterClick = () => {
    setIsFilterActive(!isFilterActive);
    console.log('Filter clicked, active:', !isFilterActive);
  };

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

      <TopBar
        title="Navigation System Demo"
        subtitle="Showcase of the new variant-based navigation components"
        showMenuButton={true}
        onMenuToggle={toggle}
        breadcrumbs={breadcrumbs}
        actions={
          <TopbarAction
            icon={Home}
            label="Back to App"
            variant="primary"
            onClick={() => window.location.href = '/'}
          />
        }
      />

      <div className="p-4 sm:p-6 space-y-8">

      {/* Demo Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Navigation Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Theme Toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <button
              onClick={toggleTheme}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left hover:bg-gray-50"
            >
              Current: {theme === 'light' ? 'Light' : 'Dark'}
            </button>
          </div>

          {/* Sidebar Layout */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sidebar Layout</label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value as 'overlay' | 'push' | 'static')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="overlay">Overlay</option>
              <option value="push">Push</option>
              <option value="static">Static</option>
            </select>
          </div>

          {/* Sidebar Collapse */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sidebar State</label>
            <button
              onClick={toggleCollapse}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left hover:bg-gray-50"
            >
              {isCollapsed ? 'Collapsed' : 'Expanded'}
            </button>
          </div>
        </div>
      </div>

      {/* TopBar Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">TopBar Variants</h2>

        {/* Basic TopBar */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-700">Basic TopBar</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <TopBar
              title="Dashboard Overview"
              subtitle="Welcome back! Here's what's happening with your claims today."
              actions={
                <div className="flex items-center gap-2">
                  <TopbarAction
                    icon={Plus}
                    label="New Claim"
                    variant="primary"
                    onClick={() => console.log('New claim clicked')}
                  />
                  <TopbarAction
                    icon={Download}
                    label="Export"
                    variant="secondary"
                    onClick={() => console.log('Export clicked')}
                  />
                </div>
              }
            />
          </div>
        </div>

        {/* TopBar with Breadcrumbs */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-700">TopBar with Breadcrumbs</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <TopBarWithBreadcrumbs
              breadcrumbs={breadcrumbs}
              title="Claim Details"
              actions={
                <TopbarAction
                  icon={Settings}
                  label="Settings"
                  variant="ghost"
                  onClick={() => console.log('Settings clicked')}
                />
              }
            />
          </div>
        </div>

        {/* TopBar with Search */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-700">TopBar with Search</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <TopBarWithSearch
              title="Claims Management"
              onSearch={handleSearch}
              searchPlaceholder="Search claims..."
              actions={
                <TopbarAction
                  icon={Plus}
                  label="New"
                  variant="primary"
                  onClick={() => console.log('New clicked')}
                />
              }
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Search query: <code className="bg-gray-100 px-2 py-1 rounded">{searchQuery}</code>
            </p>
          )}
        </div>

        {/* TopBar with Filter */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-700">TopBar with Filter</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <TopBarWithFilter
              title="Active Claims"
              filterCount={filterCount}
              isFilterActive={isFilterActive}
              onFilterClick={handleFilterClick}
              actions={
                <div className="flex items-center gap-2">
                  <TopbarAction
                    icon={FileText}
                    label="Reports"
                    variant="secondary"
                    onClick={() => console.log('Reports clicked')}
                  />
                  <TopbarAction
                    icon={Plus}
                    label="New Claim"
                    variant="primary"
                    onClick={() => console.log('New claim clicked')}
                  />
                </div>
              }
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Filter active: {isFilterActive ? 'Yes' : 'No'}</span>
            <span>Filter count: {filterCount}</span>
            <button
              onClick={() => setFilterCount(prev => prev + 1)}
              className="text-blue-600 hover:text-blue-700"
            >
              Increment count
            </button>
          </div>
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
              <li>Sidebar layout: {navigation.sidebarLayout}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Sidebar State</h3>
            <ul className="space-y-1 text-gray-600">
              <li>Sidebar open: {navigation.sidebarOpen ? 'Yes' : 'No'}</li>
              <li>Sidebar collapsed: {navigation.sidebarCollapsed ? 'Yes' : 'No'}</li>
              <li>Mobile menu open: {navigation.mobileMenuOpen ? 'Yes' : 'No'}</li>
              <li>Theme: {navigation.theme}</li>
              <li>Active item: {navigation.activeItem || 'None'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Navigation System Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Core Features</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✅ Variants pattern for consistent API</li>
              <li>✅ Responsive mobile-first design</li>
              <li>✅ Light/dark theme support</li>
              <li>✅ Keyboard navigation (Cmd+B, Escape)</li>
              <li>✅ Accessibility features</li>
              <li>✅ Local storage persistence</li>
              <li>✅ CSS Modules with CSS variables</li>
              <li>✅ Lucide React icons</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Layout Options</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>🔄 Overlay sidebar (mobile-style)</li>
              <li>🔄 Push sidebar (content moves)</li>
              <li>🔄 Static sidebar (content margin)</li>
              <li>🔄 Collapsible sidebar states</li>
              <li>🔄 Sticky/fixed/relative navbar</li>
              <li>🔄 Multiple size variants</li>
              <li>🔄 Breadcrumb navigation</li>
              <li>🔄 Contextual top bars</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}