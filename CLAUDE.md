# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is our **Agency Development Playbook** implementation - a rapid prototyping system for building client demos and MVPs in under 2 hours. It follows the **"Forever Tech Stack"** philosophy where every project uses identical technologies for maximum efficiency and mastery.

## Philosophy

Our development philosophy centers on mastering one comprehensive stack rather than experimenting with multiple technologies. This isn't limitation—it's liberation. When every project uses identical technologies, developers achieve unconscious competence. Complex features become muscle memory. Debugging becomes predictable. Performance optimization becomes systematic.

**Remember: If a technology, library, or tool is not explicitly listed in this document, it is not approved for use.**

## Technology Stack

### Quick Reference: The Stack

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

## Critical Commands

### Development
```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Build for production - MUST pass before committing
pnpm lint         # Run ESLint - fix all errors before pushing
pnpm type-check   # TypeScript checking - no errors allowed
```

### Database (Prisma + Neon)
```bash
pnpm db:push      # Push schema to database (development)
pnpm db:migrate   # Create migration (production)
pnpm db:studio    # Visual database editor
pnpm db:generate  # Generate Prisma client
pnpm db:seed      # Seed database with test data
```

### Component Management (shadcn/ui)
```bash
npx shadcn@latest add [component]  # Add new UI component
npx shadcn@latest diff              # Check for component updates
```

### Maintenance
```bash
pnpm update                  # Update dependencies
pnpm tsc --noEmit           # Verify TypeScript compilation
npx prisma migrate dev      # Run database migrations
```

## Project Structure

### Required Directory Structure
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

## Architecture & Key Decisions

### Authentication Strategy
- **Clerk is currently DISABLED** for rapid prototyping
- Middleware exists in two states:
  - `src/middleware.ts` - Placeholder that passes through all requests
  - `src/middleware.ts.disabled` - Full Clerk implementation
- To enable auth: Rename `.disabled` file and add Clerk keys to environment

### Component System
- **ALL UI components come from shadcn/ui** via CLI copy (never npm install)
- Components live in `src/components/ui/` and are fully owned/customizable
- Never create custom versions of existing shadcn components
- When adding features, first check if a shadcn component exists

### Database Architecture
- PostgreSQL via Neon (serverless, branching support)
- Prisma ORM for type-safe database access
- Connection pooling is MANDATORY (use pooled connection string)
- Schema changes: Use `db:push` in dev, `db:migrate` in production

### State Management Hierarchy
1. Server Components + Props (default)
2. React Context (client state)
3. TanStack Query (server state)
4. Zustand (only if absolutely necessary)

## Development Standards

### Code Quality Requirements
1. **TypeScript strict mode always enabled**
2. **Server Components by default**
3. **Client Components only for interactivity**
4. **Prisma for all database operations**
5. **Zod for all runtime validation**
6. **shadcn/ui for all UI components**
7. **Error boundaries for all route groups**
8. **Loading states for all async operations**
9. **Neon pooled connections exclusively**

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Environment Variables

Required for production deployment:
```bash
# Database (get from neon.tech) - MUST use pooled connection
DATABASE_URL="postgresql://...?sslmode=require&pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://...?sslmode=require"

# Authentication (get from clerk.com) - Optional for prototyping
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
```

## Common Patterns

### Adding a New Feature
1. Check if shadcn has the component: `npx shadcn@latest add [component]`
2. Create feature in appropriate route group
3. Use Server Components by default
4. Add client-side interactivity only when needed

### Data Fetching Patterns
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

// 3. API Routes (When needed for external access)
export async function GET() {
  const data = await prisma.post.findMany()
  return Response.json(data)
}

// 4. tRPC (Type-safe APIs when needed)
export const appRouter = router({
  post: {
    list: publicProcedure.query(async () => {
      return await prisma.post.findMany()
    })
  }
})
```

### Type Safety Throughout
```tsx
import { z } from 'zod'

// 1. Define validation schema
const PostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  published: z.boolean().default(false)
})

// 2. Infer TypeScript type
type PostInput = z.infer<typeof PostSchema>

// 3. Validate and create with full type safety
export async function createPost(input: PostInput) {
  const validated = PostSchema.parse(input)
  return await prisma.post.create({ data: validated })
}
```

### Form Handling
- Simple forms: Native HTML + Server Actions
- Complex forms: `react-hook-form` + `zod` validation
- Always validate on server regardless of client validation

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

### State Management Patterns
```tsx
// 1. URL as State (Preferred)
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

// 2. Server State via Server Actions
async function updatePreferences(formData: FormData) {
  'use server'
  await prisma.user.update({...})
  revalidatePath('/settings')
}

// 3. Zustand (Only for complex client state)
import { create } from 'zustand'

const useStore = create((set) => ({
  cart: [],
  addItem: (item) => set((state) => ({ 
    cart: [...state.cart, item] 
  }))
}))
```

### Error Handling
```tsx
// 1. Error Boundaries
// app/(dashboard)/error.tsx
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
      <AlertDescription>
        Something went wrong: {error.message}
      </AlertDescription>
      <Button onClick={reset}>Try again</Button>
    </Alert>
  )
}

// 2. Try-Catch in Server Components
export default async function DataPage() {
  try {
    const data = await prisma.resource.findMany()
    return <DataDisplay data={data} />
  } catch (error) {
    return <Alert>Failed to load data</Alert>
  }
}

// 3. Form Validation Errors
async function submitForm(prevState: any, formData: FormData) {
  'use server'
  
  try {
    const validated = Schema.parse(Object.fromEntries(formData))
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

## Common Patterns & Solutions

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

### Infinite Scroll Pattern
```tsx
'use client'

export function InfinitePostList({ initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  const loadMore = async () => {
    const newPosts = await fetch(`/api/posts?page=${page + 1}`)
      .then(res => res.json())
    
    if (newPosts.length === 0) {
      setHasMore(false)
    } else {
      setPosts([...posts, ...newPosts])
      setPage(page + 1)
    }
  }
  
  return (
    <>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
      {hasMore && (
        <Button onClick={loadMore}>Load More</Button>
      )}
    </>
  )
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

## Approved Extended Services

Add these services **only when required** by project specifications:

### API & Validation
```bash
# Type-safe APIs
pnpm add @trpc/server @trpc/client @trpc/next @tanstack/react-query

# Schema validation
pnpm add zod
```

### Form Handling
```bash
# Complex forms only
pnpm add react-hook-form @hookform/resolvers
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

### Progressive Web App
```bash
pnpm add next-pwa
pnpm add -D @types/serviceworker
```

## Performance Targets

Every deployment should achieve:
- **Lighthouse score:** > 95
- **First contentful paint:** < 1s
- **Build time:** < 2 minutes
- **Zero TypeScript errors**
- **Zero ESLint errors**
- **Type Coverage:** 100%

## Testing Philosophy

TypeScript serves as our first line of defense:

```tsx
// TypeScript catches errors at compile time
interface Props {
  user: User      // Prisma type
  posts: Post[]   // Prisma type
}

// Component props are validated by TypeScript
export function UserDashboard({ user, posts }: Props) {
  // Implementation - type errors caught at build time
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

## Deployment Process

1. **Local Testing**: `pnpm build` must pass with zero errors
2. **Git Workflow**: 
   ```bash
   git add .
   git commit -m "type: description"  # Use conventional commits
   git push origin main
   ```
3. **Vercel**: Auto-deploys on push to main branch

## Debugging Production Issues

1. **Middleware Errors**: Check if Clerk keys are configured in Vercel
2. **Database Errors**: Verify DATABASE_URL uses pooled connection
3. **Build Failures**: Run `pnpm build` locally to catch errors
4. **Type Errors**: Run `pnpm type-check` to find issues

## Why This Stack Is Non-Negotiable

1. **React is the industry standard** - Not a trend, a foundation
2. **Next.js is the React framework** - Officially recommended by React team
3. **TypeScript is how professionals write JavaScript** - Type safety prevents bugs
4. **PostgreSQL is the database that scales** - From startup to enterprise
5. **Tailwind is modern CSS** - Utility-first is proven at scale
6. **shadcn/ui is ownership without overhead** - Components you control
7. **Clerk solves authentication permanently** - Enterprise auth in minutes
8. **Vercel is deployment solved** - Zero-config, infinite scale

## The Power of Consistency

When every project follows identical patterns, we achieve:

- **Rapid Development:** Features built with confidence
- **Predictable Debugging:** Bugs found quickly
- **Systematic Optimization:** Performance improved methodically
- **Seamless Handoffs:** Any developer can join any project
- **Compound Learning:** Skills transfer between projects
- **Reduced Complexity:** One stack to master deeply

## Important Files

- `context/tech-stack.md` - Complete Agency Development Playbook
- `context/development-log.md` - Project history and decisions
- `context/guidelines/agency-development-standards.md` - Comprehensive component and development standards
- `.env.local` - Local environment variables (never commit)
- `components.json` - shadcn/ui configuration

## Important Instruction Reminders

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- When completing a task, ALWAYS run lint and type-check commands to ensure code quality