# Claims App

A modern, streamlined claims management and processing application built with Next.js 15, TypeScript, and a card-centric design philosophy.

## Design Philosophy

### Everything is a Card
Our core design principle: **everything is a card**. Whether simple or complex, every UI element follows the card pattern for consistency, predictability, and user experience excellence.

- **Unified Visual Language**: All content containers use card-based layouts
- **Scalable Complexity**: Simple cards for basic content, complex cards for detailed interfaces
- **Consistent Interaction**: Hover states, click behaviors, and navigation patterns remain uniform
- **Accessibility First**: Semantic HTML structure with proper ARIA patterns

### Full Width Forever & Adaptable Sizing
The application embraces full-width layouts with intelligent responsive sizing:

- **Full-Width Base**: All layouts start with `w-full` for maximum screen utilization
- **Smart Breakpoints**: Responsive sizing using Tailwind's `sm:`, `lg:`, `xl:` prefixes
- **Flexible Grids**: Card layouts adapt from single-column mobile to multi-column desktop
- **Content-Aware**: Components adjust spacing and typography based on screen real estate

### Mobile-First Navigation Architecture
Navigation system designed with mobile as the primary experience:

- **Progressive Enhancement**: Mobile layout expanded for desktop, not reduced
- **Touch-Optimized**: Large touch targets and gesture-friendly interactions
- **Context-Aware**: Navigation adapts to screen size while maintaining functionality
- **Performance-Focused**: Minimal JavaScript for navigation state management

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **UI Components**: Custom Radix UI-based component library
- **Icons**: Lucide React

### Project Structure
```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Homepage
│   ├── claims/
│   │   ├── page.tsx            # Claims listing
│   │   └── [claimId]/
│   │       └── page.tsx        # Individual claim detail
│   ├── layout.tsx              # Root layout with navigation
│   └── globals.css             # Global styles and CSS variables
├── components/
│   ├── active-components/       # Production-ready components
│   │   ├── card.tsx            # Core card primitive
│   │   ├── ClaimCard.tsx       # Specialized claim cards
│   │   ├── Navigation.tsx      # Main navigation system
│   │   ├── TopBar.tsx          # Header component
│   │   ├── Sidebar.tsx         # Desktop sidebar
│   │   ├── MobileNav.tsx       # Mobile navigation
│   │   └── ...                 # Other UI primitives
│   └── inactive-components/     # Deprecated/unused components
├── lib/
│   ├── prisma.ts               # Database connection
│   └── utils.ts                # Utility functions
├── hooks/
│   └── use-toast.ts            # Toast notification system
└── prisma/
    ├── schema.prisma           # Database schema
    └── seed.ts                 # Database seeding
```

## Component System

### Card-Based Components
All visual components inherit from the core `Card` primitive:

#### Base Card System
```typescript
// Core card with full-width and responsive design
<Card className="w-full">
  <CardHeader>
    <CardTitle>Responsive Title</CardTitle>
    <CardDescription>Mobile-optimized description</CardDescription>
  </CardHeader>
</Card>
```

#### Specialized Cards
- **ClaimCard**: Domain-specific card for claim display
- **ItemCard**: Generic item representation
- **DetailCard**: Complex information display

#### Card Layout Patterns
```typescript
// Stack layout for mobile-first vertical flow
<ClaimCardStack className="w-full">
  {claims.map(claim => <ClaimCard key={claim.id} {...claim} />)}
</ClaimCardStack>

// Grid layout for desktop multi-column display
<ClaimCardGrid className="w-full">
  {claims.map(claim => <ClaimCard key={claim.id} {...claim} />)}
</ClaimCardGrid>
```

### Responsive Typography System
Typography scales intelligently across breakpoints:
- **Mobile**: `text-sm`, `text-base` for optimal readability
- **Tablet**: `sm:text-base`, `sm:text-lg` for comfortable reading
- **Desktop**: `lg:text-lg`, `lg:text-xl` for enhanced hierarchy

### Navigation System
Multi-modal navigation architecture:
- **Mobile**: Sheet-based slide-out navigation
- **Desktop**: Persistent sidebar with contextual top bar
- **Progressive Enhancement**: Touch-first interactions with mouse/keyboard support

## Database Schema

### Core Entities
```prisma
model Claim {
  id           String     @id @default(cuid())
  claimNumber  String     @unique
  status       ClaimStatus
  claimant     Claimant   @relation(fields: [claimantId], references: [id])
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

model Claimant {
  id       String  @id @default(cuid())
  name     String
  email    String  @unique
  claims   Claim[]
}
```

## Development

### Getting Started
```bash
# Install dependencies
npm install

# Set up database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

### Development Workflow
1. **Mobile-First Development**: Start with mobile layouts, expand to desktop
2. **Card-Centric Design**: Every new feature begins as a card component
3. **Full-Width Layouts**: Default to `w-full`, constrain only when necessary
4. **Responsive Spacing**: Use `gap-4`, `sm:gap-6`, `lg:gap-8` patterns
5. **Semantic HTML**: Maintain accessibility with proper heading hierarchy

## Design System

### Color Palette
- **Background**: `bg-background` (adaptive light/dark)
- **Cards**: `bg-card` with `border` and `shadow-sm`
- **Text**: `text-foreground` primary, `text-muted-foreground` secondary
- **Accents**: `bg-accent` for hover states

### Spacing System
- **Mobile**: `p-4`, `gap-4` (16px base unit)
- **Desktop**: `sm:p-6`, `sm:gap-6` (24px enhanced spacing)
- **Large Screens**: `lg:p-8`, `lg:gap-8` (32px generous spacing)

### Component States
- **Default**: Clean, minimal styling
- **Hover**: `hover:bg-accent` for interactive feedback
- **Active**: Enhanced contrast and elevation
- **Loading**: Skeleton states with shimmer effects

## Future Roadmap

### Planned Enhancements
- [ ] Advanced claim filtering and search
- [ ] Real-time claim status updates
- [ ] Document upload and management
- [ ] Claims analytics dashboard
- [ ] Multi-tenant organization support
- [ ] Advanced notification system

### Architecture Goals
- [ ] Micro-frontend architecture exploration
- [ ] Enhanced PWA capabilities
- [ ] Advanced caching strategies
- [ ] Real-time collaborative features

## Contributing

When contributing to this project, please maintain the core design principles:
1. **Everything is a card** - new features should follow card-based patterns
2. **Mobile-first** - start with mobile layouts, enhance for desktop
3. **Full-width responsive** - embrace screen real estate with intelligent sizing
4. **Consistent spacing** - follow the established spacing system
5. **Semantic HTML** - maintain accessibility standards

## License

This project is private and proprietary.