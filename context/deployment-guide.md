# Deployment Guide

## Current Status: Production Deployed ✅

This guide documents the complete deployment process for the Claims App, including the resolution of all major deployment issues encountered during development.

## Vercel Deployment Overview

The application is successfully deployed on Vercel's serverless platform with the following optimizations:
- **Regional Deployment**: US East (iad1) for optimal performance
- **Custom Build Configuration**: Optimized build process via vercel.json
- **Serverless Function Optimization**: 30-second timeout configuration
- **Cross-Platform Compatibility**: Resolved case sensitivity issues

## Environment Variables Setup

### Required Environment Variables in Vercel Dashboard

Set these variables in your Vercel project settings → Environment Variables:

#### Database Configuration
```
DATABASE_URL=postgresql://username:password@host/database?sslmode=require&channel_binding=require
```
- **Purpose**: Connection string for PostgreSQL database (Neon)
- **Environment**: Production, Preview, and Development
- **Security**: SSL required with channel binding

#### Authentication (Clerk)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key
CLERK_SECRET_KEY=sk_live_your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```
- **Purpose**: Clerk authentication service configuration
- **Note**: Replace with your actual Clerk keys for production

#### File Upload (Cloudinary)
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
- **Purpose**: Image and file upload service configuration

#### Application Configuration
```
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```
- **Purpose**: Application base URL for proper redirects and API calls

## Build Configuration (vercel.json)

The application uses a custom `vercel.json` configuration:

```json
{
  "buildCommand": "prisma generate && next build",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "installCommand": "npm install"
}
```

### Configuration Details:
- **buildCommand**: Ensures Prisma client generation before Next.js build
- **functions.maxDuration**: 30-second timeout for API routes (handles complex database operations)
- **regions**: Deployed in US East for optimal performance
- **installCommand**: Uses `npm install` instead of `npm ci` for better compatibility

## Deployment Process

### Automatic Deployment
1. **Git Push**: Push commits to main branch triggers automatic deployment
2. **Build Process**: Vercel runs custom build command with Prisma generation
3. **Environment Variables**: Automatically injected from Vercel dashboard
4. **Function Deployment**: API routes deployed as serverless functions

### Manual Deployment
1. Access Vercel dashboard for your project
2. Navigate to Deployments tab
3. Click "Deploy" button to trigger manual deployment
4. Monitor build logs for any issues

## Critical Fixes Implemented

### 1. Case Sensitivity Resolution (Commit: d596c14)
**Problem**: Modal component files caused "Module not found" errors on Vercel's case-sensitive filesystem
**Solution**: 
- Renamed `Modal.tsx` → `modal.tsx` using `git mv` for proper tracking
- Updated all import statements to use lowercase filenames
- Ensured consistent file naming across all components

### 2. Package Lock Synchronization (Commit: d99d97d)  
**Problem**: npm ci failed due to package-lock.json sync issues with picomatch dependency
**Solution**:
- Regenerated package-lock.json with `npm install`
- Updated vercel.json to use `npm install` instead of `npm ci`
- Resolved dependency version conflicts

### 3. Environment Variable Configuration (Commit: 756a1d4)
**Problem**: vercel.json referenced non-existent secrets causing "Secret does not exist" errors
**Solution**:
- Removed `env` section from vercel.json that referenced secrets with `@` prefix
- Used standard Vercel dashboard environment variables instead
- Simplified configuration following Next.js best practices

### 4. Serverless Optimization (Commit: a862a9c)
**Problem**: 500 errors on Vercel due to non-optimized Prisma client for serverless
**Solution**:
- Enhanced Prisma client configuration with serverless-specific settings
- Added graceful shutdown handling for serverless functions
- Implemented production-grade error logging with detailed debugging

## Troubleshooting Common Issues

### Build Failures

#### "Module not found" Errors
- **Cause**: Case sensitivity differences between local (macOS) and production (Linux)
- **Solution**: Ensure all file names use consistent casing, prefer lowercase
- **Prevention**: Use `git mv` for file renames to ensure proper Git tracking

#### "npm ci" Package Lock Errors
- **Cause**: package-lock.json out of sync with package.json
- **Solution**: Delete package-lock.json, run `npm install`, commit new lock file
- **Prevention**: Use `npm install` in vercel.json instead of `npm ci`

#### Environment Variable Issues
- **Cause**: Missing or incorrectly configured environment variables
- **Solution**: Verify all required variables are set in Vercel dashboard
- **Check**: Ensure variable names match exactly (case-sensitive)

### Runtime Errors

#### 500 API Errors
- **Cause**: Database connection issues or Prisma client not optimized for serverless
- **Solution**: Verify DATABASE_URL and ensure Prisma client has serverless optimizations
- **Debug**: Check Vercel function logs for detailed error information

#### Authentication Errors
- **Cause**: Incorrect Clerk configuration or missing environment variables
- **Solution**: Verify Clerk keys and ensure proper domain configuration
- **Check**: Confirm NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is accessible client-side

### Performance Issues

#### Slow API Responses
- **Cause**: Database connection overhead in serverless environment
- **Solution**: Ensure Prisma client uses connection pooling and proper singleton pattern
- **Monitor**: Use Vercel analytics to identify slow functions

#### Function Timeouts
- **Cause**: Operations taking longer than default 10-second limit
- **Solution**: Increase maxDuration in vercel.json (configured to 30 seconds)
- **Optimize**: Review database queries for efficiency

## Monitoring and Debugging

### Vercel Dashboard
- **Build Logs**: Monitor deployment process and identify build issues
- **Function Logs**: Real-time API route execution logs with error details
- **Analytics**: Performance metrics and usage statistics
- **Environment Variables**: Secure management of sensitive configuration

### Application Logging
- **Development**: Detailed logging with query information and warnings
- **Production**: Error-only logging with enhanced debugging information
- **Environment Context**: Automatic environment detection in error logs
- **Stack Traces**: Full error stack traces for debugging (development only)

## Security Considerations

### Environment Variables
- **Never commit**: Sensitive credentials should never be in version control
- **Vercel Dashboard**: Use Vercel's secure environment variable management
- **Environment Scoping**: Set appropriate environment scopes (Production/Preview/Development)

### Database Security
- **SSL Connections**: Required with channel binding for enhanced security
- **Connection Pooling**: Prevents connection exhaustion and improves security
- **Query Validation**: All API inputs validated with Zod schemas

### API Security
- **Error Handling**: Production errors don't expose sensitive information
- **Rate Limiting**: Consider implementing for production applications
- **Authentication**: Clerk integration ready for role-based access control

## Next Steps After Deployment

1. **Enable Authentication**: Activate Clerk authentication system
2. **Enable Photo Upload**: Activate Cloudinary integration for file uploads
3. **Performance Monitoring**: Set up monitoring and alerting
4. **Custom Domain**: Configure custom domain if needed
5. **SSL Certificate**: Vercel provides automatic SSL certificates

## Support and Maintenance

### Regular Maintenance
- **Dependency Updates**: Keep Next.js, Prisma, and other dependencies current
- **Security Patches**: Monitor for security updates and apply promptly
- **Performance Monitoring**: Regular review of function performance and optimization
- **Database Maintenance**: Monitor database performance and optimize queries

### Backup and Recovery
- **Database Backups**: Ensure regular database backups (handled by Neon)
- **Code Repository**: Maintain clean Git history with descriptive commits
- **Environment Variables**: Document all environment variables and their purposes
- **Deployment History**: Vercel maintains deployment history for rollback capability

This deployment guide represents the culmination of resolving all major deployment challenges and achieving a production-ready state on Vercel's serverless platform.