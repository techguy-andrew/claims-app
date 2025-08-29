// Middleware placeholder - authentication is currently disabled for rapid prototyping
// 
// To enable Clerk authentication:
// 1. Rename middleware.ts.disabled back to middleware.ts (replacing this file)
// 2. Add your Clerk API keys to .env.local:
//    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
//    - CLERK_SECRET_KEY
// 3. Deploy with these environment variables configured in Vercel
//
// For now, this middleware simply passes through all requests without authentication

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
  // Pass through all requests - no authentication required
  return NextResponse.next()
}

// Optional: Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}