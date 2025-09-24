# Agency Development Guidelines: Complete Reference

> The definitive guide to our standardized development approach, technology stack, and implementation patterns.

## Executive Summary

This document defines our **Agency Development Playbook** - a comprehensive system for building production-ready applications with absolute consistency. By standardizing on a single, proven technology stack and following strict development patterns, we achieve:

- **2-hour MVP delivery** from concept to deployed prototype
- **100% code reusability** across all projects
- **Zero decision fatigue** through predetermined technology choices
- **Predictable debugging** with consistent patterns
- **Seamless team collaboration** through shared conventions

**Critical Rule:** If a technology, library, or pattern is not explicitly documented here, it is not approved for use.

## Part 1: Development Philosophy

### The Power of Standardization

Our philosophy rejects the constant churn of new technologies in favor of deep mastery. When every project uses identical technologies, patterns compound. Developers achieve unconscious competence. Complex features become muscle memory. Performance optimization becomes systematic.

### Core Principles

1. **One Stack, Infinite Possibilities**
   - Master one comprehensive stack rather than sampling many
   - Deep expertise beats broad superficiality
   - Constraints drive creativity and innovation

2. **Consistency Over Novelty**
   - Use the same solution for the same problem every time
   - New technologies require explicit justification and team consensus
   - Innovation happens in features, not infrastructure

3. **Ownership Through Understanding**
   - Use tools we fully control and understand
   - Prefer ownership (shadcn/ui) over dependency (component libraries)
   - Build expertise through repetition

4. **Speed Through Standardization**
   - Eliminate decision paralysis with predetermined choices
   - Reuse patterns, components, and entire architectures
   - Deploy with confidence using proven configurations

### Team Benefits

- **Instant Onboarding:** New developers productive on day one
- **Seamless Handoffs:** Any developer can work on any project
- **Collective Debugging:** Shared knowledge of common issues
- **Compound Learning:** Skills transfer between all projects
- **Reduced Complexity:** One stack to master deeply

## Part 2: Technology Stack

### The Forever Stack

| Category | Technology | Version | Purpose | Setup |
|----------|------------|---------|---------|-------|
| **Framework** | Next.js (App Router) | 15.0+ | React framework with RSC | `npx create-next-app@latest` |
| **Language** | TypeScript | 5.3+ | Type-safe JavaScript | Included with Next.js |
| **Runtime** | Node.js | 20 LTS | Server runtime | Required for development |
| **Database** | PostgreSQL (Neon) | Latest | Scalable relational DB | `neon.tech` account |
| **ORM** | Prisma | 5.0+ | Type-safe database client | `pnpm add prisma @prisma/client` |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first CSS | Included with Next.js |
| **Components** | shadcn/ui | Latest | Copy-paste components | `npx shadcn@latest init` |
| **Auth** | Clerk | Latest | Managed authentication | `pnpm add @clerk/nextjs` |
| **Deployment** | Vercel | Latest | Edge deployment platform | GitHub integration |
| **Package Manager** | pnpm | Latest | Fast, efficient packages | `npm install -g pnpm` |

### Extended Services (When Required)

Only add these when project requirements explicitly demand them:

```bash
# API & Validation
pnpm add @trpc/server @trpc/client @trpc/next @tanstack/react-query zod

# Forms & Email
pnpm add react-hook-form @hookform/resolvers resend

# File Uploads & Payments
pnpm add uploadthing @uploadthing/react stripe @stripe/stripe-js

# Real-time & Caching
pnpm add pusher pusher-js @upstash/redis @upstash/ratelimit

# Monitoring
pnpm add @sentry/nextjs posthog-js
```

### Project Initialization

```bash
# 1. Create new project
npx create-next-app@latest my-app --typescript --tailwind --app --use-pnpm

# 2. Install core dependencies
cd my-app
pnpm add @clerk/nextjs prisma @prisma/client zod

# 3. Initialize shadcn/ui
npx shadcn@latest init

# 4. Setup Prisma
npx prisma init

# 5. Configure environment
cp .env.example .env.local
```

## Part 3: Development Standards

### Project Structure

```
project-name/
├── prisma/
│   ├── migrations/           # Database migrations
│   ├── schema.prisma        # Database schema
│   └── seed.ts             # Seed data
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Auth route group
│   │   ├── (dashboard)/    # Dashboard routes
│   │   ├── (marketing)/    # Public routes
│   │   ├── api/            # API routes
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/
│   │   ├── ui/             # shadcn/ui components only
│   │   └── [feature]/      # Feature components
│   ├── lib/
│   │   ├── db.ts           # Database instance
│   │   ├── utils.ts        # Utility functions
│   │   └── constants.ts    # App constants
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── hooks/
│       └── use-*.ts        # Custom React hooks
├── public/                  # Static assets
├── .env.local              # Environment variables
├── components.json         # shadcn/ui config
├── next.config.mjs         # Next.js config
├── tailwind.config.ts      # Tailwind config
└── tsconfig.json           # TypeScript config
```

### Component Architecture

#### UI Components (shadcn/ui)

```tsx
// ✅ CORRECT: Use shadcn/ui components
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// ❌ NEVER: Don't install UI libraries
import Button from '@mui/material/Button'  // Never do this
```

#### The Claims App: Definitive Component Gold Standard

**This project's components represent the ULTIMATE REFERENCE for all future development.**

Every component MUST follow these exact patterns from the Claims App implementation:

##### **✅ ItemCard: Perfect Implementation Reference**
```tsx
// src/components/custom/ItemCard.tsx - THE GOLD STANDARD
'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  editable?: boolean
  onSave?: (data: { title: string; description: string }) => void  // ✅ Optional handlers
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
}

export function ItemCard({
  title: initialTitle = 'Click to edit title',
  description: initialDescription = 'Click to edit description',
  className,
  editable = false,
  onSave,  // ✅ Self-contained event handling
  onEdit,
  onDelete,
  onDuplicate,
  ...props
}: ItemCardProps) {
  // ✅ Perfect inline editing implementation
  const [isEditing, setIsEditing] = React.useState(false)

  const handleSave = () => {
    const newTitle = titleRef.current?.textContent || ''
    const newDescription = descriptionRef.current?.textContent || ''
    onSave?.({ title: newTitle, description: newDescription })  // ✅ Optional chaining
    setIsEditing(false)
  }

  return (
    <Card className={cn('w-full', className)} {...props}>
      <CardHeader>
        <div className="grid grid-cols-[1fr,auto] gap-6 items-start">  {/* ✅ Perfect layout */}
          <div className="flex flex-col gap-3">  {/* ✅ Gap-based spacing */}
            <CardTitle
              contentEditable={isEditing}  // ✅ Inline editing
              onKeyDown={handleKeyDown}
              className="outline-none min-h-[1.75rem] leading-7"
            >
              {initialTitle}
            </CardTitle>
            <CardDescription
              contentEditable={isEditing}
              onKeyDown={handleKeyDown}
              className="outline-none min-h-[1.25rem] leading-5"
            >
              {initialDescription}
            </CardDescription>
          </div>
          {/* ✅ Action buttons with proper spacing */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Dropdown menu implementation... */}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
```

##### **✅ Navigation System: Proven Architecture**
```tsx
// src/components/layouts/Navigation.tsx - BATTLE-TESTED SIMPLICITY
'use client'

import { TopBar } from './TopBar'

interface NavigationProps {
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Navigation({ children, actions }: NavigationProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar actions={actions} />
      <main className="flex-1 pt-16">  {/* ✅ Perfect offset */}
        <div className="w-full py-6 px-4 sm:px-6">  {/* ✅ Responsive padding */}
          {children}
        </div>
      </main>
    </div>
  )
}
```

##### **✅ Server Component Pattern: Error-Free Implementation**
```tsx
// src/app/claims/[claimId]/page.tsx - PERFECT SERVER COMPONENT
import { ItemCard, ItemCardStack } from '@/components/custom/ItemCard'

interface ClaimDetailsPageProps {
  params: Promise<{
    claimId: string  // ✅ Proper TypeScript typing
  }>
}

export default async function ClaimDetailsPage({ params }: ClaimDetailsPageProps) {
  const { claimId } = await params  // ✅ Async params handling

  return (
    <div className="flex flex-col gap-6">  {/* ✅ Gap-based layout */}
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">{claimId}</h1>
        <p className="text-xl text-muted-foreground">Acme Restoration Co.</p>
      </div>

      <ItemCardStack>
        <ItemCard
          title="Water Damaged Carpet"
          description="Commercial carpet in main lobby - 500 sq ft"
          editable={true}  {/* ✅ Only serializable props */}
        />
      </ItemCardStack>
    </div>
  )
}
```
```

**Required Patterns:**
- **Container-managed spacing** with `gap-*` utilities
- **Grid layout** with `grid grid-cols-[1fr,auto] gap-6` for content/actions
- **Flex stacks** with `flex flex-col gap-3` for vertical content
- **Full width** with `w-full` for responsive design
- **State management** with separate editing/display states
- **Keyboard navigation** with Enter/Escape support

#### Anti-Patterns to Avoid

```tsx
// ❌ NEVER DO THIS - Avoid these patterns
<div className="mb-4">           // No margin utilities
<div className="mt-2">           // No margin utilities
<div className="space-y-4">      // No space utilities
<div className="w-[300px]">      // No fixed widths
<div className="px-4 py-2">      // Padding only for containers

// ✅ ALWAYS DO THIS - Use these patterns
<div className="flex flex-col gap-4">  // Gap for spacing
<div className="grid gap-4">            // Gap for spacing
<div className="w-full">                // Full width
<div className="p-4">                   // Consistent padding
```

### TypeScript Standards

#### Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Type Patterns

```tsx
// 1. Prisma Types (Auto-generated)
import type { User, Post, Comment } from "@prisma/client"

// 2. Extended Types
type PostWithAuthor = Post & {
  author: User
  comments: Comment[]
}

// 3. Component Props
interface DashboardProps {
  user: User
  posts: PostWithAuthor[]
  readonly analytics?: Analytics  // Optional with readonly
}

// 4. API Responses
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

// 5. Zod Schemas with Type Inference
const PostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  published: z.boolean().default(false)
})

type PostInput = z.infer<typeof PostSchema>
```

### Spacing System & Scale

| Class | Pixels | Use Case |
|-------|--------|----------|
| gap-1 | 4px | Between action buttons in a group |
| gap-2 | 8px | Between form fields |
| gap-3 | 12px | Between related content (title/description) |
| gap-4 | 16px | Between content sections |
| gap-6 | 24px | Between major sections |
| gap-8 | 32px | Between large page sections |
| p-2 | 8px | Small container padding |
| p-4 | 16px | Standard container padding |
| p-6 | 24px | Large container padding |

**Spacing Rules:**
- **Container gap:** `gap-6` between major sections
- **Content gap:** `gap-3` between related elements
- **Action gap:** `gap-1` between grouped buttons
- **Form gap:** `gap-2` between form fields
- **Never use margins** - always use gap utilities
- **Never use space utilities** - always use gap utilities

### Code Formatting

```tsx
// Component Structure (2 lines between major sections)
import { useState } from "react"
import { Button } from "@/components/ui/button"


interface Props {
  title: string
}


export function Component({ title }: Props) {
  const [count, setCount] = useState(0)
  
  const handleClick = () => {
    setCount(count + 1)
  }
  
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1>{title}</h1>
      <Button onClick={handleClick}>
        Count: {count}
      </Button>
    </div>
  )
}
```

## Part 4: Implementation Patterns

### Data Fetching Hierarchy

```tsx
// 1. Server Components (Default Choice)
async function PostList() {
  const posts = await prisma.post.findMany({
    include: { author: true }
  })
  
  return (
    <div className="grid gap-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

// 2. Server Actions (Forms & Mutations)
async function createPost(formData: FormData) {
  'use server'
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  const post = await prisma.post.create({
    data: { title, content }
  })
  
  revalidatePath('/posts')
  redirect(`/posts/${post.id}`)
}

// 3. Parallel Data Loading
async function DashboardPage() {
  const [user, posts, analytics] = await Promise.all([
    prisma.user.findUnique({ where: { id } }),
    prisma.post.findMany({ where: { authorId: id } }),
    getAnalytics(id)
  ])
  
  return <Dashboard user={user} posts={posts} analytics={analytics} />
}

// 4. API Routes (External Access Only)
export async function GET(request: Request) {
  const posts = await prisma.post.findMany()
  return Response.json(posts)
}
```

### Form Handling Patterns

```tsx
// Simple Forms: HTML + Server Actions
export function SimpleForm() {
  async function handleSubmit(formData: FormData) {
    'use server'
    // Process form
  }
  
  return (
    <form action={handleSubmit}>
      <Input name="email" type="email" required />
      <Button type="submit">Submit</Button>
    </form>
  )
}

// Complex Forms: react-hook-form + zod
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export function ComplexForm() {
  const form = useForm({
    resolver: zodResolver(schema)
  })
  
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
```

### Error Handling

```tsx
// 1. Error Boundaries (app/error.tsx)
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
      <Button onClick={reset} variant="outline" size="sm">
        Try again
      </Button>
    </Alert>
  )
}

// 2. Try-Catch in Server Components
export default async function DataPage() {
  try {
    const data = await prisma.resource.findMany()
    return <DataDisplay data={data} />
  } catch (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load data</AlertDescription>
      </Alert>
    )
  }
}

// 3. Form Validation Errors
async function submitForm(prevState: any, formData: FormData) {
  'use server'
  
  try {
    const validated = schema.parse(Object.fromEntries(formData))
    await prisma.record.create({ data: validated })
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errors: error.flatten().fieldErrors }
    }
    return { error: 'Something went wrong' }
  }
}
```

### State Management

```tsx
// 1. URL State (Preferred)
export default function ProductsPage({
  searchParams
}: {
  searchParams: { category?: string; sort?: string }
}) {
  const products = await prisma.product.findMany({
    where: { category: searchParams.category },
    orderBy: { price: searchParams.sort === 'price' ? 'asc' : 'desc' }
  })
  
  return <ProductGrid products={products} />
}

// 2. React Context (Client State)
'use client'

const ThemeContext = createContext<'light' | 'dark'>('light')

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

// 3. Zustand (Complex Client State - Last Resort)
import { create } from 'zustand'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

const useCart = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  clearCart: () => set({ items: [] })
}))
```

### Database Patterns

```tsx
// 1. Connection Setup (lib/db.ts)
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 2. Common Query Patterns
// Pagination
const posts = await prisma.post.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' }
})

// Soft Delete
const deleted = await prisma.post.update({
  where: { id },
  data: { deletedAt: new Date() }
})

// Upsert
const user = await prisma.user.upsert({
  where: { email },
  update: { lastLogin: new Date() },
  create: { email, name }
})

// Transactions
const [post, notification] = await prisma.$transaction([
  prisma.post.create({ data: postData }),
  prisma.notification.create({ data: notificationData })
])
```

## Part 5: Project Workflow

### Development Commands

```bash
# Development
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Check TypeScript

# Database
pnpm db:push      # Push schema changes (dev)
pnpm db:migrate   # Create migration (prod)
pnpm db:studio    # Visual database editor
pnpm db:generate  # Generate Prisma client
pnpm db:seed      # Seed database

# Components
npx shadcn@latest add [component]  # Add UI component
npx shadcn@latest diff             # Check for updates

# Maintenance
pnpm update                        # Update dependencies
pnpm audit                         # Security audit
```

### Environment Setup

```bash
# .env.local (Never commit this file)

# Database (Neon) - Use pooled connection
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require&pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://user:pass@host/db?sslmode=require"

# Authentication (Clerk) - Optional for prototyping
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Optional Services
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
RESEND_API_KEY=""
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
```

### Git Workflow

```bash
# Feature Development
git checkout -b feature/new-feature
# Make changes
pnpm lint && pnpm build  # Must pass
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create pull request

# Conventional Commits
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation
style:    # Formatting
refactor: # Code restructuring
test:     # Tests
chore:    # Maintenance
```

### Deployment Checklist

- [ ] `pnpm build` passes with zero errors
- [ ] `pnpm lint` shows no warnings
- [ ] `pnpm type-check` passes
- [ ] Environment variables configured in Vercel
- [ ] Database migrations applied
- [ ] Clerk webhook configured (if using auth)
- [ ] Custom domain configured (optional)

## Part 6: Quick Reference

### Essential Patterns

```tsx
// Server Component (Default)
export default async function Page() {
  const data = await prisma.model.findMany()
  return <Component data={data} />
}

// Client Component (Interactivity)
'use client'
export function Interactive() {
  const [state, setState] = useState()
  return <Button onClick={() => setState()}>Click</Button>
}

// Server Action (Mutations)
async function action(formData: FormData) {
  'use server'
  await prisma.model.create({ data })
  revalidatePath('/path')
}

// Loading State
export default function Loading() {
  return <Skeleton className="w-full h-96" />
}

// Error Handling
export default function Error({ error, reset }) {
  return <Alert>{error.message}</Alert>
}

// Metadata
export const metadata = {
  title: 'Page Title',
  description: 'Page description'
}

// Dynamic Metadata
export async function generateMetadata({ params }) {
  const data = await getDate(params.id)
  return { title: data.title }
}
```

### Performance Checklist

- [ ] Server Components by default
- [ ] Suspense boundaries for async operations
- [ ] Image optimization with next/image
- [ ] Font optimization with next/font
- [ ] Parallel data fetching with Promise.all
- [ ] Database query optimization
- [ ] Static generation where possible
- [ ] Client bundle < 300KB

### **🚨 Critical Error Prevention Patterns**

**Based on real development experience - these errors WILL occur if not followed:**

#### **Server/Client Component Boundary Violations**
```tsx
// ❌ FATAL ERROR - Event handlers passed to Client Components
export default async function ServerPage({ params }) {
  const handleSave = (data) => { ... }  // ❌ Function in Server Component

  return (
    <ClientComponent
      onSave={handleSave}  // ❌ CAUSES: "Event handlers cannot be passed to Client Component props"
    />
  )
}

// ✅ CORRECT PATTERN - Client Component handles events internally
export default async function ServerPage({ params }) {
  return (
    <ClientComponent
      editable={true}  // ✅ Only serializable props
    />
  )
}
```

#### **Async/Await in Client Components**
```tsx
// ❌ FATAL ERROR - async function with 'use client'
'use client'
export default async function ClientPage({ params }) {  // ❌ async + 'use client' = ERROR
  // ❌ CAUSES: "async/await is not yet supported in Client Components"
}

// ✅ CORRECT PATTERN - Async only in Server Components
export default async function ServerPage({ params }) {  // ✅ No 'use client', can be async
  const { claimId } = await params
  return <ClientComponent claimId={claimId} />
}
```

#### **TypeScript Promise Parameters**
```tsx
// ✅ CORRECT PATTERN - Promise<{param: string}> for dynamic routes
interface PageProps {
  params: Promise<{
    claimId: string  // ✅ Proper typing for Next.js 15+
  }>
}

export default async function Page({ params }: PageProps) {
  const { claimId } = await params  // ✅ Await the Promise
  return <div>{claimId}</div>
}
```

#### **Gap vs Margin/Space Utilities**
```tsx
// ❌ FORBIDDEN PATTERNS - These cause layout issues
<div className="space-y-4">           // ❌ Never use space utilities
<div className="mb-4 mt-2">           // ❌ Never use margin utilities

// ✅ CORRECT PATTERN - Always use gap
<div className="flex flex-col gap-4">  // ✅ Gap for vertical spacing
<div className="grid gap-6">           // ✅ Gap for grid layouts
```

### Component Development Checklist

Use this checklist for every component you create or review:

#### Architecture & Layout
- [ ] Using `flex flex-col gap-*` for vertical content stacks
- [ ] Using `grid grid-cols-[1fr,auto]` for content/actions layout
- [ ] Using `w-full` for responsive width (no fixed widths)
- [ ] Container manages ALL spacing with gap utilities
- [ ] NO `space-y-*` or `space-x-*` utilities used
- [ ] NO margin utilities (`mb-*`, `mt-*`, `mx-*`, `my-*`) used
- [ ] NO fixed width values (`w-[300px]`, `w-64`) except for specific UI needs

#### State & Interactivity
- [ ] Server Component by default (no 'use client' unless needed)
- [ ] Client Component only when interactivity required
- [ ] Form uses Server Actions for mutations
- [ ] Loading states implemented with Suspense
- [ ] Error boundaries at route group level
- [ ] Keyboard navigation (Enter/Escape) where appropriate

#### TypeScript & Props
- [ ] All props have TypeScript interfaces
- [ ] Using Prisma types for data models
- [ ] Zod schemas for runtime validation
- [ ] No `any` types (use `unknown` if type unclear)
- [ ] Optional props marked with `?`
- [ ] Readonly props where appropriate

#### Performance
- [ ] Data fetching in Server Components
- [ ] Parallel data loading with `Promise.all`
- [ ] Images optimized with `next/image`
- [ ] Fonts loaded with `next/font`
- [ ] Static generation where possible
- [ ] Revalidation strategy defined

### Common Gotchas

1. **Prisma in Edge Runtime**
   - Use Node.js runtime for routes using Prisma
   - Add `export const runtime = 'nodejs'` to route

2. **Client Components in Server Components**
   - Wrap client components properly
   - Pass serializable props only

3. **Environment Variables**
   - `NEXT_PUBLIC_` prefix for client-side vars
   - Never expose secrets to client

4. **Database Connections**
   - Always use pooled connection string
   - Close connections in serverless

5. **Build Errors**
   - Run `pnpm build` locally before pushing
   - Check for unused imports/variables

## Conclusion

This document represents years of collective experience distilled into a single, proven approach. By following these guidelines strictly, we achieve:

- **Predictable project delivery** in hours, not weeks
- **Consistent code quality** across all projects
- **Rapid team scaling** without knowledge silos
- **Compound expertise** that grows with every project

Remember: Constraints drive creativity. Master this stack deeply rather than chasing the latest trends. The magic isn't in the tools—it's in how masterfully we wield them.

---

*Last Updated: 2024*
*Version: 1.0.0*