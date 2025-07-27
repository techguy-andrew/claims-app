# Navigation System Documentation

## Overview
Comprehensive responsive navigation system built with React, TypeScript, and CSS Modules. Provides modern SaaS-style navigation with mobile-first design principles.

## Architecture

### Core Components
- **NavigationProvider**: Context provider with state management
- **Sidebar**: Main navigation with responsive layouts
- **Navbar**: Top navigation bar component  
- **TopBar**: Page-level navigation component

### State Management
- React Context + useReducer pattern
- Persistent user preferences via localStorage
- Screen size detection and responsive behavior
- Theme management (light/dark mode)

## Key Features

### Mobile Experience
- Fixed hamburger menu trigger when sidebar closed
- Smooth hamburger ↔ X animation transitions
- Overlay sidebar that slides in from left
- Touch-friendly interaction targets
- Auto-close on navigation item selection

### Desktop Experience  
- Static sidebar layout option
- Collapsible sidebar functionality
- Full "Claims App" branding with logo
- Keyboard shortcuts support

### Responsive Design
- CSS Modules with responsive utilities
- Breakpoint-based layout switching
- Mobile-first design approach
- Smooth transitions between layouts

### Accessibility
- ARIA labels and roles throughout
- Keyboard navigation support
- Screen reader compatibility
- High contrast focus indicators

## Component Structure

```
src/components/navigation/
├── index.ts                 # Export barrel
├── navigation-provider.tsx  # Context & state management
├── sidebar.tsx             # Main sidebar component
├── navbar.tsx              # Top navigation bar
├── topbar.tsx              # Page-level navigation
├── utils.ts                # Utilities & breakpoints
└── navigation.module.css   # Component styles
```

## Usage

### Basic Setup
```tsx
import { NavigationProvider, Sidebar } from '@/components/navigation';

function App() {
  return (
    <NavigationProvider>
      <Sidebar />
      <main>{/* your content */}</main>
    </NavigationProvider>
  );
}
```

### Hooks
```tsx
import { useSidebar, useTheme } from '@/components/navigation';

function MyComponent() {
  const { isOpen, toggle, close } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggle}>
      {isOpen ? 'Close' : 'Open'} Menu
    </button>
  );
}
```

## Configuration

### Default Settings
```tsx
<NavigationProvider
  defaultSettings={{
    persistCollapsedState: true,
    autoCollapseOnMobile: true,
    defaultSidebarLayout: 'overlay',
    defaultTheme: 'light',
  }}
>
```

### Layout Options
- `overlay`: Sidebar overlays content (mobile default)
- `push`: Sidebar pushes content aside
- `static`: Sidebar is always visible (desktop default)

## Navigation Items

```tsx
const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: Home },
  { id: 'claims', label: 'Claims', href: '/claims', icon: FileText, badge: '3' },
  { id: 'inspections', label: 'Inspections', href: '/inspections', icon: Search },
];
```

## Styling

### CSS Modules Structure
- Component-scoped styles
- Responsive utilities
- Animation definitions
- Theme variants
- State modifiers

### Key CSS Classes
- `.hamburger` - Hamburger menu container
- `.hamburgerLine` - Individual hamburger lines
- `.open` - Open state modifier
- `.sidebar` - Main sidebar container
- `.navbar` - Top navigation bar

## Technical Implementation

### State Management
- Centralized navigation state
- Persistent preferences
- Screen size reactivity
- Keyboard shortcut handling

### Performance
- CSS Modules for style encapsulation
- Efficient re-renders with React Context
- Responsive image loading
- Transition optimizations

### Browser Support
- Modern browsers (ES2020+)
- Mobile Safari optimizations
- Touch gesture support
- Responsive breakpoint system

## Development

### Local Development
```bash
npm run dev  # Start development server
npm run build  # Build for production
npm run lint  # Check code quality
```

### File Structure Integration
- Integrates with existing app layout
- Replaces previous custom sidebar
- Maintains route structure
- Preserves existing styling

## Future Enhancements
- Additional layout variants
- Animation presets
- Breadcrumb integration
- Search functionality
- User menu improvements