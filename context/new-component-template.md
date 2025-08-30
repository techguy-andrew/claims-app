// A custom component is essentially a composite component made up of atomic shadcn/ui components. Think of it like LEGO blocks - shadcn/ui gives you the basic blocks (Button, Card, Badge), and you combine them to build something more complex.

// The LEGO Block Analogy
shadcn/ui components = Individual LEGO blocks

<Button /> = A basic button block
<Card /> = A container block
<Badge /> = A small label block

Your custom component = A LEGO creation made from those blocks

You combine Card + Button + Badge + Icons to create something new
Each atomic piece is owned by you (thanks to shadcn/ui's copy model)
You arrange them with Tailwind classes and React logic

The Framer Translation Process

Framer Variants → TypeScript interfaces defining all possible states
Framer Visual States → Conditional Tailwind classes (${condition ? 'style-a' : 'style-b'})
Framer Animations → Native CSS transitions (transition-all duration-300)
Framer Interactions → React event handlers (onClick, onHover)
Framer Component Properties → TypeScript props with defaults

The Stack Advantage
When you need a new component, you never start from scratch:
bash# Step 1: Install the atomic pieces you need
npx shadcn@latest add card button badge dialog

# Step 2: Compose them into your custom component
# Step 3: Add TypeScript interfaces for type safety
# Step 4: Deploy - no build process changes needed
This is why the stack is so powerful for agencies. Every custom component is built from the same reliable foundation, so complexity never spirals out of control. You're essentially "Framer-ing" with code - same visual results, but with full ownership and production performance.

// IMPORT SECTION - Getting our atomic building blocks from shadcn/ui
// These are the basic "LEGO blocks" we'll combine to make our custom component
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card" // Basic card structure (like a container)
import { Button } from "@/components/ui/button" // Clickable button component
import { Badge } from "@/components/ui/badge" // Small label/tag component
import { ArrowRight, Star, Clock } from "lucide-react" // Icons from the Lucide icon library

// TYPESCRIPT INTERFACES - This is how we replace Framer's "variants" system
// In Framer, you'd create variants visually. In code, we define all possible states with TypeScript
interface CardVariant {
  state: 'default' | 'hover' | 'loading' | 'success' // All possible visual states our card can be in
  elevated?: boolean // Optional property - should the card be raised/elevated?
  featured?: boolean // Optional property - is this card special/featured?
}

// PROPS INTERFACE - This defines what data our component needs to work
// Think of this as the "settings panel" you'd see in Framer for a component
interface FramerCardProps {
  title: string // Required: The main heading text
  description: string // Required: The description text
  price?: number // Optional: Price to display (the ? means optional)
  badge?: string // Optional: Small label text
  image?: string // Optional: URL for an image
  variant?: CardVariant['state'] // Optional: Which visual state (defaults to 'default')
  featured?: boolean // Optional: Should this card be highlighted as special?
  onAction?: () => void // Optional: Function to run when button is clicked
  actionLabel?: string // Optional: Text for the button
}

// MAIN COMPONENT FUNCTION - This is our custom composite component
// It takes props (settings) and returns JSX (the visual structure)
export function FramerCard({ 
  title, // Destructuring: pulling out each prop from the props object
  description, 
  price, 
  badge, 
  image,
  variant = 'default', // Default value: if no variant is provided, use 'default'
  featured = false, // Default value: if not specified, featured is false
  onAction,
  actionLabel = "Get Started" // Default button text
}: FramerCardProps) { // TypeScript: this function accepts props of type FramerCardProps
  
  return (
    // MAIN CARD WRAPPER - This is our base shadcn/ui Card component with custom styling
    <Card className={`
      group relative overflow-hidden transition-all duration-300 ease-in-out cursor-pointer
      hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
      ${featured ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-md'}
      ${variant === 'loading' ? 'animate-pulse' : ''}
      ${variant === 'success' ? 'ring-2 ring-green-500' : ''}
    `}>
      {/* 
        BREAKDOWN OF THE CARD CLASSNAME (Tailwind CSS classes):
        - group: Makes this element a "group" so child elements can respond to hover on this parent
        - relative: Positioning context for absolutely positioned children
        - overflow-hidden: Clips content that goes outside the card boundaries
        - transition-all duration-300 ease-in-out: Smooth animations for all property changes
        - cursor-pointer: Shows hand cursor on hover (indicates it's clickable)
        - hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]: On hover, add big shadow, move up, and slightly scale
        - ${featured ? '...' : '...'}: Conditional styling - if featured is true, use first style, otherwise second
        - ${variant === 'loading' ? '...' : ''}: If variant is 'loading', add pulse animation
      */}
      
      {/* BACKGROUND GRADIENT OVERLAY - This creates the subtle color wash on hover */}
      {/* In Framer, this would be a background layer you animate. Here it's a div with CSS transitions */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/*
        - absolute inset-0: Covers the entire card area
        - bg-gradient-to-br: Gradient from top-left to bottom-right
        - from-blue-50/50 to-purple-50/50: Very light blue to very light purple, both at 50% opacity
        - opacity-0: Invisible by default
        - group-hover:opacity-100: When parent (the Card) is hovered, make this visible
        - transition-opacity duration-300: Smooth fade in/out animation
      */}
      
      {/* FEATURED BADGE - Only shows if the card is marked as featured */}
      {featured && ( // Only render this if 'featured' is true
        <div className="absolute -top-1 -right-1 z-10">
          {/* Positioned at top-right corner, z-10 ensures it's above other elements */}
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
            {/* Custom styling for the shadcn/ui Badge component - gradient background, white text, no border */}
            <Star className="w-3 h-3 mr-1" />
            {/* Star icon from Lucide, 3x3 size, right margin for spacing */}
            Featured
            {/* The text inside the badge */}
          </Badge>
        </div>
      )}

      {/* IMAGE SECTION - Only shows if an image URL is provided */}
      {image && ( // Only render this if 'image' prop has a value
        <div className="relative h-48 overflow-hidden">
          {/* Container: relative positioning, fixed height, hide overflow */}
          <img 
            src={image} // Image source from props
            alt={title} // Alt text for accessibility (uses the title)
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            // w-full h-full: Fill the container
            // object-cover: Crop image to fit without distortion
            // transition-transform duration-300: Smooth scaling animation
            // group-hover:scale-110: When card is hovered, scale image to 110% (zoom effect)
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Dark overlay that appears on hover - creates depth effect */}
        </div>
      )}

      {/* CARD HEADER - Uses shadcn/ui CardHeader component */}
      <CardHeader className="relative z-10">
        {/* relative z-10: Ensures header content stays above background effects */}
        <div className="flex items-start justify-between">
          {/* Flexbox: items at start vertically, space between horizontally */}
          <div>
            {/* Left side content */}
            <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors duration-200">
              {/* shadcn/ui CardTitle component with custom styling */}
              {/* text-xl font-bold: Large, bold text */}
              {/* group-hover:text-blue-600: Changes to blue when card is hovered */}
              {/* transition-colors duration-200: Smooth color change animation */}
              {title} {/* Display the title from props */}
            </CardTitle>
            {badge && ( // Only show badge if badge prop has a value
              <Badge variant="secondary" className="mt-2">
                {/* shadcn/ui Badge with secondary styling (lighter colors) */}
                {/* mt-2: Margin top for spacing */}
                <Clock className="w-3 h-3 mr-1" />
                {/* Clock icon, small size, right margin */}
                {badge} {/* Display badge text from props */}
              </Badge>
            )}
          </div>
          {price && ( // Only show price section if price prop has a value
            <div className="text-right">
              {/* Right-aligned text */}
              <div className="text-2xl font-bold text-blue-600">${price}</div>
              {/* Large, bold, blue price display */}
              <div className="text-sm text-gray-500">/month</div>
              {/* Small, gray text for billing period */}
            </div>
          )}
        </div>
      </CardHeader>

      {/* CARD CONTENT - Main description area */}
      <CardContent className="relative z-10">
        {/* shadcn/ui CardContent component, z-10 keeps it above background effects */}
        <CardDescription className="text-base leading-relaxed">
          {/* shadcn/ui CardDescription with custom styling */}
          {/* text-base: Normal text size */}
          {/* leading-relaxed: More line spacing for better readability */}
          {description} {/* Display description text from props */}
        </CardDescription>
      </CardContent>

      {/* CARD FOOTER - Button area */}
      <CardFooter className="relative z-10">
        {/* shadcn/ui CardFooter component */}
        <Button 
          onClick={onAction} // When clicked, run the function passed in onAction prop
          className="w-full group/btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
          // w-full: Button takes full width
          // group/btn: Creates a nested group (separate from card group) for button-specific hover effects
          // bg-gradient-to-r: Left-to-right gradient background
          // from-blue-500 to-purple-500: Gradient colors
          // hover:from-blue-600 hover:to-purple-600: Darker gradient on hover
          // transition-all duration-200: Smooth animation for all changes
          disabled={variant === 'loading'} // Disable button when in loading state
        >
          {/* BUTTON CONTENT - Changes based on current variant state */}
          {variant === 'loading' ? ( // If currently loading, show loading content
            <>
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full" />
              {/* Loading spinner: animate-spin rotates it, borders create the spinner effect */}
              Processing... {/* Loading text */}
            </>
          ) : variant === 'success' ? ( // If success state, show success content
            <>
              <div className="w-4 h-4 mr-2 bg-white rounded-full flex items-center justify-center">
                {/* White circle container */}
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {/* Small green dot inside - creates a simple success indicator */}
              </div>
              Success! {/* Success text */}
            </>
          ) : ( // Default state - normal button content
            <>
              {actionLabel} {/* Button text from props (defaults to "Get Started") */}
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
              {/* Arrow icon that slides right when button is hovered */}
              {/* group-hover/btn: Responds to hover on the button group */}
              {/* translate-x-1: Moves right by 0.25rem */}
            </>
          )}
        </Button>
      </CardFooter>
      
      {/* FINAL HOVER OVERLAY - Adds extra polish to the hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {/* Very subtle gradient overlay that appears on hover */}
      {/* pointer-events-none: This overlay won't interfere with clicking */}
    </Card>
  )
}

// EXAMPLE USAGE COMPONENT - Shows how to use our custom component
export function FramerCardShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-gray-50 min-h-screen">
      {/* Grid layout: 1 column on mobile, 2 on tablet, 3 on desktop */}
      {/* gap-6: Space between cards, p-8: Padding around entire area */}
      {/* bg-gray-50: Light gray background, min-h-screen: At least full screen height */}
      
      {/* EXAMPLE 1: Basic Card */}
      <FramerCard
        title="Starter Plan" // Required prop
        description="Perfect for individuals and small teams getting started with modern web development." // Required prop
        price={29} // Optional prop
        badge="Most Popular" // Optional prop
        onAction={() => console.log('Starter selected')} // Optional function prop
      />
      
      {/* EXAMPLE 2: Featured Card */}
      <FramerCard
        title="Pro Plan"
        description="Advanced features for growing businesses that need more power and flexibility."
        price={99}
        featured={true} // This will show the "Featured" badge and special styling
        badge="Best Value"
        onAction={() => console.log('Pro selected')}
        actionLabel="Upgrade Now" // Custom button text
      />
      
      {/* EXAMPLE 3: Card with Image */}
      <FramerCard
        title="Enterprise"
        description="Custom solutions for large organizations with dedicated support and advanced security."
        image="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop" // Image URL
        badge="Custom Pricing"
        onAction={() => console.log('Enterprise contacted')}
        actionLabel="Contact Sales"
      />
      
    </div>
  )
}

/*
THE BIG PICTURE - How This Replaces Framer:

1. FRAMER VARIANTS → TYPESCRIPT INTERFACES
   - Framer: Click "Create Variant" and set properties visually
   - Our Stack: Define all possible states with TypeScript interfaces

2. FRAMER COMPONENTS → SHADCN/UI COMPOSITES  
   - Framer: Drag components and set properties in panels
   - Our Stack: Compose atomic shadcn/ui components with props

3. FRAMER ANIMATIONS → CSS TRANSITIONS
   - Framer: Use timeline and animation panel
   - Our Stack: Tailwind classes with transition utilities

4. FRAMER INTERACTIONS → REACT EVENT HANDLERS
   - Framer: Click "Add Interaction" and set triggers
   - Our Stack: onClick, onHover, etc. with TypeScript functions

5. FRAMER STATES → CONDITIONAL RENDERING
   - Framer: Switch between component variants
   - Our Stack: {condition && <Component />} and className conditionals

The result: Same visual quality and interactions as Framer, but with full code ownership, 
type safety, and production-ready performance.
*/