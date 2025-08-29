# The Dogmatic Agency Stack: One Stack to Rule Them All

## The Non-Negotiable Truth

This is not a suggestion. This is THE stack. Every project, from a $500 landing page to a $500,000 enterprise PWA, uses these exact technologies. No exceptions. No alternatives. No debates.

## Core Stack (MANDATORY - Every Single Project)

### 1. **Next.js 15.0+** (App Router ONLY)
- **Why**: Server components, streaming, edge runtime
- **Never**: Pages router, Gatsby, Remix, or any other framework
- **Command**: `pnpm create next-app@latest --typescript --tailwind --app --src-dir --import-alias "@/*"`

### 2. **TypeScript 5.3+** (Strict Mode ENFORCED)
- **Config**: `"strict": true, "noUncheckedIndexedAccess": true`
- **Why**: Type safety is non-negotiable for professional work
- **Never**: JavaScript, loose TypeScript, `any` types

### 3. **PostgreSQL via Neon**
- **Why**: Serverless, branching, autoscaling, 0.5s cold starts
- **Connection**: Pooled connection string ALWAYS
- **Never**: MySQL, MongoDB, SQLite, Firebase, Supabase
- **Setup**: `neon.tech` → Create database → Copy pooled connection string

### 4. **Prisma ORM** (5.0+)
- **Why**: Type-safe database access, migrations, studio
- **Commands**: 
  ```bash
  pnpm add -D prisma
  pnpm add @prisma/client
  npx prisma init
  npx prisma db push  # Development
  npx prisma migrate deploy  # Production
  ```
- **Never**: Drizzle, TypeORM, raw SQL, Sequelize

### 5. **Tailwind CSS 3.4+**
- **Config**: Default config with these additions ONLY:
  ```js
  colors: { 
    brand: { /* client colors */ } 
  }
  ```
- **Why**: Utility-first, no CSS files, perfect with shadcn/ui
- **Never**: CSS modules, styled-components, emotion, Sass

### 6. **shadcn/ui** (CLI Components ONLY)
- **Why**: Copy ownership, full control, no breaking changes
- **Install Method**: 
  ```bash
  npx shadcn@latest init
  npx shadcn@latest add [component]
  ```
- **Never**: Install as npm package, Radix UI directly, MUI, Ant Design, Chakra
- **Location**: `src/components/ui/` ONLY

### 7. **Clerk** (Authentication)
- **Why**: Production-ready auth in 5 minutes, social logins, MFA
- **Setup**:
  ```bash
  pnpm add @clerk/nextjs
  # Add to .env.local:
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
  CLERK_SECRET_KEY=
  ```
- **Never**: NextAuth, Auth0, Supabase Auth, custom JWT

### 8. **Vercel** (Deployment)
- **Why**: Zero-config, preview deployments, edge functions
- **Deploy**: `vercel` or git push to connected repo
- **Never**: Netlify, AWS, Google Cloud, self-hosted

### 9. **pnpm** (Package Manager)
- **Why**: Fast, efficient, strict dependencies
- **Enable**: `corepack enable && corepack prepare pnpm@latest --activate`
- **Never**: npm, yarn, bun

## Progressive Enhancement Tiers

### Tier 0: Landing Page (30 minutes)
```bash
npx shadcn@latest add button card badge
```
- Static page with CTAs
- No database needed
- Deploy to Vercel

### Tier 1: Marketing Site (2 hours)
```bash
npx shadcn@latest add navigation-menu sheet accordion tabs
```
- Multi-page marketing site
- Contact forms via Resend
- Basic analytics with PostHog

### Tier 2: SaaS MVP (1 day)
```bash
npx shadcn@latest add form dialog table dropdown-menu avatar
```
- Full CRUD operations
- User authentication with Clerk
- Database with Prisma + Neon
- Stripe for payments

### Tier 3: Enterprise PWA (1 week)
```bash
npx shadcn@latest add data-table command chart calendar select
```
- Offline-first with service workers
- Real-time with Pusher
- Advanced caching with Upstash Redis
- Full monitoring with Sentry

## The Standardized Project Structure (EXACT)

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
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (marketing)/
│   │   │   ├── about/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   ├── clerk/route.ts
│   │   │   │   └── stripe/route.ts
│   │   │   └── trpc/[trpc]/route.ts
│   │   ├── manifest.ts        # PWA manifest
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/              # shadcn/ui components ONLY
│   │   ├── auth/            # Clerk wrapper components
│   │   ├── dashboard/       # Dashboard-specific
│   │   ├── marketing/       # Marketing-specific
│   │   └── shared/          # Reusable across routes
│   ├── lib/
│   │   ├── db.ts            # Prisma client singleton
│   │   ├── auth.ts          # Clerk helpers
│   │   ├── utils.ts         # cn() and helpers
│   │   ├── validations.ts   # Zod schemas
│   │   └── constants.ts     # App constants
│   ├── server/              
│   │   ├── api/
│   │   │   ├── routers/     # tRPC routers
│   │   │   ├── root.ts      # tRPC root
│   │   │   └── trpc.ts      # tRPC instance
│   │   └── db/
│   │       └── queries.ts   # Database queries
│   ├── types/               
│   │   └── index.ts         # Global types
│   └── hooks/               
│       ├── use-toast.ts     # shadcn toast hook
│       └── use-mobile.ts    # Responsive hook
├── public/
│   ├── icons/               # PWA icons
│   └── og.png              # Open Graph image
├── .env.example
├── .env.local
├── .npmrc                   # pnpm config
├── components.json          # shadcn/ui config
├── next.config.mjs
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Extended Stack (Add ONLY When Required)

### Type Safety & API Layer
- **tRPC** - End-to-end typesafe APIs
  ```bash
  pnpm add @trpc/server @trpc/client @trpc/next @tanstack/react-query
  ```
- **Zod** - Runtime validation
  ```bash
  pnpm add zod
  ```

### State Management
- **TanStack Query** - Server state (comes with tRPC)
- **Zustand** - Client state ONLY when Context isn't enough
  ```bash
  pnpm add zustand
  ```

### Forms
- **React Hook Form** - Complex forms only
  ```bash
  pnpm add react-hook-form @hookform/resolvers
  ```

### Services (Use Exact Providers)

#### Email: **Resend**
```bash
pnpm add resend
# Add to .env.local: RESEND_API_KEY=
```

#### File Upload: **Uploadthing**
```bash
pnpm add uploadthing @uploadthing/react
# Add to .env.local: UPLOADTHING_SECRET=
```

#### Payments: **Stripe**
```bash
pnpm add stripe @stripe/stripe-js
# Add to .env.local: 
# STRIPE_SECRET_KEY=
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

#### Real-time: **Pusher**
```bash
pnpm add pusher pusher-js
# Add to .env.local:
# PUSHER_APP_ID=
# NEXT_PUBLIC_PUSHER_KEY=
```

#### Caching: **Upstash Redis**
```bash
pnpm add @upstash/redis @upstash/ratelimit
# Add to .env.local: 
# UPSTASH_REDIS_REST_URL=
# UPSTASH_REDIS_REST_TOKEN=
```

#### Analytics: **PostHog**
```bash
pnpm add posthog-js
# Add to .env.local: NEXT_PUBLIC_POSTHOG_KEY=
```

#### Error Tracking: **Sentry**
```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## The shadcn/ui Command Bible

### Essential First Components (Every Project)
```bash
# The Foundation - Install these IMMEDIATELY
npx shadcn@latest add button input label card toast
```

### Component Installation by Use Case

#### Authentication Pages
```bash
npx shadcn@latest add form input label button card separator
```

#### Dashboard Layout
```bash
npx shadcn@latest add avatar dropdown-menu sheet sidebar navigation-menu
```

#### Data Display
```bash
npx shadcn@latest add table data-table badge skeleton tabs
```

#### Forms & Input
```bash
npx shadcn@latest add form select checkbox radio-group switch textarea
```

#### Feedback & Overlays
```bash
npx shadcn@latest add alert alert-dialog dialog toast progress
```

#### Marketing Pages
```bash
npx shadcn@latest add accordion carousel testimonial aspect-ratio
```

#### Advanced Interactions
```bash
npx shadcn@latest add command combobox date-picker calendar
```

## PWA Configuration (For Tier 3)

### 1. Install PWA Dependencies
```bash
pnpm add next-pwa
pnpm add -D @types/serviceworker
```

### 2. Configure next.config.mjs
```js
import withPWA from 'next-pwa'

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

export default config({
  // your next config
})
```

### 3. Add Manifest (app/manifest.ts)
```ts
export default {
  name: 'App Name',
  short_name: 'App',
  theme_color: '#000000',
  background_color: '#ffffff',
  display: 'standalone',
  orientation: 'portrait',
  scope: '/',
  start_url: '/',
  icons: [
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    }
  ]
}
```

## The Absolute Rules (NO EXCEPTIONS)

### ALWAYS
1. Use `pnpm` for all installations
2. Use `npx shadcn@latest add` for UI components
3. Use Neon pooled connections
4. Use Clerk for auth (even for simple projects)
5. Deploy to Vercel
6. Use TypeScript strict mode
7. Keep components in `src/components/ui/`
8. Use App Router
9. Use server components by default
10. Validate with Zod

### NEVER
1. Install shadcn/ui as npm dependency
2. Use Pages Router
3. Use any CSS-in-JS library
4. Create custom auth
5. Use Firebase/Supabase
6. Install Material-UI, Ant Design, Chakra
7. Use npm or yarn
8. Deploy to Netlify/AWS
9. Use JavaScript files
10. Use MongoDB

## The 5-Minute Quick Start

```bash
# 1. Create project (30 seconds)
pnpm create next-app@latest my-app --typescript --tailwind --app --src-dir --import-alias "@/*"
cd my-app

# 2. Install core dependencies (1 minute)
pnpm add @prisma/client @clerk/nextjs
pnpm add -D prisma

# 3. Initialize shadcn/ui (30 seconds)
npx shadcn@latest init

# 4. Add essential components (1 minute)
npx shadcn@latest add button card form input label toast

# 5. Setup Prisma (30 seconds)
npx prisma init

# 6. Configure environment (1 minute)
echo "DATABASE_URL='your-neon-pooled-url'" >> .env.local
echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY='pk_test_...'" >> .env.local
echo "CLERK_SECRET_KEY='sk_test_...'" >> .env.local

# 7. Push schema and start (1 minute)
npx prisma db push
pnpm dev
```

## The Client Pitch: "One Stack, Every Scale"

"We use the exact same technology whether building your landing page or your enterprise application. This means:
- No rewrites as you grow
- No technology migrations
- No learning new systems
- Your MVP becomes your production app
- Every developer knows exactly what to expect
- Maintenance costs stay predictable
- Updates are always compatible"

## Digital Nomad Optimizations

### Offline Development
- Prisma Studio for local database management
- Service workers for offline functionality
- Local Postgres with Docker when needed

### Low Bandwidth Mode
- Vercel CLI for deployments
- Cached shadcn components
- Local development with mock data

### Time Zone Agnostic
- All timestamps in UTC
- Clerk handles user timezones
- Deployment automation via GitHub

## Monitoring & Maintenance

### Required Monitoring Setup (Production)
```bash
# Error tracking
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs

# Analytics
pnpm add posthog-js

# Performance
# Use Vercel Analytics (built-in)
```

### Weekly Maintenance Checklist
- [ ] Update dependencies: `pnpm update`
- [ ] Check Sentry for errors
- [ ] Review PostHog analytics
- [ ] Update shadcn components: `npx shadcn@latest diff`
- [ ] Run type check: `pnpm tsc --noEmit`
- [ ] Run Prisma migrations: `npx prisma migrate dev`

## The Success Metrics

Every project built with this stack should achieve:
- **First Paint**: < 1 second
- **Lighthouse Score**: > 95
- **Type Coverage**: 100%
- **Build Time**: < 2 minutes
- **Deployment**: < 60 seconds
- **Time to MVP**: < 1 day
- **Component Reuse**: > 80%
- **Client Satisfaction**: 100%

This is not a guide. This is the law. Follow it exactly, and you'll build faster, better, and more maintainable applications than 99% of development teams.