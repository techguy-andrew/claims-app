# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a rapid prototyping template for building client demos and MVPs in under 2 hours. It follows a strict "Forever Tech Stack" philosophy where every project uses the exact same technologies without exception.

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

### Routing Structure
```
src/app/
├── (auth)/          # Authentication pages (when Clerk enabled)
├── (dashboard)/     # Protected routes (when auth enabled)
├── (marketing)/     # Public marketing pages
└── api/            # API routes and webhooks
```

### State Management Hierarchy
1. Server Components + Props (default)
2. React Context (client state)
3. TanStack Query (server state)
4. Zustand (only if absolutely necessary)

## Environment Variables

Required for production deployment:
```bash
# Database (get from neon.tech)
DATABASE_URL=""              # Pooled connection
DATABASE_URL_UNPOOLED=""     # Direct connection

# Authentication (get from clerk.com) - Optional
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
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

## Common Patterns

### Adding a New Feature
1. Check if shadcn has the component: `npx shadcn@latest add [component]`
2. Create feature in appropriate route group
3. Use Server Components by default
4. Add client-side interactivity only when needed

### Form Handling
- Simple forms: Native HTML + Server Actions
- Complex forms: `react-hook-form` + `zod` validation
- Always validate on server regardless of client validation

### API Development
- Prefer Server Actions over API routes
- Use tRPC for complex APIs requiring type safety
- Webhooks go in `app/api/webhooks/`

## Project Philosophy

This template embodies specific principles:
- **One Stack**: Same technologies for every project
- **Speed First**: Ship MVPs in hours, not weeks
- **No Debates**: Technology decisions are already made
- **Copy Ownership**: Own every line via shadcn/ui's copy model
- **Progressive Enhancement**: Start simple, add complexity only when needed

## Performance Targets

Every deployment should achieve:
- Lighthouse score > 95
- First contentful paint < 1s
- Build time < 2 minutes
- Zero TypeScript errors
- Zero ESLint errors

## Debugging Production Issues

1. **Middleware Errors**: Check if Clerk keys are configured in Vercel
2. **Database Errors**: Verify DATABASE_URL uses pooled connection
3. **Build Failures**: Run `pnpm build` locally to catch errors
4. **Type Errors**: Run `pnpm type-check` to find issues

## Important Files

- `context/philosophy.md` - Project philosophy and business model
- `context/tech-stack.md` - Detailed stack specifications
- `context/development-log.md` - Project history and decisions
- `.env.local` - Local environment variables (never commit)
- `components.json` - shadcn/ui configuration