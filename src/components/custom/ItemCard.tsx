// ============================================================================
// CLIENT COMPONENT DIRECTIVE - CRITICAL FOR NEXT.JS APP ROUTER
// ============================================================================
'use client'
/*
  WHY 'USE CLIENT' IS HERE:
  In Next.js 15's App Router, components are Server Components by default.
  This means they render on the server and send HTML to the browser.
  
  We mark this as a Client Component because:
  1. It might be used in contexts that require interactivity (onClick, hover states)
  2. It accepts flexible props that could include event handlers
  3. It maintains compatibility with any parent component (server or client)
  
  WITHOUT THIS DIRECTIVE:
  - Next.js would try to render this on the server
  - Any interactive props would fail
  - Hydration mismatches could occur
  
  PHILOSOPHY CONNECTION:
  This aligns with our "Progressive Enhancement" principle - start with 
  server components for performance, add client components only when needed.
*/

// ============================================================================
// IMPORT SECTION - BUILDING WITH THE DOGMATIC STACK
// ============================================================================

// REACT CORE - The foundation of our component system
import * as React from 'react'
// We import as * to get access to React.HTMLAttributes, React.ReactNode, etc.
// This is the TypeScript way - explicit about what we're using

// SHADCN/UI ATOMIC COMPONENTS - The foundation blocks copied via CLI
import {
  Card,            // The outer container with borders, shadows, and background
  CardDescription, // Muted text for supporting information
  CardHeader,      // The top section that groups title and metadata
  CardTitle,       // Bold, prominent text for the main heading
} from '@/components/ui/card'
/*
  SHADCN/UI PHILOSOPHY:
  These components were installed via: npx shadcn@latest add card
  They now live in OUR codebase at src/components/ui/card.tsx
  We OWN these components - can modify them, they won't break from updates
  
  This is NOT an npm package that could have breaking changes.
  This is OUR code that happens to start from a excellent foundation.
  
  WHY THESE SPECIFIC IMPORTS:
  - Card: Provides consistent elevation, borders, and spacing
  - CardHeader: Semantic grouping for top content
  - CardTitle: Applies proper heading typography (font-size, font-weight)
  - CardDescription: Applies muted color for secondary text
  
  We DON'T import CardContent or CardFooter here because this simplified
  version doesn't need them - demonstrating selective composition.
*/

// UTILITY FUNCTION - Safe class name merging for Tailwind
import { cn } from '@/lib/utils'
/*
  THE CN() FUNCTION EXPLAINED:
  This utility (installed with shadcn/ui init) does two critical things:
  
  1. USES CLSX: Conditionally combines class names
     Example: cn('text-lg', isActive && 'font-bold', className)
     
  2. USES TAILWIND-MERGE: Resolves Tailwind conflicts intelligently
     Example: cn('p-4', 'p-6') => 'p-6' (later class wins)
     Without this: 'p-4 p-6' would apply BOTH, causing CSS conflicts
  
  WHY THIS MATTERS:
  When a parent passes className="p-8" and our component has "p-4",
  cn() ensures p-8 wins (as expected), rather than having both compete.
  
  This enables the composition pattern where parent components can
  override child component styles predictably.
*/

// ============================================================================
// TYPESCRIPT INTERFACES - TYPE SAFETY FOR RAPID DEVELOPMENT
// ============================================================================

/*
  ITEMCARD PROPS INTERFACE
  This interface defines what props our ItemCard component accepts.
  It's the "contract" between this component and its consumers.
*/
export interface ItemCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /*
    TYPESCRIPT INHERITANCE EXPLAINED:
    extends React.HTMLAttributes<HTMLDivElement>
    
    This means ItemCard accepts ALL standard HTML div attributes:
    - Event handlers: onClick, onMouseEnter, onMouseLeave, onFocus, etc.
    - Accessibility: role, aria-label, aria-describedby, tabIndex, etc.
    - Data attributes: data-testid, data-id, data-*
    - Standard HTML: id, className, style, hidden, etc.
    
    WHY <HTMLDivElement>?
    Because our Card component renders a <div> at its root.
    This ensures type safety - you can't pass SVG-specific props, for example.
    
    THE OMIT UTILITY TYPE:
    Omit<Type, 'key'> removes specified properties from a type.
    We OMIT 'title' because:
    1. HTML divs have a native 'title' attribute (shows tooltip on hover)
    2. We want a custom 'title' prop that accepts ReactNode, not just string
    3. Without Omit, TypeScript would show an error about conflicting types
    
    This is a common pattern when enhancing HTML elements with custom props.
  */
  
  // CONTENT PROPS - The actual data to display
  title?: string | React.ReactNode
  /*
    FLEXIBLE CONTENT TYPE EXPLAINED:
    string | React.ReactNode means this prop accepts:
    
    SIMPLE STRINGS:
    title="Welcome Back"
    
    COMPLEX JSX:
    title={<span className="flex items-center gap-2">
      <Icon /> Welcome Back
    </span>}
    
    DYNAMIC CONTENT:
    title={isLoggedIn ? `Hello ${userName}` : "Please Sign In"}
    
    This flexibility is KEY to rapid prototyping:
    - Start with simple strings
    - Enhance with icons/badges when needed
    - No component refactoring required
    
    The ? makes it optional - cards don't REQUIRE titles
  */
  
  description?: string | React.ReactNode
  /*
    Same flexibility as title.
    Common use cases:
    - Simple: description="Card description text"
    - Rich: description={<span>Updated <time>2 hours ago</time></span>}
    - Conditional: description={error ? errorMessage : successMessage}
    
    In client demos, you can quickly show different states
    without changing the component structure.
  */
  
  // STYLING CUSTOMIZATION PROPS
  headerClassName?: string
  /*
    COMPOSITION-FRIENDLY STYLING:
    This allows parent components to style the header section specifically.
    
    Example uses:
    headerClassName="bg-blue-50"        // Add background color
    headerClassName="border-b-2"        // Add bottom border
    headerClassName="pb-6"              // Increase bottom padding
    
    This prop gets merged with default classes via cn(), so it:
    - Extends rather than replaces default styling
    - Resolves conflicts intelligently (parent wins)
    - Maintains component encapsulation
  */
  
  /*
    INHERITED PROPS (from HTMLAttributes):
    
    className?: string
    - Styles the outer Card container
    - Example: className="hover:shadow-lg transition-shadow"
    
    onClick?: (e: MouseEvent) => void
    - Makes the entire card clickable
    - Example: onClick={() => router.push(`/item/${id}`)}
    
    style?: CSSProperties
    - For dynamic inline styles
    - Example: style={{ borderColor: user.favoriteColor }}
    
    And 50+ other HTML attributes...
    
    This is why TypeScript + extending HTML attributes is powerful:
    You get EVERYTHING HTML offers, PLUS your custom additions.
  */
}

// ============================================================================
// MAIN COMPONENT - THE ITEMCARD FOUNDATION
// ============================================================================

/*
  THE ITEMCARD COMPONENT
  This is our foundation component that composes shadcn/ui atomics into
  a reusable pattern. It's designed to handle 90% of card use cases
  while remaining simple enough to understand in seconds.
*/
export function ItemCard({
  // PROPS DESTRUCTURING WITH PURPOSE
  title,           // The main heading content
  description,     // Supporting text below the title
  className,       // Styling for the outer card container
  headerClassName, // Specific styling for just the header section
  ...props         // Everything else passes through to the Card
}: ItemCardProps) {
  /*
    DESTRUCTURING PATTERN EXPLAINED:
    
    We destructure props in the function signature because:
    1. It makes the component's API immediately visible
    2. We can see exactly what props are used vs passed through
    3. It enables cleaner code without props.title everywhere
    
    THE REST OPERATOR (...props):
    Collects all props we didn't explicitly destructure.
    These flow through to the Card component, enabling:
    - Event handlers (onClick, onMouseEnter)
    - Accessibility attributes (aria-label, role)
    - Data attributes (data-testid for testing)
    
    This pattern is CRITICAL for component composition:
    ItemCard doesn't need to know about every possible prop,
    it just passes them through to where they belong.
  */
  
  return (
    // THE CARD CONTAINER - Our outermost wrapper
    <Card 
      className={cn(
        'w-full',     // Base default: cards fill their container
        className     // Parent overrides: could add max-w-md, hover:shadow-lg, etc.
      )} 
      {...props}      // All other props flow directly to Card
    >
      {/*
        WIDTH PHILOSOPHY - THE FRAMER PRINCIPLE:
        
        'w-full' (width: 100%) is our default because components should
        inherit their dimensions from their context, not declare them internally.
        
        This aligns with Framer's "Fill Container" principle:
        - In a grid: each card fills its grid cell
        - In a flex container: cards fill available space
        - In a max-width wrapper: card respects the constraint
        
        The parent component controls sizing via:
        1. Its own container constraints
        2. Passing className="max-w-md" to override
        3. Using layout components like ItemCardGrid
        
        EXAMPLE COMPOSITIONS:
        <ItemCard />                    // Fills parent width
        <ItemCard className="max-w-sm" /> // Maximum 24rem width
        <ItemCard className="w-80" />      // Fixed 20rem width
        
        The cn() function ensures className overrides 'w-full' if needed,
        resolving the Tailwind conflict intelligently.
        
        SPREAD OPERATOR PLACEMENT:
        {...props} comes AFTER className so that:
        - className is properly merged via cn()
        - But other props like onClick, style, etc. are applied directly
        - This prevents accidentally overriding our careful class merging
      */}
      
      {/* CONDITIONAL RENDERING SECTION - Smart DOM Management */}
      {(title || description) && (
        /*
          CONDITIONAL RENDERING PATTERN EXPLAINED:
          
          {condition && (<JSX />)}
          
          This JavaScript logical operator pattern means:
          - If condition is truthy: render the JSX
          - If condition is falsy: render nothing (not even null)
          
          WHY CHECK (title || description):
          We only want a CardHeader if there's content for it.
          Empty headers create unnecessary spacing and DOM nodes.
          
          PERFORMANCE BENEFIT:
          React doesn't create DOM nodes for false conditions.
          This keeps the rendered HTML clean and minimal.
          
          COMMON PATTERN VARIATIONS:
          {title && <Title />}                    // Single condition
          {title || description && <Header />}    // Multiple conditions
          {items.length > 0 && <List />}          // Numeric conditions
          {isLoggedIn ? <Dashboard /> : <Login />} // Ternary for either/or
        */
        
        <CardHeader 
          className={cn(
            'space-y-1.5',    // Default spacing between title and description
            headerClassName   // Parent can override or extend
          )}
        >
          {/*
            SPACING UTILITY EXPLAINED:
            
            'space-y-1.5' adds vertical spacing BETWEEN child elements.
            In Tailwind, this translates to:
            - margin-top: 0.375rem (6px) on all children except the first
            
            This is SUPERIOR to adding margins to individual elements because:
            1. Spacing is consistent and centralized
            2. No "first item" or "last item" edge cases
            3. If you remove an element, spacing auto-adjusts
            4. Matches Framer's stack component with gap
            
            The 1.5 value (6px) is intentionally tight for header content,
            creating visual cohesion between title and description.
            
            PARENT CUSTOMIZATION:
            headerClassName could override this:
            headerClassName="space-y-3"  // More spacing
            headerClassName="space-y-0"  // No spacing
            headerClassName="bg-gray-50" // Add background
          */}
          
          {/* TITLE RENDERING - Primary heading content */}
          {title && (
            <CardTitle>
              {title}
              {/*
                CARDTITLE BEHAVIOR:
                
                CardTitle (from shadcn/ui) applies:
                - font-semibold: 600 weight for prominence  
                - text-2xl: Larger size for hierarchy
                - tracking-tight: Slightly tighter letter spacing
                - Semantic HTML: Usually renders as <h3>
                
                Because title accepts ReactNode, this could be:
                
                SIMPLE TEXT:
                {"Dashboard"}
                
                DYNAMIC CONTENT:
                {`${itemCount} items`}
                
                RICH CONTENT:
                {<>
                  <Icon className="inline mr-2" />
                  Dashboard
                  <Badge className="ml-2">Pro</Badge>
                </>}
                
                The component doesn't care - it just renders what it receives.
                This flexibility is what enables rapid prototyping.
              */}
            </CardTitle>
          )}
          
          {/* DESCRIPTION RENDERING - Supporting context */}
          {description && (
            <CardDescription>
              {description}
              {/*
                CARDDESCRIPTION BEHAVIOR:
                
                CardDescription applies:
                - text-sm: Smaller than body text (0.875rem/14px)
                - text-muted-foreground: Uses the theme's muted color
                  * Light mode: typically gray-600
                  * Dark mode: typically gray-400
                  * Automatically switches based on theme
                
                This creates visual hierarchy:
                - Title: Bold and prominent
                - Description: Smaller and muted
                - Body content: Normal size and color
                
                COMMON PATTERNS:
                description="Manage your account settings"
                description={`Last updated ${timeAgo}`}
                description={<>By {author} • {readTime} min read</>}
                
                The muted color is a shadcn/ui design token that ensures
                consistency across all secondary text in your app.
              */}
            </CardDescription>
          )}
        </CardHeader>
      )}
      
      {/*
        WHAT'S MISSING? THE BODY CONTENT!
        
        You might notice we don't have a CardContent section here.
        In the full ItemCard implementation, children would be wrapped
        in CardContent. This simplified version focuses on just the
        header pattern to demonstrate the core concepts.
        
        In a complete implementation:
        {children && (
          <CardContent>{children}</CardContent>
        )}
        
        This would add consistent padding and spacing for body content.
      */}
    </Card>
  )
}

// ============================================================================
// LAYOUT COMPONENTS - RESPONSIVE PATTERNS FOR CARD GROUPS
// ============================================================================

/*
  ITEMCARDGRID PROPS INTERFACE
  This component creates responsive grids that adapt to any screen size
  without media queries - pure CSS Grid magic.
*/
export interface ItemCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /*
    EXTENDING HTMLAttributes<HTMLDivElement>:
    The grid container accepts all standard div props.
    This enables parent components to add:
    - Event delegation: onClick for the entire grid
    - Test attributes: data-testid="product-grid"
    - Styling: className, style
    - Accessibility: role="list" for semantic meaning
  */
  
  children: React.ReactNode
  /*
    CHILDREN PATTERN:
    Typically an array of ItemCard components, but could be any React content.
    
    COMMON USAGE:
    <ItemCardGrid>
      {products.map(product => (
        <ItemCard key={product.id} title={product.name} />
      ))}
    </ItemCardGrid>
    
    React automatically handles arrays of elements,
    making this pattern perfect for dynamic content.
  */
  
  minItemWidth?: string
  /*
    MINIMUM CARD WIDTH BEFORE WRAPPING:
    
    This CSS value (like '300px', '20rem', '250px') determines when
    cards wrap to the next row. It's the "responsive breakpoint" but
    without media queries.
    
    HOW IT WORKS:
    - If container is 1200px and minItemWidth is '300px': 4 columns
    - If container is 900px and minItemWidth is '300px': 3 columns  
    - If container is 600px and minItemWidth is '300px': 2 columns
    - If container is 250px and minItemWidth is '300px': 1 column
    
    The browser calculates this automatically using CSS Grid.
    
    DEFAULT '300px' is chosen because:
    - It's wide enough for readable content
    - Narrow enough to fit 2 columns on tablets
    - Creates a nice 3-4 column layout on desktop
  */
  
  gap?: 2 | 3 | 4 | 5 | 6 | 8
  /*
    TAILWIND GAP VALUES:
    
    This union type restricts gap to valid Tailwind spacing values:
    - 2 = 0.5rem (8px)
    - 3 = 0.75rem (12px)  
    - 4 = 1rem (16px) - DEFAULT
    - 5 = 1.25rem (20px)
    - 6 = 1.5rem (24px)
    - 8 = 2rem (32px)
    
    WHY RESTRICT THE TYPE?
    1. Ensures valid Tailwind classes (gap-7 doesn't exist)
    2. Provides IntelliSense autocomplete
    3. Maintains design system consistency
    4. Catches typos at compile time
    
    This is TypeScript protecting us from runtime CSS errors.
  */
}

/*
  ITEMCARDGRID COMPONENT
  The responsive grid that makes cards look professional on any screen.
  This single component replaces dozens of media queries.
*/
export function ItemCardGrid({
  children,
  minItemWidth = '300px',
  gap = 4,
  className,
  style,
  ...props
}: ItemCardGridProps) {
  /*
    DEFAULT VALUES EXPLAINED:
    
    minItemWidth = '300px'
    - Chosen through extensive testing
    - Wide enough for card content to breathe
    - Narrow enough for 2-column tablet layouts
    - Creates 3-4 columns on desktop
    
    gap = 4
    - 1rem (16px) spacing
    - Matches default spacing in the design system
    - Not too tight, not too loose
    - Easy to override: gap={6} for more breathing room
  */
  
  // DYNAMIC CLASS GENERATION
  const gapClass = `gap-${gap}`
  /*
    TEMPLATE LITERAL PATTERN:
    
    We build the class name dynamically based on the gap prop.
    This creates: gap-2, gap-3, gap-4, gap-5, gap-6, or gap-8
    
    WHY NOT JUST PASS THE CLASS DIRECTLY?
    Because we want type safety. The prop accepts numbers (2,3,4,5,6,8)
    which map to Tailwind's spacing scale, preventing invalid values.
    
    TAILWIND JIT MODE NOTE:
    Tailwind's JIT compiler needs to see complete class names in the code.
    Since we're using a limited set (2,3,4,5,6,8), Tailwind can still
    detect and include these classes. If you need arbitrary values,
    you'd need to use style={{ gap: `${gapValue}px` }} instead.
  */
  
  return (
    <div
      className={cn(
        'grid',       // Activates CSS Grid layout
        gapClass,     // Applies spacing between items
        className     // Parent customization
      )}
      /*
        CSS GRID ACTIVATION:
        
        The 'grid' class transforms this div into a grid container.
        All direct children become grid items automatically.
        
        Unlike flexbox (which is 1-dimensional), CSS Grid is 2-dimensional,
        handling both rows and columns simultaneously.
        
        The gap utility applies to both row-gap and column-gap,
        creating consistent spacing in both directions.
      */
      
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minItemWidth}, 100%), 1fr))`,
        ...style
      }}
      /*
        THE RESPONSIVE GRID FORMULA - DEEP DIVE:
        
        Let's break down this CSS Grid magic piece by piece:
        
        repeat(auto-fit, ...)
        - repeat(): Creates multiple grid tracks (columns)
        - auto-fit: Browser calculates how many columns fit
        - vs auto-fill: auto-fit expands items to fill space,
          auto-fill maintains item size and leaves empty space
        
        minmax(min(...), 1fr)
        - minmax(): Each column has a minimum and maximum size
        - First argument: minimum size
        - Second argument: maximum size (1fr = 1 fraction of available space)
        
        min(${minItemWidth}, 100%)
        - CSS min() function: takes the smaller of two values
        - ${minItemWidth}: Our prop, typically '300px'
        - 100%: Full container width
        
        WHY min() IS CRITICAL:
        On mobile (320px screen), without min():
        - Grid tries to make 300px columns
        - Container is only 320px (minus padding)
        - Result: horizontal scrolling (BAD!)
        
        With min():
        - On 320px screen: min(300px, 100%) = 100%
        - Cards stack in single column
        - No horizontal scroll
        - Perfect mobile experience
        
        THE COMPLETE BEHAVIOR:
        
        1200px container:
        - min(300px, 100%) = 300px (minimum)
        - Browser fits 4 columns of 300px
        - 1fr makes them expand to fill exactly 1200px
        - Result: 4 equal columns
        
        800px container:
        - min(300px, 100%) = 300px (minimum)
        - Browser fits 2 columns of 300px
        - 1fr expands them to 400px each
        - Result: 2 equal columns
        
        280px container (mobile):
        - min(300px, 100%) = 100% (280px)
        - Browser fits 1 column
        - Takes full width
        - Result: 1 full-width column
        
        This single line of CSS replaces:
        - @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
        - @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
        - @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
        
        And it's BETTER because it responds to container size,
        not viewport size. This means the same component works in:
        - Full page layouts
        - Sidebars
        - Modals
        - Any container width
        
        STYLE MERGE:
        ...style allows parent components to add additional styles
        while preserving our grid setup. Parent could add:
        - gridAutoRows: 'minmax(200px, auto)' for minimum row height
        - gridTemplateRows: for explicit row sizing
        - Custom CSS properties for theming
      */
      
      {...props}
      /*
        PROP SPREADING:
        Passes through all HTML attributes we didn't destructure.
        This enables:
        - Semantic HTML: role="list" for accessibility
        - Testing: data-testid="product-grid"
        - Event delegation: onClick, onScroll
        - Custom attributes: data-columns for analytics
      */
    >
      {children}
      {/*
        CHILDREN RENDERING:
        
        React renders children as-is. If children is an array
        (like mapped ItemCards), React handles it automatically.
        
        Each child becomes a grid item that:
        1. Respects the grid's column rules
        2. Fills its grid cell (because ItemCard uses w-full)
        3. Maintains aspect ratio based on content
        
        The beauty: ItemCard doesn't know it's in a grid.
        It just fills its container. Perfect separation of concerns.
      */}
    </div>
  )
}

/*
  ITEMCARDSTACK PROPS INTERFACE
  For simple linear layouts - vertical lists or horizontal scrollers.
*/
export interface ItemCardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /*
    Typically ItemCards, but could be any content.
    Flexibility is key for rapid prototyping.
  */
  
  gap?: 2 | 3 | 4 | 5 | 6 | 8
  /*
    Same spacing scale as ItemCardGrid for consistency.
    Your entire app uses the same spacing rhythm.
  */
  
  direction?: 'vertical' | 'horizontal'
  /*
    DIRECTION OPTIONS:
    
    'vertical' (default):
    - Cards stack top to bottom
    - Use case: Lists, feeds, form sections
    - Scrolls naturally with page
    
    'horizontal':
    - Cards align left to right
    - Use case: Carousels, tab-like interfaces
    - May need overflow-x-auto for scrolling
    
    This maps directly to flexbox direction:
    - vertical = flex-col
    - horizontal = flex-row
  */
}

/*
  ITEMCARDSTACK COMPONENT
  Simple linear layouts that mirror Framer's Stack component.
  Perfect for lists, feeds, or any sequential content.
*/
export function ItemCardStack({
  children,
  gap = 4,
  direction = 'vertical',
  className,
  ...props
}: ItemCardStackProps) {
  
  // DYNAMIC CLASS CONSTRUCTION
  const gapClass = `gap-${gap}`
  const directionClass = direction === 'vertical' ? 'flex-col' : 'flex-row'
  /*
    FLEXBOX DIRECTION MAPPING:
    
    flex-col (vertical):
    - Main axis: top to bottom
    - Cross axis: left to right
    - Items stack vertically
    - Width: items stretch to fill container (default)
    - Height: items size to their content
    
    flex-row (horizontal):
    - Main axis: left to right (or RTL)
    - Cross axis: top to bottom
    - Items align horizontally
    - Width: items size to their content
    - Height: items stretch to fill container (default)
    
    This matches Framer's Stack component behavior exactly.
  */
  
  return (
    <div
      className={cn(
        'flex',          // Activates flexbox layout
        directionClass,  // Sets the direction
        gapClass,        // Consistent spacing
        className        // Parent customization
      )}
      /*
        FLEXBOX VS GRID - WHEN TO USE EACH:
        
        ItemCardStack (Flexbox) is perfect for:
        - Single-dimension layouts
        - Dynamic number of items
        - Items with varying sizes
        - Alignment control (center, end, space-between)
        
        ItemCardGrid (CSS Grid) is perfect for:
        - Two-dimensional layouts
        - Consistent card sizes
        - Responsive columns
        - Complex layouts with gaps
        
        COMMON STACK PATTERNS:
        
        VERTICAL FEED:
        <ItemCardStack direction="vertical" gap={4}>
          {posts.map(post => <ItemCard key={post.id} {...post} />)}
        </ItemCardStack>
        
        HORIZONTAL SCROLLER:
        <ItemCardStack 
          direction="horizontal" 
          gap={6}
          className="overflow-x-auto pb-4"
        >
          {products.map(product => (
            <ItemCard key={product.id} className="min-w-[300px]" {...product} />
          ))}
        </ItemCardStack>
        
        CENTERED STACK:
        <ItemCardStack 
          className="items-center justify-center min-h-screen"
        >
          <ItemCard title="Centered!" />
        </ItemCardStack>
        
        The gap utility is SUPERIOR to margins because:
        1. Spacing is consistent between ALL items
        2. No first/last child special cases
        3. Change one value, all spacing updates
        4. No margin collapse issues
        5. Works identically in vertical and horizontal layouts
      */
      
      {...props}
      /*
        Common props that might be passed:
        - role="list" for semantic HTML
        - aria-label="Product list" for screen readers
        - data-orientation={direction} for styling hooks
      */
    >
      {children}
      {/*
        FLEXBOX CHILD BEHAVIOR:
        
        Each child (typically an ItemCard):
        1. Becomes a flex item
        2. Respects the gap spacing
        3. Can grow/shrink based on flex properties
        4. Maintains its intrinsic aspect ratio
        
        Because ItemCards use w-full by default:
        - In vertical stacks: cards fill the width
        - In horizontal stacks: cards size to content
          (unless parent adds specific width classes)
        
        This creates predictable, professional layouts.
      */}
    </div>
  )
}

// ============================================================================
// THE COMPLETE ARCHITECTURE PHILOSOPHY
// ============================================================================

/*
  THE THREE-LAYER ARCHITECTURE IN ACTION:
  
  1. ATOMIC LAYER (shadcn/ui components)
     └─ Card, CardHeader, CardTitle, CardDescription
     └─ Copied via CLI: npx shadcn@latest add card
     └─ Lives in: src/components/ui/
     └─ Owned completely - can modify without fear
  
  2. COMPOSITION LAYER (ItemCard component)
     └─ Combines atomics into reusable patterns
     └─ TypeScript interfaces for type safety
     └─ Props for flexibility without complexity
     └─ Conditional rendering for clean DOM
  
  3. LAYOUT LAYER (ItemCardGrid, ItemCardStack)
     └─ Responsive patterns for card groups
     └─ CSS Grid magic for responsive layouts
     └─ Flexbox patterns for linear arrangements
     └─ Zero media queries needed
  
  4. APPLICATION LAYER (Your pages/features)
     └─ Imports and uses ItemCard with specific data
     └─ Composes cards in grids or stacks
     └─ Focuses on business logic, not UI details
  
  WHY THIS ARCHITECTURE ENABLES 2-HOUR MVPS:
  
  ✅ INFINITE FLEXIBILITY WITH FINITE COMPONENTS
     - One ItemCard component handles:
       * Product cards: title={product.name} description={product.price}
       * User cards: title={user.name} description={user.role}
       * Article cards: title={article.title} description={article.excerpt}
       * Dashboard cards: title="Revenue" description="$12,450"
     - Same component, different props = different features
  
  ✅ TYPE SAFETY PREVENTS BUGS
     - TypeScript catches errors at compile time
     - IntelliSense shows available props
     - Refactoring is safe with type checking
     - No runtime surprises in production
  
  ✅ SHADCN/UI PROVIDES PROFESSIONAL POLISH
     - Every component looks good by default
     - Dark mode works automatically
     - Accessibility is built-in
     - Consistent design tokens throughout
  
  ✅ TAILWIND ENABLES INSTANT CUSTOMIZATION
     - Change styles with className props
     - No CSS files to manage
     - Responsive utilities built-in
     - PurgeCSS keeps bundle tiny
  
  ✅ RESPONSIVE BY DEFAULT
     - ItemCardGrid adapts to any container
     - No breakpoints to manage
     - Works in modals, sidebars, full pages
     - Mobile-first without thinking about it
  
  THE FRAMER PHILOSOPHY CONNECTION:
  
  This code implements Framer's visual principles:
  
  1. RELATIVE SIZING
     - Components use w-full (width: 100%)
     - Size comes from containers, not components
     - Just like Framer's "Fill Container"
  
  2. STACK PATTERNS
     - ItemCardStack mirrors Framer's Stack
     - Gap utilities = Framer's spacing
     - Direction prop = Framer's direction
  
  3. AUTO LAYOUT
     - CSS Grid auto-fit = Framer's responsive grid
     - Flexbox = Framer's auto layout
     - Components reflow naturally
  
  THE BUSINESS VALUE:
  
  SPEED TO MARKET:
  - Build MVPs in hours, not weeks
  - Test ideas with real users quickly
  - Iterate based on feedback, not assumptions
  
  MAINTAINABILITY:
  - One pattern to understand
  - Consistent codebase
  - New developers onboard quickly
  
  SCALABILITY:
  - Same components from prototype to production
  - No rewrites as you grow
  - Performance optimized from day one
  
  CLIENT DELIGHT:
  - Live demos during sales calls
  - Changes happen in real-time
  - Professional appearance immediately
  
  THE SOLOPRENEUR'S ADVANTAGE:
  
  You're not competing on features or complexity.
  You're competing on speed, quality, and reliability.
  
  While others debate frameworks:
  - You're shipping products
  
  While others write custom CSS:
  - You're talking to customers
  
  While others debug npm conflicts:
  - You're collecting payments
  
  This stack isn't just technology—it's a business strategy.
  Master it once, profit forever.
  
  PRACTICAL NEXT STEPS:
  
  1. Use ItemCard for everything card-like
  2. Use ItemCardGrid for responsive layouts
  3. Use ItemCardStack for lists and feeds
  4. Customize with className props
  5. Extend with new props only when needed
  
  Remember: The goal isn't to build the perfect component.
  The goal is to ship products that make money.
  
  This component library enables that goal.
*/