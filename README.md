# The Rapid Prototyping Template - From Zero to Demo in 2 Hours

**The ultimate Next.js + shadcn/ui template for software agency solopreneurs who ship fast.**

## 🚀 Quick Start for New Projects (Under 2 Minutes)

```bash
# Clone this template for your new client project
./repo-cloner.sh

# When prompted, enter:
# 1. Source: https://github.com/techguy-andrew/new-project
# 2. Local path: ~/projects/client-name
# 3. Destination: https://github.com/yourname/client-project

# That's it! Your project is ready with git initialized
cd ~/projects/client-name
pnpm install
pnpm dev
```

**Result**: Full-stack app with auth, database, and 25+ UI components ready to customize.

## ⚡ The 2-Hour MVP Challenge

This template is optimized for one goal: **delivering working demos to clients FAST**. Here's what you can build in 2 hours:

- ✅ Complete SaaS dashboard with authentication
- ✅ Marketing site with pricing, features, testimonials
- ✅ E-commerce storefront with product catalog
- ✅ Admin panel with data tables and forms
- ✅ Any combination of the above

All with production-ready code, not throwaway prototypes.

## 🎯 Why This Template Exists

Building websites and web apps for clients should be fast, consistent, and reliable. This template follows our **"Forever Tech Stack"** philosophy - we use the same proven tools for every project, which means:

- ✅ You learn one set of tools and get better with each project
- ✅ Every project looks familiar, even if different developers work on it
- ✅ No time wasted choosing technologies - decisions are already made
- ✅ Clients get reliable, maintainable applications
- ✅ You can move between projects without relearning everything

## 📋 Using repo-cloner.sh - The Smart Template System

The `repo-cloner.sh` script is your starting point for every new project. It's an interactive tool that:
- Clones this template (or any repository)
- Removes all git history for a clean start
- Sets up a fresh repository linked to your client's GitHub
- Handles all the tedious setup automatically

### How to Use repo-cloner.sh

```bash
# Make sure it's executable (first time only)
chmod +x repo-cloner.sh

# Run the cloner
./repo-cloner.sh

# You'll be prompted for:
# 1. Source repository (use this template or any other)
# 2. Where to create the project locally
# 3. The new GitHub repository URL
```

### Example Session

```
===================================
       REPO CLONER v1.0           
===================================

1. SOURCE REPOSITORY
Which repository would you like to use as a template?
> https://github.com/techguy-andrew/new-project

2. LOCAL DIRECTORY  
Where should this project be created on your local machine?
> ~/projects/acme-corp-dashboard

3. DESTINATION REPOSITORY
What is the GitHub repository URL for your new project?
> https://github.com/myagency/acme-corp-dashboard

Ready to proceed? (y/n): y

✅ Success! Repository cloned and pushed!
```

## 🚀 Complete Setup Guide

### Prerequisites

1. **Node.js** (version 18.17 or newer) - [Download here](https://nodejs.org/)
2. **Git** - [Download here](https://git-scm.com/)
3. **pnpm** - Comes with Node.js via Corepack
4. **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### Step 1: Clone for Your Client

```bash
# Use the repo cloner for a clean start
./repo-cloner.sh

# OR manually clone if you prefer
git clone https://github.com/techguy-andrew/new-project client-project
cd client-project
rm -rf .git
git init
```

### Step 2: Install Dependencies

```bash
pnpm install
```

> If pnpm isn't recognized, enable it with: `corepack enable`

### Step 3: Set Up Your Secret Keys

Every project needs some "secret keys" to work properly. These are like passwords for different services.

```bash
# Copy the example file
cp .env.example .env.local
```

Now open `.env.local` in VS Code and you'll see something like:

```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

You'll need to replace these with real values (see "Setting Up Services" below).

### Step 4: Start Building!

```bash
pnpm dev
```

**What this does:** Starts your website locally. Open [http://localhost:3000](http://localhost:3000) in your browser to see it!

## 🔧 Setting Up Services (One-Time Setup)

### Database (Where Your Data Lives)

1. Go to [Neon.tech](https://neon.tech) and create a free account
2. Click "Create Database"
3. Copy the connection string (starts with `postgresql://`)
4. Paste it in your `.env.local` file for both `DATABASE_URL` and `DATABASE_URL_UNPOOLED`

### Authentication (User Login System)

1. Go to [Clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Copy your API keys from the dashboard
4. Paste them in your `.env.local` file

### Connect Your Database

After setting up your database credentials, run:

```bash
pnpm db:push
```

**What this does:** Creates the tables in your database where data will be stored.

## 📁 Where Everything Lives

```
your-client-project/
├── src/app/           # All your pages go here
│   ├── page.tsx       # Homepage (what users see first)
│   ├── (auth)/        # Login & signup pages
│   └── (dashboard)/   # Pages for logged-in users
├── src/components/    # Reusable pieces of UI
│   └── ui/           # Buttons, cards, forms, etc.
├── prisma/           # Database structure
└── public/           # Images, fonts, downloads
```

### Key Concept: Everything is organized the same way in every project!

## 🎨 Using shadcn/ui Components (Our UI Foundation)

### Quick Start - Adding Components

shadcn/ui is our **foundational UI system** for rapid prototyping and building production-ready interfaces. Here's how to use it:

#### 1. Browse Available Components
Visit [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components) to see all available components with live demos.

#### 2. Install Components You Need
Copy the CLI command from the documentation and run it:

```bash
# Install a single component
npx shadcn@latest add button

# Install multiple components at once
npx shadcn@latest add dialog form select

# Or use the global CLI (already installed on your system)
shadcn add button dialog form
```

#### 3. Use the Component
Components are automatically added to `src/components/ui/`. Import and use them:

```typescript
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Page() {
  return (
    <Card className="p-6">
      <Button>Click me</Button>
    </Card>
  )
}
```

### Recommended Components for Prototyping

#### Phase 1: Essential Components (Add These First)
```bash
# Forms and inputs
npx shadcn@latest add form select textarea checkbox radio-group switch

# Feedback and display
npx shadcn@latest add alert badge skeleton separator

# Navigation
npx shadcn@latest add dropdown-menu navigation-menu
```

#### Phase 2: Enhanced UI (Add When Needed)
```bash
# Overlays and modals
npx shadcn@latest add sheet dialog alert-dialog

# Interactive elements
npx shadcn@latest add tooltip popover hover-card avatar

# Layout helpers
npx shadcn@latest add scroll-area aspect-ratio
```

### Component Customization

All shadcn components are copied to your project, giving you full control:

1. **Find the component** in `src/components/ui/`
2. **Modify styles** by changing Tailwind classes
3. **Add variants** or new props as needed
4. **Keep consistency** across your modifications

Example - Customizing a Button:
```typescript
// src/components/ui/button.tsx
// You can modify colors, sizes, or add new variants
// The component is yours to customize!
```

## 🏃 The Agency Workflow - From Meeting to MVP

### During Client Meeting (Live Demo)
```bash
# 1. Share your screen
# 2. Clone the template
./repo-cloner.sh

# 3. Add components as they describe features
npx shadcn@latest add card table form dialog

# 4. Show instant results
pnpm dev

# 5. Deploy live (they watch it happen)
vercel

# "Here's your product taking shape in real-time"
```

### Post-Meeting Rapid Development (2 Hours)
```bash
# Hour 1: Core Features
- Add all discussed shadcn components
- Set up Clerk authentication
- Configure Neon database
- Create basic data models with Prisma

# Hour 2: Polish & Deploy
- Customize colors to match brand
- Add client's logo and copy
- Set up preview deployments
- Send client the live URL
```

## 🎨 Common Tasks

### Adding a New Page

1. Create a new folder in `src/app/` with your page name
2. Add a `page.tsx` file inside
3. Example for an "About" page:

```bash
# Create the folder and file
mkdir src/app/about
touch src/app/about/page.tsx
```

Then add this code to `page.tsx`:

```typescript
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Information about the company goes here.</p>
    </div>
  )
}
```

Your page is now available at `http://localhost:3000/about`!

### Making Changes to the Homepage

Open `src/app/page.tsx` and edit the content between the `return` statement. Save the file and your browser will automatically update!

### Adding a New Component

Components are reusable pieces (like a custom button that appears on multiple pages):

1. Create a new file in `src/components/`
2. Example - a hero section:

```typescript
// src/components/hero.tsx
export function Hero() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl font-bold">Welcome to Our Site</h1>
      <p className="text-gray-600 mt-4">Your tagline here</p>
    </section>
  )
}
```

Use it in any page:

```typescript
import { Hero } from '@/components/hero'

export default function Page() {
  return <Hero />
}
```

### Styling with Tailwind CSS

Instead of writing CSS files, we use Tailwind classes directly in our components:

```typescript
// Instead of creating a CSS file with:
// .button { background: blue; color: white; padding: 8px 16px; }

// We write:
<button className="bg-blue-500 text-white px-4 py-2">
  Click me
</button>
```

Common classes:
- `p-4` = padding
- `m-4` = margin  
- `text-xl` = larger text
- `font-bold` = bold text
- `bg-blue-500` = blue background
- `rounded` = rounded corners

## 🛠️ Available Commands

Run these in your terminal while in the project folder:

```bash
pnpm dev          # Start development (view your site locally)
pnpm build        # Prepare for production (before deploying)
pnpm lint         # Check for code issues
pnpm db:studio    # View/edit your database in a visual interface
```

## 📚 Understanding the Stack (What We Use and Why)

Following our **"Forever Tech Stack"** philosophy, every project uses:

### Core Technologies (Always Used)

- **Next.js**: The framework that powers everything (like WordPress but for modern apps)
- **TypeScript**: JavaScript with spell-check - catches errors before they happen
- **PostgreSQL**: Database where all your data is stored (users, posts, etc.)
- **Prisma**: Tool that makes database operations simple and safe
- **Tailwind CSS**: Styling system - no need to write CSS files
- **shadcn/ui**: Complete UI component system for rapid prototyping (buttons, forms, modals, etc.)
- **Clerk**: Handles all user authentication (login, signup, passwords)
- **Vercel**: Where we deploy websites (makes them live on the internet)

### Why These Specific Tools?

We chose these tools because they:
- Work well together without conflicts
- Have excellent documentation and community support
- Scale from simple sites to complex applications
- Are actively maintained and improved
- Let us build fast without sacrificing quality

## 🚫 What NOT to Do (Important!)

Following our philosophy, avoid these:

- ❌ **Don't install different UI libraries** - Use shadcn/ui components exclusively
- ❌ **Don't build custom versions of existing shadcn components** - Use what's available first
- ❌ **Don't install shadcn as an npm package** - Always use the CLI to copy components
- ❌ **Don't create custom authentication** - Clerk handles this
- ❌ **Don't use different databases** - PostgreSQL for everything
- ❌ **Don't add CSS-in-JS libraries** - Tailwind only
- ❌ **Don't create microservices** - Keep it simple with one app
- ❌ **Don't mix component systems** - shadcn/ui is our single source of truth

## 🐛 Troubleshooting

### "Command not found: pnpm"

Node.js comes with pnpm through Corepack. Enable it:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### "Cannot connect to database"

1. Check your `.env.local` file has the correct `DATABASE_URL`
2. Make sure your database is active on Neon.tech
3. Run `pnpm db:push` to sync the schema

### "Clerk authentication not working"

1. Verify your Clerk keys in `.env.local`
2. Check that URLs match in Clerk dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`

### Page not updating when you save

1. Make sure `pnpm dev` is running in your terminal
2. Check for errors in the terminal
3. Try refreshing your browser

## 🚀 Deploying (Making It Live)

When your client's site is ready:

1. Push your code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add your environment variables (from `.env.local`)
5. Click "Deploy"

Your site will be live in minutes with a URL like `https://your-project.vercel.app`

## 📖 Learning Resources

New to these technologies? Start here:

- **Next.js**: [Learn Next.js](https://nextjs.org/learn) - Official interactive tutorial
- **TypeScript**: [TypeScript for JavaScript Developers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- **Tailwind CSS**: [Tailwind CSS Docs](https://tailwindcss.com/docs) - Search any class
- **Prisma**: [Prisma Getting Started](https://www.prisma.io/docs/getting-started)

## 💡 Project Workflow

### Starting a New Feature

1. Create a new branch: `git checkout -b feature-name`
2. Make your changes
3. Test locally with `pnpm dev`
4. Commit your changes: `git add . && git commit -m "Add new feature"`
5. Push to GitHub: `git push origin feature-name`

### Daily Development Flow

```bash
# Morning - start working
git pull origin main     # Get latest changes
pnpm install             # Update dependencies if needed
pnpm dev                 # Start development

# Throughout the day - save your work
git add .
git commit -m "Describe what you changed"
git push

# End of day
git push                 # Make sure everything is saved
```

## 🤝 Getting Help

- **Documentation Issues**: Check this README first
- **Code Problems**: Look for error messages in your terminal or browser console
- **Stack-Specific Questions**: Each technology has great docs (links above)
- **Team Support**: Ask in your team chat - we all use the same stack!

## 💼 Why Clients Choose You

When you use this stack, you offer something unique:

1. **Live Demos in First Meetings** - Not mockups, real working software
2. **Same-Day Prototypes** - "Let me build that while we talk"
3. **Production-Ready from Day 1** - No throwaway code
4. **Predictable Pricing** - Same stack = accurate estimates
5. **Fast Iterations** - Changes in minutes, not days

## 🎯 The Solopreneur Advantage

This template is specifically optimized for solo agency owners:

- **One-person efficiency**: Do the work of a 5-person team
- **Recurring revenue ready**: Easy to maintain = profitable retainers
- **Client-impressive speed**: Win projects by moving faster
- **Scale without hiring**: Handle more clients, not more complexity

## 📝 Final Notes

**The Secret**: While others are debating tech stacks, you're shipping products. This template embodies the "Forever Tech Stack" philosophy:

- **One stack, mastered deeply** - Expertise compounds with every project
- **shadcn/ui at the core** - Professional UI in minutes, not days
- **Optimized for speed** - 2-hour MVPs aren't a goal, they're the standard
- **Built for the long game** - Today's prototype is tomorrow's unicorn

Ready to build something amazing? Your next client is waiting, and with this template, you're always ready to deliver.

---

*The Rapid Prototyping Template - Where agency dreams become client realities.*
*Built with shadcn/ui, Next.js, and the power of focused simplicity.*