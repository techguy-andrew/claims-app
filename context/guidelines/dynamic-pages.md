# Professional Page Architecture: The Framer-Style Container System

## The Ultimate Page Layout Pattern

Here's how to create a professional page system where every component you drop in automatically fits perfectly with consistent spacing and responsive behavior:

## 1. The Master Page Layout Component

Create this foundation that all your pages will use:

```tsx
// src/components/layouts/page-layout.tsx
import { cn } from "@/lib/utils"

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  spacing?: "tight" | "normal" | "relaxed"
}

export function PageLayout({ 
  children, 
  className,
  spacing = "normal" 
}: PageLayoutProps) {
  const spacingMap = {
    tight: "gap-12 md:gap-16 lg:gap-20",
    normal: "gap-16 md:gap-20 lg:gap-24", 
    relaxed: "gap-20 md:gap-28 lg:gap-32"
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Container that handles all spacing and padding */}
      <div className={cn(
        "flex-1 flex flex-col",
        "w-full mx-auto",
        "px-4 sm:px-6 lg:px-8", // Responsive padding
        "py-12 md:py-16 lg:py-20", // Vertical padding
        spacingMap[spacing],
        className
      )}>
        {children}
      </div>
    </main>
  )
}
```

## 2. The Section Component (Auto-Sizing Magic)

Every section automatically takes full width with proper constraints:

```tsx
// src/components/layouts/section.tsx
interface SectionProps {
  children: React.ReactNode
  className?: string
  width?: "full" | "wide" | "normal" | "narrow"
}

export function Section({ 
  children, 
  className,
  width = "normal"
}: SectionProps) {
  const widthMap = {
    full: "max-w-none", // Edge to edge
    wide: "max-w-7xl",  // 1280px
    normal: "max-w-6xl", // 1152px  
    narrow: "max-w-4xl"  // 896px
  }

  return (
    <section className={cn(
      "w-full mx-auto", // Always full width of parent
      widthMap[width],
      className
    )}>
      {children}
    </section>
  )
}
```

## 3. The Content Stack (Framer Auto-Layout)

For stacking content within sections:

```tsx
// src/components/layouts/stack.tsx
interface StackProps {
  children: React.ReactNode
  spacing?: 2 | 3 | 4 | 6 | 8 | 10 | 12 | 16
  className?: string
  direction?: "vertical" | "horizontal"
}

export function Stack({ 
  children, 
  spacing = 8,
  direction = "vertical",
  className 
}: StackProps) {
  return (
    <div className={cn(
      "flex w-full",
      direction === "vertical" ? "flex-col" : "flex-row",
      `gap-${spacing}`,
      className
    )}>
      {children}
    </div>
  )
}
```

## 4. The Grid System (Responsive by Default)

```tsx
// src/components/layouts/grid.tsx
interface GridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function Grid({ 
  children, 
  columns = 3,
  className 
}: GridProps) {
  const columnMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  return (
    <div className={cn(
      "grid w-full gap-6 md:gap-8",
      columnMap[columns],
      className
    )}>
      {children}
    </div>
  )
}
```

## 5. Using It All Together (The Magic!)

Now ANY component you drop in automatically fits:

```tsx
// app/(marketing)/page.tsx
import { PageLayout } from "@/components/layouts/page-layout"
import { Section } from "@/components/layouts/section"
import { Stack } from "@/components/layouts/stack"
import { Grid } from "@/components/layouts/grid"

export default function HomePage() {
  return (
    <PageLayout spacing="normal">
      {/* Every component automatically fits! */}
      
      {/* Hero - full width */}
      <Section width="wide">
        <HeroComponent />
      </Section>

      {/* Features - constrained width */}
      <Section>
        <Stack spacing={12}>
          <SectionHeader 
            title="Features" 
            description="Everything you need"
          />
          <Grid columns={3}>
            <FeatureCard />
            <FeatureCard />
            <FeatureCard />
          </Grid>
        </Stack>
      </Section>

      {/* Testimonials - narrow for readability */}
      <Section width="narrow">
        <TestimonialsSection />
      </Section>

      {/* CTA - full width background */}
      <Section width="full">
        <CTABanner />
      </Section>
    </PageLayout>
  )
}
```

## 6. The Component Auto-Fit Pattern

Make ANY component responsive by default:

```tsx
// src/components/ui/responsive-card.tsx
export function ResponsiveCard({ children, className }: Props) {
  return (
    <div className={cn(
      "w-full", // Always take full width of parent
      "h-auto", // Height adjusts to content
      "p-6 md:p-8 lg:p-10", // Responsive padding
      "rounded-lg border bg-card",
      className
    )}>
      {children}
    </div>
  )
}
```

## 7. The Global CSS Foundation

Add these to your `globals.css` for ultimate Framer-like behavior:

```css
@layer base {
  /* Ensure full viewport coverage */
  html, body {
    @apply h-full;
  }

  /* Box-sizing for predictable sizing */
  * {
    @apply box-border;
  }

  /* Smooth scrolling */
  html {
    @apply scroll-smooth;
  }
}

@layer utilities {
  /* Container queries for truly responsive components */
  .container-responsive {
    container-type: inline-size;
  }

  /* Auto-fit images and media */
  .media-fit {
    @apply w-full h-auto object-cover;
  }
}
```

## 8. The Advanced Pattern: Container Queries

For components that adapt based on their container (not viewport):

```tsx
// src/components/layouts/adaptive-container.tsx
export function AdaptiveContainer({ children }: Props) {
  return (
    <div className="w-full container-responsive">
      <div className="@container">
        {/* Components inside adapt to container width */}
        <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-6">
          {children}
        </div>
      </div>
    </div>
  )
}
```

## 9. Real-World Example: Complete Dashboard Page

```tsx
// app/(dashboard)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <PageLayout spacing="tight">
      {/* Header Section */}
      <Section>
        <Stack spacing={4}>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, here's your overview
          </p>
        </Stack>
      </Section>

      {/* Stats Grid - automatically responsive */}
      <Section>
        <Grid columns={4}>
          <StatCard title="Revenue" value="$12,345" />
          <StatCard title="Users" value="1,234" />
          <StatCard title="Orders" value="567" />
          <StatCard title="Growth" value="+12%" />
        </Grid>
      </Section>

      {/* Charts Section */}
      <Section>
        <Grid columns={2}>
          <ChartCard title="Sales Overview" />
          <ChartCard title="User Activity" />
        </Grid>
      </Section>

      {/* Table Section */}
      <Section width="wide">
        <DataTableCard />
      </Section>
    </PageLayout>
  )
}
```

## 10. The Tailwind Config for Perfect Spacing

```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      spacing: {
        // Page-level spacing
        'page': '5rem',
        'section': '4rem',
        'component': '2rem',
        'element': '1rem',
      },
      screens: {
        // Container query breakpoints
        '@xs': '20rem',
        '@sm': '24rem',
        '@md': '28rem',
        '@lg': '32rem',
        '@xl': '36rem',
      }
    }
  }
}
```

## The Benefits You Get

1. **Drop-in Components**: Any component automatically fits
2. **Consistent Spacing**: Gap-based spacing everywhere
3. **Responsive by Default**: Mobile-first, works on all screens
4. **No Media Query Hell**: Components adapt to containers
5. **Framer-Like DX**: Just drop components and they work
6. **Type-Safe**: TypeScript ensures valid props
7. **Performance**: Single reflow, optimized rendering
8. **Maintainable**: Change spacing in one place

## Pro Tips

1. **Always use `w-full`** on components that should fill their container
2. **Never use fixed widths** except for specific design elements
3. **Use the layout components** for all page structure
4. **Let containers manage spacing**, not individual components
5. **Think in stacks and grids**, not absolute positioning

This is exactly how companies like **Linear**, **Notion**, and **Vercel** structure their applications - container-based layouts with automatic fitting and consistent spacing. You're now building like the pros! 🚀