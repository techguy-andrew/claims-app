## Single-Source Developer README (Authoritative)

Use this as the one reference for developing in this repo. It defines the exact stack, structure, rules, commands, and success criteria required for smooth, error‑free development and deployment.

### 1) Tech Stack (Exact)
- **Framework**: Next.js (App Router) 15.x
- **Language**: TypeScript 5.x (strict)
- **Runtime**: Node.js 20 LTS
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: shadcn/ui (CLI copy only)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 5.x
- **Auth**: Clerk (DISABLED by default; enable when needed)
- **Deployment**: Vercel
- **Package Manager**: pnpm

### 2) Repo Layout (Authoritative Paths)
- **Root layout and header**
  - `src/app/layout.tsx` uses `Navigation` with `TopBar`
  - `src/components/layouts/Navigation.tsx` (client) + `TopBar.tsx`
- **Core UI**
  - `src/components/ui/*` shadcn/ui components only
  - `src/components/custom/ItemCard.tsx` (inline editing reference)
- **Data**
  - `src/lib/prisma.ts` (Prisma client)
  - `prisma/schema.prisma`, `prisma/migrations/*`, `prisma/seed.ts`
- **Routes**
  - `src/app/claims/page.tsx` and `src/app/claims/[claimId]/page.tsx` (live demo)
- **Auth middleware**
  - `src/middleware.ts` (pass‑through)
  - `src/middleware.ts.disabled` (Clerk‑enabled; rename to enable)

### 3) Setup (Local)
- **Enable pnpm**
  - `corepack enable && corepack prepare pnpm@latest --activate`
- **Install**
  - `pnpm install`
- **Environment: create `.env.local`**
  - Database (Neon; pooled is mandatory)
    - `DATABASE_URL="postgresql://...?sslmode=require&pgbouncer=true"`
    - `DATABASE_URL_UNPOOLED="postgresql://...?sslmode=require"`
  - Clerk (only if enabling auth)
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."`
    - `CLERK_SECRET_KEY="sk_..."`
- **Prisma**
  - Dev push: `pnpm db:push`
  - Migrate (prod): `pnpm db:migrate --name init`
  - Optional: `pnpm db:seed`, `pnpm db:studio`
- **Run**
  - `pnpm dev`

### 4) Commands
- **Dev/build/quality**
  - `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm type-check`
- **Prisma**
  - `pnpm db:push`, `pnpm db:migrate`, `pnpm db:studio`, `pnpm db:generate`, `pnpm db:seed`
- **Maintenance**
  - `pnpm update`
  - `npx shadcn@latest diff` (component drift)

### 5) Hard Rules (Must Follow)
- **UI**
  - Use shadcn/ui exclusively; install via CLI; do not npm‑install other UI kits.
  - Spacing is container‑managed with gap utilities only.
    - No `space-x|space-y`, no `mt|mb|mx|my`, no fixed widths unless necessary.
  - Layout patterns:
    - Vertical stacks: `flex flex-col gap-3|4|6`
    - Content/actions: `grid grid-cols-[1fr,auto] gap-6`
- **Server/Client boundaries**
  - Server Components: data fetching; no event handlers passed as props.
  - Client Components: interactivity and event handling only; no `async` component functions.
  - Pass only serializable props across the boundary.
- **Inline editing (reference: `ItemCard`)**
  - Use `contentEditable` while editing; maintain explicit view/edit mode.
  - Keyboard: Enter = Save, Escape = Cancel.
  - Optional handlers: `onSave?.(...)`, `onDelete?.()`, etc.
- **Data**
  - Use `src/lib/prisma.ts`; never create ad‑hoc Prisma clients.
  - Use pooled connection string in all environments.
- **Types/validation**
  - TypeScript strict; no `any`. Use `zod` for runtime validation when needed.
- **Components**
  - Don’t re‑implement shadcn components; extend locally when needed.
  - Keep props typed; mark optional with `?`; prefer readonly where applicable.

### 6) Patterns (Copy‑Paste Ready)
- **Server Component with params (Next 15)**
```tsx
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const data = await prisma.model.findMany({ where: { id } })
  return <Component data={data} />
}
```

- **Client interactivity wrapper**
```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Interactive({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial)
  return <Button onClick={() => setValue('updated')}>{value}</Button>
}
```

- **Inline editing core**
```tsx
// Props: { editable?: boolean; onSave?: (d:{title:string;description:string}) => void }
const [isEditing, setIsEditing] = useState(false)

function save() {
  const title = titleRef.current?.textContent ?? ''
  const description = descRef.current?.textContent ?? ''
  onSave?.({ title, description })
  setIsEditing(false)
}
```

- **Grid content/actions**
```tsx
<div className="grid grid-cols-[1fr,auto] gap-6 items-start">
  <div className="flex flex-col gap-3">{/* content */}</div>
  <div className="flex items-center gap-1 shrink-0">{/* actions */}</div>
  </div>
```

### 7) Auth (Clerk)
- Default: disabled for speed.
- To enable:
  - Rename `src/middleware.ts.disabled` → `src/middleware.ts`
  - Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` in `.env.local` and Vercel
- Public routes should be listed in middleware if required.

### 8) Deployment (Vercel)
- **Requirements**
  - Build passes locally: `pnpm build`
  - Zero TypeScript errors: `pnpm type-check`
  - Zero ESLint errors: `pnpm lint`
  - Env vars set in Vercel
  - DB migrations applied
- **Steps**
  - Push to `main` → Vercel auto‑deploys
  - If enabling auth, ensure URLs configured in Clerk

### 9) Success Criteria (Blocking)
- **Build**: passes locally and on CI
- **TypeScript**: zero errors
- **ESLint**: zero errors
- **UI compliance**
  - shadcn only
  - gap‑based spacing only
  - `Navigation` header offset preserved (`pt-16`)
  - Inline editing follows reference pattern
- **Performance targets**
  - Lighthouse > 95, FCP < 1s (typical static/demo routes)
- **Data**
  - Prisma via `@/lib/prisma`
  - Pooled Neon connection string

### 10) PR Review Checklist
- **Architecture**
  - Server/Client boundary respected; no handlers in Server Components
  - Only serializable props across boundary
- **UI**
  - shadcn components used
  - Spacing via gap; no margins/space utilities
  - Layout patterns followed (`flex-col gap-*`, `grid-cols-[1fr,auto]`)
- **Types**
  - Strict typing, no `any`
  - Runtime validation where applicable
- **Data**
  - Prisma usage via `@/lib/prisma`
  - Queries efficient and on the server
- **Quality**
  - `pnpm build`, `pnpm lint`, `pnpm type-check` all pass

### 11) Live Demo Reference Routes
- `GET /claims`
- `GET /claims/[claimId]`

These routes demonstrate the approved layout, spacing, inline editing pattern, and server/client boundaries.


