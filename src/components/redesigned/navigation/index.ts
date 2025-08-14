// ============================================================================
// NAVIGATION COMPONENTS EXPORT - Complete redevelopment with glass morphism
// Modern navigation system with Framer Motion animations and React 18.3.1 patterns
// ============================================================================

// Core Navigation Components - completely redesigned
export { Sidebar } from './Sidebar'
export { Navbar } from './Navbar'
export { Topbar } from './Topbar'

// Advanced Navigation Provider with React 18.3.1 useReducer patterns
export { 
  NavigationProvider, 
  useNavigation,
  useNavigationState,
  useNavigationActions,
  useNavigationUtils
} from './NavigationProvider'

// Type Exports
export type { NavigationItem, SidebarProps } from './Sidebar'
export type { NavbarProps, NavbarUserMenuAction } from './Navbar'
export type { TopbarProps, BreadcrumbItem, TopbarAction } from './Topbar'

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
## Basic Navigation Setup

```tsx
import {
  NavigationProvider,
  Sidebar,
  Navbar,
  Topbar,
  useNavigation
} from '@/components/redesigned/navigation'

// Layout component
function AppLayout({ children }) {
  return (
    <NavigationProvider defaultItems={navigationItems}>
      <div className="app-layout">
        <Navbar 
          user={{ name: "John Doe", email: "john@example.com" }}
          showSearch={true}
          showNotifications={true}
        />
        <div className="main-content">
          <Sidebar 
            variant="overlay"
            size="md"
            theme="light"
            collapsible={true}
          />
          <div className="content-area">
            <Topbar 
              title="Dashboard"
              breadcrumbs={breadcrumbs}
              actions={actions}
              showSearch={true}
            />
            <main>{children}</main>
          </div>
        </div>
      </div>
    </NavigationProvider>
  )
}

// Using navigation context
function CustomComponent() {
  const { state, actions } = useNavigation()
  
  return (
    <button onClick={actions.toggle}>
      {state.isOpen ? 'Close' : 'Open'} Sidebar
    </button>
  )
}
```

## Advanced Features

- **Glass morphism styling** with backdrop-blur effects
- **Framer Motion animations** for smooth transitions
- **Mobile-first responsive design** with 44px touch targets  
- **Advanced TypeScript interfaces** with discriminated unions
- **React Hook Form integration** for search forms
- **Accessibility-first design** with proper ARIA attributes
- **Theme system** with light/dark/auto modes
- **Performance optimized** with useCallback and useMemo

## Architecture Compliance

- **React 18.3.1** functional components with concurrent features
- **TypeScript 5** strict typing with advanced patterns
- **CSS Modules** for component-scoped styling
- **Framer Motion** for production-grade animations
- **Mobile-optimized** for serverless deployment efficiency
*/