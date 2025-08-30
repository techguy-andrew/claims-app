// ============================================================================
// IMPORT SECTION - UNDERSTANDING THE COMPOSITION HIERARCHY
// ============================================================================

import { ItemCard } from '@/components/custom/ItemCard'
/*
  THE IMPORT PATH EXPLAINED:
  
  '@/components/custom/ItemCard'
  
  @ SYMBOL:
  This is a TypeScript path alias configured in tsconfig.json.
  @ maps to the 'src' directory, so this actually means:
  './src/components/custom/ItemCard'
  
  WHY USE PATH ALIASES?
  1. Cleaner imports: '@/components' vs '../../../components'
  2. Refactoring safety: Move files without updating relative paths
  3. Consistency: Everyone uses the same import style
  4. IDE support: Better autocomplete and go-to-definition
  
  THE COMPOSITION HIERARCHY:
  
  Level 1: shadcn/ui (Atomic Components)
    └─ Card, CardHeader, CardTitle, CardDescription
    └─ Located in: @/components/ui/
    └─ Installed via: npx shadcn@latest add card
    └─ These are the "atoms" - smallest building blocks
  
  Level 2: ItemCard (Composition Component) 
    └─ Combines shadcn/ui atoms into a pattern
    └─ Located in: @/components/custom/
    └─ Created by us for reusability
    └─ This is a "molecule" - atoms combined meaningfully
  
  Level 3: HomePage (Application Component)
    └─ Uses composition components with real data
    └─ Located in: @/app/page.tsx
    └─ This is an "organism" - complete functional unit
  
  WHAT WE DON'T IMPORT:
  Notice we don't import Card, CardHeader, etc. directly.
  ItemCard handles that internally. This is encapsulation:
  - HomePage doesn't need to know HOW ItemCard is built
  - It only needs to know WHAT props ItemCard accepts
  - If we refactor ItemCard's internals, HomePage doesn't change
  
  This separation of concerns is what enables rapid development.
  You can trust ItemCard to handle the UI details while you
  focus on the business logic and data.
*/

// ============================================================================
// PAGE COMPONENT - THE APPLICATION LAYER IN ACTION
// ============================================================================

/*
  THE HOMEPAGE COMPONENT
  
  This is a Next.js App Router page component. In Next.js 15:
  - File location determines route: app/page.tsx = root route (/)
  - Default export becomes the page component
  - Can be Server or Client component (this is Server by default)
  - Supports streaming, suspense, and partial rendering
*/
export default function HomePage() {
  /*
    FUNCTION COMPONENT PATTERN:
    
    We use function components (not class components) because:
    1. They're simpler and more concise
    2. Hooks provide all the power of classes
    3. Better tree-shaking and bundle optimization
    4. Easier to test and reason about
    
    SERVER COMPONENT BY DEFAULT:
    
    Since there's no 'use client' directive, this is a Server Component.
    This means:
    - Renders on the server during build/request
    - Sends HTML to browser (better SEO, faster initial load)
    - Can't use browser APIs or event handlers directly
    - CAN fetch data directly without useEffect
    
    The ItemCard is marked 'use client', but that's okay!
    Server Components can import and use Client Components.
    The boundary is at the ItemCard level, not here.
    
    WHY THIS ARCHITECTURE WORKS:
    - Page (server): Handles data fetching, SEO, routing
    - ItemCard (client): Handles interactivity, animations
    - Best of both worlds: Performance AND interactivity
  */
  return (
    // THE PAGE CONTAINER - Responsive wrapper for all content
    <div className="container mx-auto py-10">
      {/*
        TAILWIND CONTAINER CLASS - DEEP DIVE:
        
        'container' is a special Tailwind utility that provides:
        
        DEFAULT BEHAVIOR:
        - width: 100% on small screens
        - max-width constraints on larger screens:
          * sm (640px): max-width: 640px
          * md (768px): max-width: 768px
          * lg (1024px): max-width: 1024px
          * xl (1280px): max-width: 1280px
          * 2xl (1536px): max-width: 1536px
        
        This creates a "boxed" layout on desktop while
        going edge-to-edge on mobile (with padding).
        
        You can customize these breakpoints in tailwind.config.js:
        container: {
          screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
          }
        }
        
        MX-AUTO EXPLAINED:
        
        'mx-auto' = margin-left: auto; margin-right: auto;
        
        This centers the container horizontally by:
        1. Container has a max-width (like 1280px)
        2. Browser has extra space (like 1920px screen)
        3. Auto margins distribute extra space equally
        4. Result: Container appears centered
        
        Without mx-auto, container would left-align.
        
        PY-10 BREAKDOWN:
        
        'py-10' = padding-top: 2.5rem; padding-bottom: 2.5rem;
        
        In Tailwind's spacing scale:
        - 1 = 0.25rem (4px)
        - 2 = 0.5rem (8px)
        - 4 = 1rem (16px)
        - 10 = 2.5rem (40px)
        
        40px of vertical padding creates breathing room,
        preventing content from touching viewport edges.
        
        RESPONSIVE CONSIDERATIONS:
        
        This single div creates a layout that:
        - Works on phones (320px)
        - Works on tablets (768px)
        - Works on laptops (1366px)
        - Works on desktops (1920px)
        - Works on 4K displays (3840px)
        
        No media queries needed! Tailwind's container
        handles all the responsive logic internally.
        
        COMMON PATTERNS WITH CONTAINER:
        
        Full width sections:
        <div className="bg-gray-100"> // Full width background
          <div className="container mx-auto"> // Constrained content
            Content here
          </div>
        </div>
        
        With horizontal padding:
        <div className="container mx-auto px-4">
          Adds padding on mobile for edge spacing
        </div>
        
        Different max widths:
        <div className="max-w-4xl mx-auto"> // Narrower than container
        <div className="max-w-7xl mx-auto"> // Wider than default
      */}
      
      {/* ================================================================
          ITEMCARD IMPLEMENTATION - REAL-WORLD USAGE
          ================================================================ */}
      
      <ItemCard
        // STYLING PROPS - Constraining width for demo purposes
        className="max-w-md"
        /*
          MAX-W-MD EXPLAINED:
          
          'max-w-md' sets max-width: 28rem (448px)
          
          Tailwind's max-width scale:
          - max-w-xs: 20rem (320px) - Mobile width
          - max-w-sm: 24rem (384px) - Small card
          - max-w-md: 28rem (448px) - Medium card (our choice)
          - max-w-lg: 32rem (512px) - Large card
          - max-w-xl: 36rem (576px) - Extra large
          
          WHY MAX-WIDTH INSTEAD OF WIDTH?
          1. Responsive: On mobile (<448px), card shrinks to fit
          2. Flexible: Card can be smaller if container is smaller
          3. Predictable: Never exceeds 448px even on large screens
          
          WIDTH VS MAX-WIDTH:
          - width: 448px = Always 448px (breaks on mobile)
          - max-width: 448px = Up to 448px (responsive)
          
          HOW THIS MERGES WITH ITEMCARD'S DEFAULT:
          ItemCard has className={cn('w-full', className)}
          
          Without our className:
          - Card uses w-full (width: 100%)
          - Fills entire container width
          
          With our className="max-w-md":
          - cn() merges to: "w-full max-w-md"
          - CSS result: width: 100%; max-width: 28rem;
          - Card fills space UP TO 448px
          
          This is the power of composition:
          - ItemCard provides sensible defaults (w-full)
          - We override for specific needs (max-w-md)
          - Both work together harmoniously
        */
        
        // CONTENT PROPS - The actual data to display
        title="Welcome to Your App"
        /*
          TITLE PROP VARIATIONS:
          
          SIMPLE STRING (what we're using):
          title="Welcome to Your App"
          
          DYNAMIC STRING:
          title={`Welcome back, ${user.name}`}
          title={isLoggedIn ? "Dashboard" : "Please Sign In"}
          
          JSX WITH ICON:
          title={
            <>
              <HomeIcon className="inline w-5 h-5 mr-2" />
              Welcome Home
            </>
          }
          
          JSX WITH BADGE:
          title={
            <span className="flex items-center gap-2">
              Dashboard
              <Badge variant="secondary">Beta</Badge>
            </span>
          }
          
          COMPLEX COMPOSITION:
          title={
            <div className="flex items-center justify-between w-full">
              <span>Revenue</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          }
          
          The flexibility of string | React.ReactNode means:
          - Start simple with strings
          - Enhance with rich content when needed
          - Never need to refactor the component
          
          This is crucial for rapid prototyping:
          During a client demo, you can evolve the title
          from simple text to rich UI without changing
          the ItemCard component itself.
        */
        
        description="This is a reusable ItemCard component built with shadcn/ui components as building blocks."
        /*
          DESCRIPTION PROP PATTERNS:
          
          METADATA STYLE:
          description="Last updated 5 minutes ago"
          description={`${items.length} items • ${users.length} users`}
          
          FORMATTED TEXT:
          description={
            <>
              Created by <strong>{author.name}</strong> on{' '}
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </>
          }
          
          STATUS INDICATORS:
          description={
            <span className="flex items-center gap-1">
              <StatusDot color="green" />
              System operational
            </span>
          }
          
          TRUNCATED CONTENT:
          description={
            article.excerpt.length > 100
              ? `${article.excerpt.slice(0, 100)}...`
              : article.excerpt
          }
          
          EMPTY STATE:
          description={items.length === 0 ? "No items yet" : `${items.length} items`}
          
          The description typically provides context:
          - What the card represents
          - Current status or state
          - Metadata like dates or counts
          - Supporting information
          
          It uses text-muted-foreground color (from shadcn/ui)
          which automatically adapts to light/dark themes.
        */
      >
        {/* ================================================================
            CHILDREN CONTENT - THE BODY OF THE CARD
            ================================================================ */}
        
        <p className="text-sm text-muted-foreground">
          {/*
            TEXT STYLING BREAKDOWN:
            
            TEXT-SM:
            - Font size: 0.875rem (14px)
            - Line height: 1.25rem (20px)
            - Slightly smaller than base text (1rem/16px)
            - Perfect for secondary content
            
            Tailwind's type scale:
            - text-xs: 0.75rem (12px) - Tiny labels
            - text-sm: 0.875rem (14px) - Secondary content (our choice)
            - text-base: 1rem (16px) - Body text default
            - text-lg: 1.125rem (18px) - Slightly emphasized
            - text-xl: 1.25rem (20px) - Subheadings
            
            TEXT-MUTED-FOREGROUND:
            
            This is a DESIGN TOKEN from shadcn/ui's theme system.
            It's defined in your CSS as a CSS variable:
            
            Light mode:
            --muted-foreground: 240 3.8% 46.1%  (grayish)
            
            Dark mode:
            --muted-foreground: 240 5% 64.9%    (lighter gray)
            
            The color automatically switches based on theme!
            
            WHY USE DESIGN TOKENS?
            1. Consistency: Same muted color everywhere
            2. Themeable: Change once, updates everywhere
            3. Accessible: Contrast ratios are pre-calculated
            4. Semantic: "muted-foreground" is clearer than "gray-600"
            
            OTHER SHADCN/UI COLOR TOKENS:
            - text-foreground: Primary text color
            - text-muted-foreground: Secondary text (what we use)
            - text-destructive: Error/danger text
            - text-primary: Brand color text
            
            THE CONTENT ITSELF:
            This paragraph demonstrates that ItemCard can accept
            any React children. It's not limited to specific slots.
          */}
          This ItemCard is a flexible, composable component that can be customized with different content, actions, and styling. It demonstrates the power of building custom components on top of shadcn/ui primitives.
        </p>
        
        {/*
          THE CHILDREN PATTERN - REACT'S COMPOSITION MODEL:
          
          WHAT ARE CHILDREN?
          In React, "children" is a special prop that represents
          everything between opening and closing tags:
          
          <ItemCard>     ← Opening tag
            THIS         ← All of this
            IS           ← becomes the
            CHILDREN     ← children prop
          </ItemCard>    ← Closing tag
          
          HOW ITEMCARD USES CHILDREN:
          Inside ItemCard component:
          function ItemCard({ children, ...otherProps }) {
            return (
              <Card>
                <CardHeader>...</CardHeader>
                <CardContent>{children}</CardContent>
              </Card>
            )
          }
          
          This pattern enables COMPOSITION over CONFIGURATION:
          
          CONFIGURATION APPROACH (bad):
          <ItemCard 
            bodyText="..."
            showButton={true}
            buttonText="Click"
            showImage={true}
            imageSrc="..."
          />
          
          COMPOSITION APPROACH (good - what we use):
          <ItemCard>
            <p>Any text</p>
            <Button>Any button</Button>
            <Image src="..." />
            {showExtra && <ExtraStuff />}
          </ItemCard>
          
          Composition is infinitely flexible!
          
          COMMON CHILDREN PATTERNS:
          
          TEXT CONTENT (what we have):
          <ItemCard>
            <p>Simple paragraph</p>
          </ItemCard>
          
          STATS DISPLAY:
          <ItemCard title="Revenue">
            <div className="text-3xl font-bold">$12,450</div>
            <p className="text-sm text-green-500">+12% from last month</p>
          </ItemCard>
          
          FORM INPUTS:
          <ItemCard title="Settings">
            <div className="space-y-4">
              <Input placeholder="Name" />
              <Input placeholder="Email" />
              <Button>Save</Button>
            </div>
          </ItemCard>
          
          LIST ITEMS:
          <ItemCard title="Recent Activity">
            <ul className="space-y-2">
              {activities.map(activity => (
                <li key={activity.id}>{activity.name}</li>
              ))}
            </ul>
          </ItemCard>
          
          EMPTY STATE:
          <ItemCard title="Notifications">
            {notifications.length === 0 ? (
              <EmptyState message="No notifications" />
            ) : (
              <NotificationList items={notifications} />
            )}
          </ItemCard>
          
          The ItemCard doesn't know or care what children you pass.
          It just provides the container and consistent styling.
          
          This is the POWER of composition:
          - ItemCard is simple and focused
          - You control the content completely
          - Infinite variations without component changes
          - Easy to understand and maintain
        */}
      </ItemCard>
      
      {/*
        ================================================================
        THE COMPLETE COMPOSITION HIERARCHY VISUALIZED
        ================================================================
        
        LEVEL 1: ATOMIC COMPONENTS (shadcn/ui)
        ┌──────────────────────────────────────────────────┐
        │ <Card>         Base container with border/shadow    │
        │ <CardHeader>   Groups title and description         │
        │ <CardTitle>    Bold heading text                    │
        │ <CardDescription> Muted secondary text              │
        │ <CardContent>  Body content container               │
        └──────────────────────────────────────────────────┘
                                ↓
        LEVEL 2: COMPOSITION COMPONENT (ItemCard)
        ┌──────────────────────────────────────────────────┐
        │ <ItemCard>                                          │
        │   - Combines atomic components                      │
        │   - Adds TypeScript props interface                 │
        │   - Handles conditional rendering                   │
        │   - Provides consistent patterns                    │
        └──────────────────────────────────────────────────┘
                                ↓
        LEVEL 3: APPLICATION COMPONENT (HomePage)
        ┌──────────────────────────────────────────────────┐
        │ <HomePage>                                          │
        │   - Uses ItemCard with specific data                │
        │   - Adds page-level layout (container)              │
        │   - Focuses on business logic                       │
        │   - Could fetch data, handle state, etc.            │
        └──────────────────────────────────────────────────┘
        
        THE LEGO BLOCK PHILOSOPHY:
        
        Think of it like actual LEGO:
        1. LEGO provides basic bricks (shadcn/ui atoms)
        2. You build a spaceship template (ItemCard pattern)
        3. You use that spaceship in your scene (HomePage)
        
        Benefits:
        - Reuse the spaceship (ItemCard) in multiple scenes
        - Modify the spaceship without changing the bricks
        - Build new spaceships from the same bricks
        - Share spaceships with other builders
        
        SEPARATION OF CONCERNS:
        
        HomePage doesn't know:
        - How Card implements shadows
        - What CardTitle's font-weight is
        - How CardDescription handles colors
        
        ItemCard doesn't know:
        - What data it will display
        - Where it will be used
        - How many instances will exist
        
        shadcn/ui components don't know:
        - Your business logic
        - Your data structure  
        - Your application needs
        
        Each layer only knows what it needs to know.
        This is encapsulation in action.
      */}
    </div>
  )
}

// ============================================================================
// THE COMPLETE PHILOSOPHY IN ACTION
// ============================================================================

/*
  WHY THIS SIMPLE PAGE DEMONSTRATES EVERYTHING:
  
  1. THE DOGMATIC STACK IN ACTION
     ✓ Next.js 15 App Router (page.tsx pattern)
     ✓ TypeScript (full type safety via ItemCard interface)
     ✓ Tailwind CSS (all styling via utility classes)
     ✓ shadcn/ui (Card components as foundation)
     ✓ Component composition (ItemCard pattern)
  
  2. THE 2-HOUR MVP CAPABILITY
     
     MINUTE 0-10: Setup
     - pnpm create next-app with TypeScript and Tailwind
     - npx shadcn@latest init
     - npx shadcn@latest add card
     
     MINUTE 10-30: Create ItemCard
     - Copy this pattern
     - Adjust props for your needs
     - Add any specific variants
     
     MINUTE 30-90: Build Features
     - Create pages using ItemCard
     - Add ItemCardGrid for layouts
     - Fetch data, connect to database
     
     MINUTE 90-120: Deploy
     - Push to GitHub
     - Deploy to Vercel
     - Share link with client
     
     You now have a professional app in 2 hours!
  
  3. THE SCALABILITY PATH
     
     This same HomePage could evolve:
     
     PHASE 1 (Current): Static demo card
     export default function HomePage() {
       return <ItemCard title="Welcome" />
     }
     
     PHASE 2: Dynamic data
     export default async function HomePage() {
       const items = await fetchItems()
       return (
         <ItemCardGrid>
           {items.map(item => <ItemCard key={item.id} {...item} />)}
         </ItemCardGrid>
       )
     }
     
     PHASE 3: User-specific
     export default async function HomePage() {
       const user = await getUser()
       const items = await fetchUserItems(user.id)
       return (
         <>
           <ItemCard title={`Welcome ${user.name}`} />
           <ItemCardGrid>// items placeholder</ItemCardGrid>
         </>
       )
     }
     
     PHASE 4: Real-time updates
     'use client'
     export default function HomePage() {
       const { items } = useRealtimeItems()
       return <ItemCardGrid>// real-time items</ItemCardGrid>
     }
     
     Same component, growing functionality!
  
  4. THE CLIENT DEMO ADVANTAGE
     
     During a sales call, you can:
     
     LIVE EDIT this file:
     - Change title to client's company name
     - Update description to their tagline
     - Add their brand colors via className
     - Show different card layouts
     
     BUILD NEW FEATURES LIVE:
     - "Can it show user profiles?" *creates UserCard in 30 seconds*
     - "Can we have a dashboard?" *adds ItemCardGrid with stats*
     - "What about dark mode?" *it already works!*
     
     DEPLOY INSTANTLY:
     - git commit -m "Client demo"
     - git push
     - "Here's your live URL!"
     
     This converts prospects into customers.
  
  5. THE FRAMER PHILOSOPHY CONNECTION
     
     This code implements Framer's principles:
     
     RELATIVE SIZING:
     - ItemCard uses w-full (fills container)
     - Container provides constraints (max-w-md)
     - Just like Framer's "Fill" and constraints
     
     COMPONENT INSTANCES:
     - One ItemCard definition
     - Multiple instances with different props
     - Like Framer's component variants
     
     RESPONSIVE BY DEFAULT:
     - No media queries in our code
     - Container handles responsive behavior
     - Cards adapt to their space
  
  6. THE BUSINESS MODEL
     
     This architecture enables:
     
     SPEED: Ship in hours, not weeks
     QUALITY: Professional from day one
     FLEXIBILITY: Adapt to any requirement
     MAINTENANCE: One pattern to support
     SCALE: From landing page to enterprise
     
     You charge premium rates because you deliver
     premium results at unprecedented speed.
  
  7. THE SOLOPRENEUR'S SECRET
     
     While competitors debate:
     - "Should we use Vue or React?"
     - "Is Tailwind better than CSS Modules?"
     - "Should we try the new framework?"
     
     You're shipping products with a proven stack.
     
     Mastery beats novelty.
     Shipping beats planning.
     Results beat debates.
  
  THIS IS THE WAY:
  
  One stack.
  One pattern.
  Infinite possibilities.
  
  Master this, and you'll build faster than teams 10x your size.
  That's not hyperbole—it's the mathematical result of eliminating
  decision fatigue and maximizing pattern reuse.
  
  Now stop reading comments and start shipping products!
*/