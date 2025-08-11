# Context Documentation

## Overview
This directory contains React context providers that manage global application state.

## Current Context Providers

### ToastContext (`toast-context.tsx`)
**Purpose**: Provides toast notification functionality throughout the application

**Key Features**:
- Centralized toast notification management
- Hook-based API for showing/hiding toasts
- Integrated with custom toast UI components
- Provider wraps the entire client-side application

**Usage**:
```tsx
// In your component:
import { useToastContext } from '@/context/toast-context'

const { showToast, hideToast } = useToastContext()
showToast({ message: 'Success!', type: 'success' })
```

**Integration**: 
- Provider is set up in `client-layout.tsx`
- Uses `useToast` hook from `@/hooks/use-toast`
- Renders `ToastContainer` component for UI display

## Architecture Notes
- All context providers use the "Provider + Hook" pattern for type-safe access
- Context providers throw errors when used outside their provider boundary
- Client-side only (`'use client'` directive)