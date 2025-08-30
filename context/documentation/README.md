# **Agency Development Playbook: From Zero to MVP in 2 Hours**

**The ultimate Next.js + shadcn/ui rapid prototyping system for software agencies who ship fast.**

## **Executive Summary**

This is our complete development template following the **"Forever Tech Stack"** philosophy - one proven stack mastered deeply, used for every project. Every technology choice has been carefully selected for reliability, scalability, and developer efficiency.

### **Quick Reference: The Stack**

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js (App Router) | 15.0+ | React framework with server components |
| **Language** | TypeScript | 5.3+ | Type-safe JavaScript |
| **Runtime** | Node.js | 20 LTS | Server runtime |
| **Database** | PostgreSQL (Neon) | Latest | Scalable relational database |
| **ORM** | Prisma | 5.0+ | Type-safe database client |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first CSS |
| **Components** | shadcn/ui | Latest | CLI-based component library |
| **Auth** | Clerk | Latest | Managed authentication |
| **Deployment** | Vercel | Latest | Edge deployment platform |
| **Package Manager** | pnpm | Latest | Fast, efficient package management |

## 🚀 Quick Start (Under 2 Minutes)

```bash
# Create new project
pnpm create next-app@latest project-name \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd project-name

# Install core dependencies
pnpm add @prisma/client @clerk/nextjs
pnpm add -D prisma

# Initialize components and database
npx shadcn@latest init
npx prisma init
```

**Result**: Full-stack app with auth, database, and UI components ready to customize.

## ⚡ The 2-Hour MVP Challenge

This template is optimized for one goal: **delivering working demos to clients FAST**. What you can build in 2 hours:

- ✅ Complete SaaS dashboard with authentication
- ✅ Marketing site with pricing, features, testimonials  
- ✅ E-commerce storefront with product catalog
- ✅ Admin panel with data tables and forms
- ✅ Real-time collaborative features
- ✅ API integrations with type safety

All with production-ready code, perfect Lighthouse scores, and no technical debt.

## 🎯 Why This Stack

### **Standardization = Speed**

When every project uses identical technologies, developers achieve unconscious competence. Complex features become muscle memory. Debugging becomes predictable. Performance optimization becomes systematic.

### **What We Explicitly Don't Do**

- No experimental frameworks
- No proprietary component libraries
- No custom authentication systems  
- No self-managed infrastructure
- No client-side data fetching when server-side works
- No premature optimization

**Remember: If a technology is not explicitly listed in this document, it is not approved for use.**

## 📋 Prerequisites

1. **Node.js 20 LTS** or newer - [Download here](https://nodejs.org/)
2. **Git** - [Download here](https://git-scm.com/)
3. **pnpm** - Fast, efficient package management
4. **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

Enable pnpm if needed:
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## 🛠️ Complete Setup Guide

### Step 1: Project Initialization Sequence

```bash
# 1. Create Next.js project with exact configuration
pnpm create next-app@latest project-name \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd project-name

# 2. Install core dependencies
pnpm add @prisma/client @clerk/nextjs
pnpm add -D prisma

# 3. Initialize shadcn/ui with default configuration
npx shadcn@latest init

# 4. Add essential components (every project needs these)
npx shadcn@latest add button card form input label toast

# 5. Setup Prisma
npx prisma init

# 6. Configure environment variables
echo "DATABASE_URL=\"your-neon-connection-string\"" >> .env.local
echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=\"pk_...\"" >> .env.local
echo "CLERK_SECRET_KEY=\"sk_...\"" >> .env.local
```

### Step 2: Required Directory Structure

```
project-name/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   └── dashboard/page.tsx
│   │   ├── (marketing)/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   └── webhooks/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/              # shadcn/ui components only
│   │   └── [feature]/       # Feature-specific components
│   ├── lib/
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── types/
│   │   └── index.ts
│   └── hooks/
│       └── use-*.ts
├── public/
├── .env.local
├── components.json
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Step 3: Service Configuration

#### Database (PostgreSQL via Neon)

1. Go to [Neon.tech](https://neon.tech) and create account
2. Click "Create Database" 
3. **IMPORTANT**: Use the pooled connection string
4. Add to `.env.local`:
```env
DATABASE_URL="postgresql://...?sslmode=require&pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://...?sslmode=require"
```

#### Authentication (Clerk)

1. Go to [Clerk.com](https://clerk.com) and create account
2. Create new application
3. Copy API keys from dashboard
4. Add to `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
```

#### Database Schema Setup

```bash
# Push schema to database
pnpm db:push

# Or create migration for production
pnpm db:migrate --name init
```

## 🎨 Using shadcn/ui Components

### The shadcn/ui Philosophy

1. **Copy, Don't Import**: Components become part of your codebase
2. **CLI-First Development**: Install components in seconds
3. **Ownership Model**: Modify components as needed
4. **TypeScript Integration**: Fully typed with perfect autocomplete

### Essential Components (Add These First)

```bash
# Core UI elements
npx shadcn@latest add button card form input label toast

# Forms and inputs  
npx shadcn@latest add select textarea checkbox radio-group switch

# Feedback and display
npx shadcn@latest add alert badge skeleton separator

# Navigation
npx shadcn@latest add dropdown-menu navigation-menu

# Data display
npx shadcn@latest add table data-table tabs

# Overlays
npx shadcn@latest add sheet dialog alert-dialog
```

### Component Usage Pattern

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

## 🏗️ Progressive Enhancement Architecture

### Tier 1: Static Sites

```tsx
// Simple marketing pages using RSC
export default async function LandingPage() {
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Server-rendered content with perfect SEO</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Tier 2: Interactive Applications

```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function InteractiveFeature() {
  const [count, setCount] = useState(0)
  return (
    <Button onClick={() => setCount(count + 1)}>
      Count: {count}
    </Button>
  )
}
```

### Tier 3: Full-Stack Applications

```tsx
// Database integration with Prisma
import { prisma } from '@/lib/db'

export async function UserList() {
  const users = await prisma.user.findMany({
    include: { posts: true }
  })
  
  return <DataTable columns={columns} data={users} />
}

// Server Actions for mutations
async function createPost(formData: FormData) {
  'use server'
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  await prisma.post.create({
    data: { title, content, authorId: userId }
  })
  
  revalidatePath('/posts')
}
```

### Tier 4: Enterprise Applications

Add approved services only when required:
- Redis caching with Upstash
- Real-time with Pusher
- Payments with Stripe
- File uploads with UploadThing
- Email with Resend
- Analytics with PostHog
- Error tracking with Sentry

## 📊 Development Patterns

### Data Fetching Hierarchy

```tsx
// 1. Server Components (Default)
async function ServerComponent() {
  const data = await prisma.post.findMany()
  return <PostList posts={data} />
}

// 2. Server Actions (Form submissions)
async function submitForm(formData: FormData) {
  'use server'
  const result = await prisma.record.create({...})
  revalidatePath('/path')
  return { success: true }
}

// 3. API Routes (External access only)
export async function GET() {
  const data = await prisma.post.findMany()
  return Response.json(data)
}
```

### Type Safety Throughout

```tsx
import { z } from 'zod'

// Define validation schema
const PostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  published: z.boolean().default(false)
})

// Infer TypeScript type
type PostInput = z.infer<typeof PostSchema>

// Validate and create with full type safety
export async function createPost(input: PostInput) {
  const validated = PostSchema.parse(input)
  return await prisma.post.create({ data: validated })
}
```

### Performance Optimization

```tsx
// 1. Server Components First
export default async function ProductList() {
  const products = await prisma.product.findMany()
  return <ProductGrid products={products} />
}

// 2. Suspense Boundaries
export default function Layout({ children }: Props) {
  return (
    <Suspense fallback={<Skeleton className="w-full h-96" />}>
      {children}
    </Suspense>
  )
}

// 3. Parallel Data Loading
export default async function DashboardPage() {
  const [user, posts, analytics] = await Promise.all([
    prisma.user.findUnique({ where: { id } }),
    prisma.post.findMany({ where: { authorId: id } }),
    getAnalytics(id)
  ])
  
  return <Dashboard user={user} posts={posts} analytics={analytics} />
}
```

## 🛠️ Available Commands

```bash
# Development
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Build for production - MUST pass before committing
pnpm lint         # Run ESLint - fix all errors before pushing
pnpm type-check   # TypeScript checking - no errors allowed

# Database (Prisma + Neon)
pnpm db:push      # Push schema to database (development)
pnpm db:migrate   # Create migration (production)
pnpm db:studio    # Visual database editor
pnpm db:generate  # Generate Prisma client
pnpm db:seed      # Seed database with test data

# Maintenance
pnpm update                  # Update dependencies
npx shadcn@latest diff       # Check for component updates
```

## 📈 Performance Targets

Every deployment must achieve:
- **Lighthouse Score:** > 95
- **First Contentful Paint:** < 1 second
- **Type Coverage:** 100%
- **Build Time:** < 2 minutes
- **Zero TypeScript errors**
- **Zero ESLint errors**

## ✅ Pre-deployment Checklist

- [ ] TypeScript compilation successful (`pnpm type-check`)
- [ ] ESLint passing (`pnpm lint`)
- [ ] Build completes without errors (`pnpm build`)
- [ ] Environment variables configured in Vercel
- [ ] Database migrations applied
- [ ] Authentication endpoints configured
- [ ] Error boundaries in place
- [ ] Loading states implemented
- [ ] Meta tags and SEO configured
- [ ] Performance budget met

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Add environment variables from `.env.local`
4. Deploy

Your site deploys automatically on every push to main branch.

### Environment Variables for Production

```env
# Database (Neon - use pooled connection)
DATABASE_URL="postgresql://...?pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://..."

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Add others as needed (see Approved Extended Services)
```

## 📦 Approved Extended Services

Add these **only when required** by project specifications:

### Form Handling
```bash
pnpm add react-hook-form @hookform/resolvers zod
```

### API Development
```bash
pnpm add @trpc/server @trpc/client @trpc/next @tanstack/react-query
```

### Email Service
```bash
pnpm add resend
```

### File Uploads
```bash
pnpm add uploadthing @uploadthing/react
```

### Payments
```bash
pnpm add stripe @stripe/stripe-js
```

### Real-time Features
```bash
pnpm add pusher pusher-js
```

### Caching & Rate Limiting
```bash
pnpm add @upstash/redis @upstash/ratelimit
```

### Analytics
```bash
pnpm add posthog-js
```

### Error Tracking
```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## 🐛 Troubleshooting

### "Command not found: pnpm"
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### "Cannot connect to database"
1. Verify `DATABASE_URL` uses pooled connection string
2. Check database is active on Neon.tech
3. Run `pnpm db:push` to sync schema

### "Clerk authentication not working"
1. Verify Clerk keys in `.env.local`
2. Check middleware configuration
3. Ensure URLs match in Clerk dashboard

### TypeScript errors
```bash
pnpm type-check  # See all errors
pnpm tsc --noEmit  # Verify compilation
```

## 🔧 Weekly Maintenance Tasks

```bash
# Update dependencies
pnpm update

# Check for shadcn/ui updates
npx shadcn@latest diff

# Verify TypeScript compilation
pnpm type-check

# Run database migrations
npx prisma migrate dev
```

## 📖 Testing Philosophy

TypeScript serves as our first line of defense:

```tsx
// TypeScript catches errors at compile time
interface Props {
  user: User      // Prisma type
  posts: Post[]   // Prisma type
}

// Component props are validated by TypeScript
export function UserDashboard({ user, posts }: Props) {
  // Type errors caught at build time
}
```

For critical paths, use integration tests:

```tsx
// __tests__/auth.test.ts
import { expect, test } from '@playwright/test'

test('user can sign in', async ({ page }) => {
  await page.goto('/sign-in')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

## 💡 Git Workflow

```bash
# Branch naming
feature/add-user-dashboard
fix/auth-redirect-issue
chore/update-dependencies

# Commit messages (conventional commits)
feat: add user dashboard
fix: resolve auth redirect issue
chore: update dependencies
docs: update README

# Daily workflow
git pull origin main     # Get latest changes
pnpm install             # Update dependencies if needed
pnpm dev                 # Start development

# Save work
git add .
git commit -m "feat: description"
git push origin feature-branch
```

## 🎯 The Technical Truth

### Why This Stack Is Non-Negotiable

1. **React is the industry standard** - Not a trend, a foundation
2. **Next.js is the React framework** - Officially recommended by React team
3. **TypeScript is how professionals write JavaScript** - Type safety prevents bugs
4. **PostgreSQL is the database that scales** - From startup to enterprise
5. **Tailwind is modern CSS** - Utility-first is proven at scale
6. **shadcn/ui is ownership without overhead** - Components you control
7. **Clerk solves authentication permanently** - Enterprise auth in minutes
8. **Vercel is deployment solved** - Zero-config, infinite scale

### The Power of Consistency

When every project follows identical patterns:
- **Rapid Development:** Features built with confidence
- **Predictable Debugging:** Bugs found quickly
- **Systematic Optimization:** Performance improved methodically
- **Seamless Handoffs:** Any developer can join any project
- **Compound Learning:** Skills transfer between projects
- **Reduced Complexity:** One stack to master deeply

## 📝 Common Patterns & Solutions

### Authentication Flow

```tsx
// middleware.ts
import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up'],
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url)
      return Response.redirect(signInUrl)
    }
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

### Dynamic Metadata

```tsx
// app/posts/[id]/page.tsx
export async function generateMetadata({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { id: params.id }
  })
  
  return {
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      title: post?.title,
      description: post?.excerpt,
      images: [post?.image]
    }
  }
}
```

### Search Implementation

```tsx
// Server Component with search
export default async function SearchPage({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  const results = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: searchParams.q, mode: 'insensitive' } },
        { content: { contains: searchParams.q, mode: 'insensitive' } }
      ]
    }
  })
  
  return <SearchResults results={results} />
}
```

## 🚫 What NOT to Do

Following our philosophy, avoid these:

- ❌ **Don't install different UI libraries** - Use shadcn/ui components exclusively
- ❌ **Don't create custom authentication** - Clerk handles this
- ❌ **Don't use different databases** - PostgreSQL via Neon only
- ❌ **Don't add CSS-in-JS libraries** - Tailwind CSS only
- ❌ **Don't create microservices** - Monolithic Next.js apps
- ❌ **Don't use Pages Router** - App Router only
- ❌ **Don't skip TypeScript** - Always use strict mode
- ❌ **Don't ignore build errors** - Fix before committing

## 💼 The Agency Advantage

This stack enables:

1. **Live Demos in First Meetings** - Not mockups, real working software
2. **Same-Day Prototypes** - "Let me build that while we talk"
3. **Production-Ready from Day 1** - No throwaway code
4. **Predictable Pricing** - Same stack = accurate estimates
5. **Fast Iterations** - Changes in minutes, not days
6. **One-Person Efficiency** - Do the work of a 5-person team

## 🎓 Learning Resources

- **Next.js**: [Learn Next.js](https://nextjs.org/learn) - Official interactive tutorial
- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- **Tailwind CSS**: [Tailwind CSS Docs](https://tailwindcss.com/docs)
- **Prisma**: [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- **shadcn/ui**: [Component Docs](https://ui.shadcn.com/docs/components)
- **Clerk**: [Clerk Docs](https://clerk.com/docs)

## 📝 Conclusion

This playbook is our single source of truth. The stack is decided. The patterns are defined. Every decision has been made for maximum productivity, reliability, and scalability.

**The foundation is complete. Now we build.**

---

*Agency Development Playbook - Where expertise compounds with every project.*
*Built with shadcn/ui, Next.js, and the power of focused mastery.*