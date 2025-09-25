# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Authoritative Reference

**IMPORTANT**: This repository has a comprehensive developer guide at `context/documentation/README.md` that serves as the single source of truth for all development practices, commands, architecture patterns, and deployment procedures. Always consult that file first for detailed information.

## Quick Command Reference

### Development
```bash
pnpm dev                # Start development server
pnpm build              # Production build (includes Prisma generate + db:push)
pnpm lint               # ESLint check
pnpm type-check         # TypeScript validation
```

### Database (Prisma)
```bash
pnpm db:push            # Push schema changes (development)
pnpm db:migrate         # Create and run migrations (production)
pnpm db:studio          # Database browser
pnpm db:generate        # Generate Prisma client
pnpm db:seed            # Seed with sample data
```

## Architecture Summary

- **Framework**: Next.js 15 App Router with TypeScript
- **Database**: PostgreSQL via Prisma ORM (pooled Neon connection required)
- **Authentication**: Clerk (disabled by default - see middleware.ts.disabled)
- **UI**: shadcn/ui components exclusively with Tailwind CSS
- **Package Manager**: pnpm (corepack required)

## Critical Development Rules

### UI Components
- **Only use shadcn/ui components** - install via CLI, no other UI libraries
- **Spacing via gap utilities only** - no margins (`mt`, `mb`, `mx`, `my`) or space utilities
- **Layout patterns**:
  - Vertical stacks: `flex flex-col gap-3|4|6`
  - Content/actions: `grid grid-cols-[1fr,auto] gap-6`

### Server/Client Boundaries
- **Server Components**: Handle data fetching, no event handlers as props
- **Client Components**: Handle interactivity only, no `async` functions
- **Pass only serializable props** across boundaries

### Data Access
- **Always use `src/lib/prisma.ts`** - never create ad-hoc Prisma clients
- **Use pooled connection strings** in all environments

### Code Quality
- **TypeScript strict mode** - no `any` types
- **All builds must pass**: `pnpm build && pnpm lint && pnpm type-check`

## Key Files and Structure

```
src/
├── app/layout.tsx              # Root layout with Navigation wrapper
├── components/
│   ├── ui/                     # shadcn/ui components only
│   ├── custom/ItemCard.tsx     # Reference for inline editing pattern
│   └── layouts/Navigation.tsx  # Main navigation component
├── lib/prisma.ts              # Database client (use exclusively)
└── middleware.ts              # Auth passthrough (see .disabled version)

prisma/
├── schema.prisma              # Database schema
└── seed.ts                    # Database seeding

context/documentation/README.md # AUTHORITATIVE development guide
```

## Authentication Setup
Auth is disabled by default for faster development. To enable:
1. Rename `src/middleware.ts.disabled` → `src/middleware.ts`
2. Set Clerk environment variables in `.env.local`

## Reference Implementation
- **Live demo routes**: `/claims` and `/claims/[claimId]`
- **Inline editing pattern**: See `components/custom/ItemCard.tsx`
- **Layout examples**: Follow existing claim pages for approved patterns

## Before Deployment
Ensure all quality checks pass:
```bash
pnpm build && pnpm lint && pnpm type-check
```