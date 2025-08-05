# Tech Stack

## Current Version: 0.1.1 (Production-Ready)

## Frontend Architecture
- **React 18.3.1** - Modern React with concurrent features
- **Next.js 15.2.3** - Latest version with App Router and server components
- **TypeScript 5** - Full type safety across the application
- **CSS Modules** - Component-scoped styling with .module.css files
- **Lucide React 0.526.0** - Modern icon library for UI components

## Backend & API Infrastructure  
- **Next.js API Routes** - Serverless API endpoints with enhanced error handling
- **Prisma ORM 6.12.0** - Database toolkit with serverless optimization
- **PostgreSQL on Neon** - Serverless Postgres with SSL connections
- **Zod 4.0.5** - Runtime type validation and schema validation
- **React Hook Form 7.60.0** - Performant form handling with validation

## Authentication & Security
- **Clerk 6.25.4** - Complete authentication system (configured, not yet active)
- **Environment Variable Management** - Secure credential handling via Vercel
- **SSL Database Connections** - Encrypted connections with channel binding

## File Upload & Media
- **Cloudinary 2.7.0** - Image and video management platform  
- **Next-Cloudinary 6.16.0** - Next.js integration for Cloudinary
- **React Dropzone 14.3.8** - File upload interface with drag-and-drop

## Development & Build Tools
- **ESLint 9** - Code linting with Next.js configuration
- **TypeScript Compiler** - Build-time type checking
- **Tailwind CSS 4** - Utility-first CSS framework (configured as fallback)
- **PostCSS** - CSS processing pipeline

## Deployment & DevOps
- **Vercel Platform** - Serverless deployment with edge functions
- **Custom Build Configuration** - vercel.json with optimized settings
- **Regional Deployment** - US East (iad1) for optimal performance
- **Function Timeout Configuration** - 30-second timeouts for API routes
- **Automated Prisma Generation** - Database client generation in build process

## Serverless Optimizations
- **Prisma Client Singleton** - Optimized for serverless environments
- **Connection Pooling** - Efficient database connection management  
- **Graceful Shutdown Handling** - Proper cleanup for serverless functions
- **Enhanced Error Logging** - Production-grade monitoring and debugging
- **Environment-Specific Configuration** - Development vs production optimizations

## Key Dependencies
```json
{
  "next": "15.2.3",
  "@prisma/client": "^6.12.0", 
  "prisma": "^6.12.0",
  "@clerk/nextjs": "^6.25.4",
  "cloudinary": "^2.7.0",
  "zod": "^4.0.5",
  "react-hook-form": "^7.60.0"
}
```

## Cross-Platform Compatibility
- **Case-Sensitive File Systems** - Proper file naming for Linux deployment
- **Package Lock Synchronization** - npm install compatibility across environments
- **Git File Tracking** - Proper version control for case-sensitive systems

