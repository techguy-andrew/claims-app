# Redesigned Components - Master Design System

## Overview

Complete component library based on the `items-card.tsx` master design language, implementing professional glass morphism styling with React 18.3.1, Next.js 15.2.3, and TypeScript 5.

## Architecture

### Tech Stack Compliance
- **React 18.3.1**: Functional components with 'use client' directive
- **Next.js 15.2.3**: App Router patterns and optimizations  
- **TypeScript 5**: Full type safety with proper interfaces
- **CSS Modules**: Component-scoped styling with design tokens
- **Lucide React 0.526.0**: Icon library (exact version)
- **React Hook Form 7.60.0 + Zod 4.0.5**: Form handling and validation
- **Prisma 6.12.0**: Database integration patterns

### Design Language Features
- **Glass Morphism**: backdrop-blur, subtle transparency, professional shadows
- **InvisibleInput**: Professional contentEditable with Selection API cursor management
- **FloatingContextMenu**: Smart positioning with viewport detection
- **Mobile-First**: 44px touch targets, responsive design patterns
- **Accessibility**: ARIA labels, keyboard navigation, focus management

## Component Structure

```
/redesigned/
├── core/                    # Foundation components
│   ├── InvisibleInput.tsx   # Professional contentEditable system
│   ├── FloatingContextMenu.tsx # Universal menu system
│   └── design-tokens.module.css # CSS custom properties
├── ui/                      # Basic UI components
│   ├── Button.tsx          # Glass morphism button variants
│   ├── Card.tsx            # Items-card inspired cards
│   ├── Modal.tsx           # Enhanced modal with glass styling
│   └── Toast.tsx           # Professional notification system
├── forms/                   # Form components
│   └── FormField.tsx       # React Hook Form integration
├── items/                   # Reference implementations
│   └── ItemsCard.tsx       # Master reference component
└── index.ts                # Master export file
```

## Quick Start

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  InvisibleInput,
  ToastProvider,
  useToastHelpers
} from '@/components/redesigned'

export function MyComponent() {
  const { success } = useToastHelpers()

  return (
    <Card variant="glass" hoverable>
      <CardHeader>
        <CardTitle>Glass Morphism Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          variant="modern" 
          onClick={() => success('Action completed!')}
        >
          Modern Button
        </Button>
      </CardContent>
    </Card>
  )
}
```

## Key Components

### InvisibleInput
Professional contentEditable with cursor position management:
```tsx
<InvisibleInput
  value={text}
  onChange={setText}
  onSave={handleSave}
  onCancel={handleCancel}
  isEditing={editing}
  multiline
/>
```

### FloatingContextMenu
Universal menu system with smart positioning:
```tsx
<MenuTrigger
  menuId="actions"
  items={[
    { id: 'edit', label: 'Edit', icon: Edit, onClick: handleEdit },
    { id: 'delete', label: 'Delete', icon: Trash2, onClick: handleDelete }
  ]}
>
  <Button variant="ghost">⋯</Button>
</MenuTrigger>
```

### Form Integration
React Hook Form with InvisibleInput:
```tsx
<FormProvider {...form}>
  <FormField
    name="title"
    label="Title"
    placeholder="Enter title..."
    variant="title"
  />
</FormProvider>
```

## Design Tokens

All components use centralized design tokens:
- `--glass-white-95`: Primary glass background
- `--backdrop-blur-md`: Standard backdrop blur
- `--shadow-enterprise`: Professional shadow system
- `--touch-target-min`: Mobile touch targets (44px)
- `--transition-normal`: Consistent animations

## Migration Strategy

1. Import redesigned components alongside existing ones
2. Test new components in isolated areas
3. Gradually replace existing components
4. Update imports to use redesigned components
5. Remove legacy components after full migration

## Examples

See `items/ItemsCard.tsx` for the master implementation demonstrating:
- Professional inline editing with cursor management
- Smart floating menus with positioning logic
- Glass morphism styling with backdrop blur
- Mobile-first responsive design
- Optimistic updates with error handling
- Prisma database integration patterns

This design system provides a complete foundation for building sophisticated, production-ready React applications with consistent styling and behavior patterns.