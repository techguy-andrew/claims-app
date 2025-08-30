// IMPORT SECTION - Getting our custom foundation component
// This demonstrates the composition hierarchy: shadcn/ui → ItemCard → Page Component
import { ItemCard } from '@/components/custom/ItemCard'
// ItemCard is built FROM shadcn/ui Card components (Card, CardHeader, CardContent, etc.)
// We import our custom composite component, not the individual shadcn pieces

// MAIN PAGE COMPONENT - This is a Next.js page component using App Router
// In the stack philosophy, this represents the "application layer" that composes our foundation components
export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      {/* PAGE CONTAINER - Setting up the overall page layout */}
      {/* 
        CONTAINER BREAKDOWN:
        - container: Tailwind utility that sets max-width and centers content responsively
          * On small screens: full width with padding
          * On larger screens: constrained width (like 1200px max) and centered
        - mx-auto: margin-x auto = horizontally centers the container
        - py-10: padding-y (top and bottom) of 2.5rem = vertical spacing around content
        
        This creates a professional, responsive layout that works on all screen sizes
      */}
      
      {/* ITEMCARD USAGE - Demonstrating our foundation component in action */}
      <ItemCard
        // CLASS CUSTOMIZATION - Adding specific styling for this use case
        className="max-w-md"
        // max-w-md: Tailwind class limiting width to 28rem (448px)
        // This gets merged with ItemCard's default classes via the cn() utility
        // The ItemCard's internal className prop allows per-instance customization
        // while maintaining the base component's core styling and behavior
        
        // TITLE PROP - Required content for the card header
        title="Welcome to Your App"
        // This becomes the <CardTitle> inside ItemCard's <CardHeader>
        // Because we defined title as: title?: string | React.ReactNode
        // We could pass either a string (like here) OR complex JSX like:
        // title={<div className="flex items-center gap-2"><Icon /><span>Title</span></div>}
        
        // DESCRIPTION PROP - Supporting content for context
        description="This is a reusable ItemCard component built with shadcn/ui components as building blocks."
        // This becomes the <CardDescription> inside ItemCard's <CardHeader>
        // Like title, it accepts string OR React.ReactNode for maximum flexibility
        // The ItemCard component automatically handles the layout and spacing
      >
        {/* CHILDREN CONTENT - What goes inside the CardContent section */}
        <p className="text-sm text-muted-foreground">
          {/* 
            TAILWIND STYLING BREAKDOWN:
            - text-sm: Smaller text size (0.875rem / 14px)
            - text-muted-foreground: Uses the theme's muted foreground color
              * This is a shadcn/ui design token that automatically adapts to light/dark mode
              * Provides consistent secondary text color across the entire app
            
            This content gets wrapped in <CardContent> by the ItemCard component
            The ItemCard handles the proper spacing, padding, and layout automatically
          */}
          This ItemCard is a flexible, composable component that can be customized with different content, actions, and styling. It demonstrates the power of building custom components on top of shadcn/ui primitives.
        </p>
        {/* 
          CHILDREN PATTERN EXPLANATION:
          - Anything between <ItemCard> and </ItemCard> becomes the "children" prop
          - ItemCard receives this as props.children and renders it inside <CardContent>
          - This allows unlimited customization of the card's main content area
          - You could put forms, images, buttons, lists, or any JSX here
        */}
      </ItemCard>
      {/* 
        ITEMCARD COMPOSITION HIERARCHY:
        1. shadcn/ui provides: <Card>, <CardHeader>, <CardTitle>, <CardDescription>, <CardContent>
        2. ItemCard composes these into a flexible, reusable pattern with TypeScript props
        3. HomePage uses ItemCard with specific props and children for this particular use case
        
        This is the "LEGO block" philosophy in action:
        - shadcn/ui = individual LEGO pieces
        - ItemCard = a LEGO creation/template you can reuse
        - HomePage = using that template in a specific context
      */}
    </div>
  )
}

/*
THE STACK PHILOSOPHY DEMONSTRATED:

1. FOUNDATION LAYER (shadcn/ui)
   - Atomic components: Card, CardHeader, CardTitle, etc.
   - Design tokens: text-muted-foreground, proper spacing
   - Accessibility built-in: proper HTML structure, ARIA labels

2. COMPOSITION LAYER (ItemCard)
   - Combines atomics into meaningful patterns
   - Adds TypeScript interfaces for type safety
   - Provides flexible props for customization
   - Handles conditional rendering and layout logic

3. APPLICATION LAYER (HomePage)
   - Uses composition components for specific business needs
   - Adds page-specific styling and content
   - Demonstrates real-world usage patterns

4. RAPID PROTOTYPING BENEFIT:
   - Want a product card? Same ItemCard, different props
   - Want a user profile card? Same ItemCard, different children
   - Want a pricing card? Same ItemCard, add footer prop
   - All cards maintain visual consistency and professional appearance

5. CLIENT DEMO MAGIC:
   - During client calls, you can rapidly modify the props live
   - Change title, description, add headerAction, modify children
   - Show different layouts by wrapping in ItemCardGrid
   - Client sees their vision come to life in real-time

This single example demonstrates why the dogmatic stack approach works:
- Consistent patterns across all components
- TypeScript safety prevents errors
- shadcn/ui provides professional design
- Tailwind enables rapid customization
- React composition keeps everything flexible

The result: You can build any card-based interface (products, users, articles, 
pricing, dashboards) using this same proven pattern, just with different props.
*/