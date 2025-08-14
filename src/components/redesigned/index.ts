// ============================================================================
// REDESIGNED COMPONENTS - Master Export
// Complete Design System Based on Items-Card Architecture
// ============================================================================

// Core foundation components
export * from './core'

// UI components with glass morphism
export * from './ui'

// Form components with React Hook Form integration
export * from './forms'

// Navigation components with glass morphism and Framer Motion
export * from './navigation'

// Items components (reference implementations)
export * from './items'

// Claims management components with React Hook Form + Zod
export * from './claims'

// File components (enhanced modals)
export * from './files'

// Type definitions
export * from './types'

// ============================================================================
// USAGE EXAMPLES AND PATTERNS
// ============================================================================

/*
## Basic Usage

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  InvisibleInput,
  FormField,
  ToastProvider,
  useToastHelpers
} from '@/components/redesigned'

// Use in your components...
```

## Design System Patterns

All components follow these patterns from items-card.tsx:
- Glass morphism styling with backdrop-blur
- Professional shadows and subtle borders  
- Mobile-first responsive design (44px touch targets)
- InvisibleInput for seamless inline editing
- FloatingContextMenu for all interactions
- CSS Modules with design tokens
- TypeScript 5 interfaces for type safety
- React Hook Form + Zod integration

## Tech Stack Compliance

- React 18.3.1 functional components with 'use client'
- Next.js 15.2.3 App Router patterns
- CSS Modules for component-scoped styling
- Lucide React 0.526.0 for all icons
- React Hook Form 7.60.0 + Zod 4.0.5
- Prisma 6.12.0 database patterns
- Mobile-first, accessibility-focused
*/