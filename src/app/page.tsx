import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowRight, 
  Clock, 
  Code2, 
  Rocket, 
  Zap, 
  Terminal,
  Users,
  TrendingUp,
  Package,
  GitBranch,
  CheckCircle2,
  Timer,
  DollarSign,
  Sparkles
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Rapid Prototyping Template</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/techguy-andrew/new-project" target="_blank">
              <Button variant="outline" size="sm">
                <GitBranch className="mr-2 h-4 w-4" />
                Clone Template
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="container relative z-10 flex flex-col items-center justify-center space-y-6 py-24 md:py-32">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="mr-1 h-3 w-3" />
            For Agency Solopreneurs
          </Badge>
          <div className="flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              From Client Meeting to
              <span className="block text-primary">Working Demo in 2 Hours</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              The ultimate Next.js + shadcn/ui template that transforms you into a one-person software agency. 
              Win clients with live demos, not slideware.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" className="min-w-[200px]">
                <Terminal className="mr-2 h-4 w-4" />
                Start with ./repo-cloner.sh
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px]">
                <Clock className="mr-2 h-4 w-4" />
                See 2-Hour Timeline
              </Button>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
          <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
        </div>
      </section>

      {/* The 2-Hour Timeline */}
      <section className="container py-24">
        <div className="mx-auto max-w-[58rem]">
          <div className="flex flex-col items-center text-center mb-12">
            <Timer className="h-12 w-12 text-primary mb-4" />
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
              The 2-Hour MVP Timeline
            </h2>
            <p className="text-lg text-muted-foreground max-w-[42rem]">
              This isn&apos;t theory. It&apos;s a proven, repeatable process that turns prospects into paying clients.
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-8">
              {[
                { time: "0-2 min", task: "Run ./repo-cloner.sh", result: "Fresh project ready with git initialized" },
                { time: "2-10 min", task: "Add shadcn components", result: "Complete UI scaffolding" },
                { time: "10-25 min", task: "Configure Clerk + Neon", result: "Auth & database operational" },
                { time: "25-55 min", task: "Customize for client", result: "Branded, unique interface" },
                { time: "55-60 min", task: "Deploy to Vercel", result: "Live URL to share" },
                { time: "60-120 min", task: "Iterate with feedback", result: "Production-ready MVP" },
              ].map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    {index < 5 && <div className="h-full w-[2px] bg-muted" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-4 mb-2">
                      <Badge variant="secondary">{step.time}</Badge>
                      <h3 className="font-semibold text-lg">{step.task}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="border-t bg-muted/30">
        <div className="container py-24">
          <div className="mx-auto max-w-[58rem]">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-8 text-center">
              The Speed-First Philosophy
            </h2>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <Alert className="mb-8">
                <Zap className="h-4 w-4" />
                <AlertDescription className="text-base">
                  <strong>The Reality:</strong> In agency work, the first meeting sets the tone. When you transform a napkin sketch 
                  into a clickable prototype during lunch, you&apos;re not just a developer—you&apos;re a magician.
                </AlertDescription>
              </Alert>

              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Traditional development starts with backend architecture and database schemas. Agency work demands the opposite: 
                  <strong className="text-foreground"> start with what the client can see and touch</strong>, then build the infrastructure to support it.
                </p>

                <div className="grid gap-6 md:grid-cols-2 my-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        Component-First Development
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        With 50+ shadcn/ui components, you assemble interfaces in minutes. A simple 
                        <code className="mx-1 px-2 py-1 bg-muted rounded text-xs">npx shadcn@latest add</code>
                        provides production-ready UI instantly.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-primary" />
                        Prototype = Production
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Your Day 1 prototype IS your production foundation. That dashboard from the first meeting? 
                        It&apos;s the same one that will handle thousands of users.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <blockquote className="border-l-4 border-primary pl-6 italic my-8">
                  &quot;While competitors schedule follow-up meetings to show mockups, you&apos;re deploying live prototypes to Vercel. 
                  A client mentions they need a dashboard? Within an hour, they&apos;re clicking through their actual product.&quot;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Stack */}
      <section className="container py-24">
        <div className="mx-auto max-w-[58rem]">
          <div className="text-center mb-12">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
              The Power Stack
            </h2>
            <p className="text-lg text-muted-foreground">
              Carefully curated tools that work together seamlessly
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "shadcn/ui",
                description: "50+ components you own and customize. No dependency hell.",
                icon: Sparkles,
                badge: "UI Engine"
              },
              {
                title: "Next.js 15",
                description: "The React framework that scales from landing pages to enterprises.",
                icon: Zap,
                badge: "Framework"
              },
              {
                title: "Clerk Auth",
                description: "Production authentication in 5 minutes. Social logins included.",
                icon: Users,
                badge: "Authentication"
              },
              {
                title: "Neon PostgreSQL",
                description: "Serverless Postgres that scales to zero. Perfect for MVPs.",
                icon: Package,
                badge: "Database"
              },
              {
                title: "Prisma ORM",
                description: "Type-safe database queries. Never write SQL again.",
                icon: Code2,
                badge: "ORM"
              },
              {
                title: "Vercel Deploy",
                description: "Git push = instant deployment. Preview URLs for every commit.",
                icon: Rocket,
                badge: "Hosting"
              }
            ].map((tool) => (
              <Card key={tool.title} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <tool.icon className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">{tool.badge}</Badge>
                  </div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Workflow */}
      <section className="border-t bg-muted/30">
        <div className="container py-24">
          <div className="mx-auto max-w-[58rem]">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-12 text-center">
              The Client-Winning Workflow
            </h2>

            <div className="space-y-8">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-2xl">During the Meeting (Live Coding)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">$</span>
                      <span className="text-muted-foreground"># Share your screen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">$</span>
                      <span>./repo-cloner.sh</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">$</span>
                      <span>npx shadcn@latest add card table form dialog</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">$</span>
                      <span>pnpm dev</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">$</span>
                      <span>vercel</span>
                    </div>
                    <div className="mt-4 text-primary">
                      ✨ &quot;Here&apos;s your product taking shape in real-time&quot;
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <span className="text-2xl font-bold text-primary">1</span>
                    </div>
                    <CardTitle>Pre-Meeting (30 min)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        Clone template
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        Install relevant components
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        Deploy base to Vercel
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <span className="text-2xl font-bold text-primary">2</span>
                    </div>
                    <CardTitle>During Meeting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        Live code features
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        Customize branding
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        Deploy updates live
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <span className="text-2xl font-bold text-primary">3</span>
                    </div>
                    <CardTitle>Post-Meeting (2 hrs)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        Implement all features
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        Configure auth & data
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        Send demo link
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>The Close:</strong> &quot;Everything you just saw is production-ready. We can launch this week.&quot;
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </section>

      {/* The Economics */}
      <section className="container py-24">
        <div className="mx-auto max-w-[58rem]">
          <div className="text-center mb-12">
            <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
              The Agency Economics
            </h2>
            <p className="text-lg text-muted-foreground">
              Time is money. This stack transforms both.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl">Traditional Approach</CardTitle>
                <CardDescription>The old way agencies work</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-red-500">✗</span>
                    <span>2-3 weeks to first demo</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-red-500">✗</span>
                    <span>Multiple meetings before code</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-red-500">✗</span>
                    <span>Mockups and wireframes</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-red-500">✗</span>
                    <span>5-person team required</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-red-500">✗</span>
                    <span>$50k+ project minimum</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500">
              <CardHeader>
                <CardTitle className="text-2xl">Rapid Prototyping</CardTitle>
                <CardDescription>Your competitive advantage</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>2 hours to working demo</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Code during first meeting</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Real, clickable products</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Solo developer efficiency</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>$5k+ project viable</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-3 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">10x</div>
                  <div className="text-sm text-muted-foreground">Faster Development</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">5x</div>
                  <div className="text-sm text-muted-foreground">More Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">∞</div>
                  <div className="text-sm text-muted-foreground">Scalability</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Getting Started */}
      <section className="border-t bg-muted/30">
        <div className="container py-24">
          <div className="mx-auto max-w-[58rem]">
            <div className="text-center mb-12">
              <Terminal className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
                Start Your First Project
              </h2>
              <p className="text-lg text-muted-foreground">
                Three commands to your first client demo
              </p>
            </div>

            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle>The Magic Script: repo-cloner.sh</CardTitle>
                <CardDescription>
                  Interactive tool that clones, configures, and deploys in one go
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gray-900 text-gray-100 p-6 font-mono text-sm">
                  <div className="space-y-4">
                    <div>
                      <div className="text-green-400 mb-2"># Step 1: Clone this template</div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">$</span>
                        <span>git clone https://github.com/techguy-andrew/new-project.git</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-green-400 mb-2"># Step 2: Run the magic script</div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">$</span>
                        <span>./repo-cloner.sh</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-green-400 mb-2"># Step 3: Start building</div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">$</span>
                        <span>pnpm install && pnpm dev</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-4 mt-4">
                      <div className="text-yellow-400">
                        ⚡ You now have a full-stack app with auth, database, and 25+ UI components
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What You Get Instantly</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      Next.js 15 with App Router
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      25+ shadcn/ui components installed
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      Clerk authentication configured
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      Prisma + PostgreSQL ready
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      TypeScript strict mode
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      Tailwind CSS configured
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Common Client Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium mb-1">SaaS Dashboard</div>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        npx shadcn@latest add card table tabs chart
                      </code>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Marketing Site</div>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        npx shadcn@latest add navigation-menu hero
                      </code>
                    </div>
                    <div>
                      <div className="font-medium mb-1">E-commerce</div>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        npx shadcn@latest add card carousel badge
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Client Psychology */}
      <section className="container py-24">
        <div className="mx-auto max-w-[58rem]">
          <div className="text-center mb-12">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
              Why Clients Choose You
            </h2>
            <p className="text-lg text-muted-foreground">
              Understanding client psychology is your secret weapon
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">👁️</span>
                  The Need to See Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Clients get nervous when they can&apos;t see tangible progress. With instant components and live deployments, 
                  every meeting ends with a new URL showing real improvements. This visibility builds trust and reduces anxiety.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  The Need to Feel Unique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No client wants a template—even when buying a template. shadcn/ui&apos;s copy-and-customize model means 
                  every component can be tailored perfectly. Professional enough to impress, customizable enough to feel bespoke.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  The Need for Speed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  In the startup world, speed to market is everything. When you deliver in days what others quote in months, 
                  you become invaluable. This stack enables you to match startup urgency without sacrificing quality.
                </p>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-8">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>The Psychology Hack:</strong> When clients see their idea become real during the first meeting, 
              they&apos;re emotionally invested. The sale is already made—you&apos;re just negotiating details.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* The Promise */}
      <section className="border-t bg-gradient-to-b from-background to-muted/30">
        <div className="container py-24">
          <div className="mx-auto max-w-[58rem] text-center">
            <Badge className="mb-4" variant="secondary">
              <Zap className="mr-1 h-3 w-3" />
              The Bottom Line
            </Badge>
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-6">
              Stop Talking About Building.
              <span className="block text-primary mt-2">Start Building While Talking.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-[42rem] mx-auto">
              This isn&apos;t just a template—it&apos;s your unfair advantage. While others are still choosing their tech stack, 
              you&apos;re deploying v2. While they&apos;re writing proposals, you&apos;re showing working products.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="min-w-[200px]">
                <GitBranch className="mr-2 h-4 w-4" />
                Clone Template Now
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px]">
                <ArrowRight className="mr-2 h-4 w-4" />
                Read Full Documentation
              </Button>
            </div>

            <Separator className="my-12" />

            <div className="grid gap-8 md:grid-cols-3 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">2 hours</div>
                <div className="text-sm text-muted-foreground">From idea to deployed MVP</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1 person</div>
                <div className="text-sm text-muted-foreground">Doing the work of a team</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">∞ possibilities</div>
                <div className="text-sm text-muted-foreground">Same stack, any project</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="font-semibold">The Rapid Prototyping Template</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[42rem]">
              Built by agency solopreneurs, for agency solopreneurs. Transform client ideas into reality at the speed of thought.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="https://github.com/techguy-andrew/new-project" className="hover:text-primary transition-colors">
                GitHub
              </Link>
              <span>•</span>
              <Link href="/docs" className="hover:text-primary transition-colors">
                Documentation
              </Link>
              <span>•</span>
              <Link href="/philosophy" className="hover:text-primary transition-colors">
                Philosophy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}