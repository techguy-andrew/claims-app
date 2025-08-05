#!/bin/bash

# Claims App - Clean Dependency Installation Script
# This script ensures a clean installation with compatible versions

echo "🚀 Claims App - Clean Installation Started"
echo "========================================="

# Step 1: Clean existing installation
echo "📦 Cleaning existing installation..."
rm -rf node_modules
rm -f package-lock.json
rm -rf .next
rm -rf ~/npm/_cacache

# Step 2: Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Step 3: Install dependencies
echo "⬇️  Installing dependencies..."
npm install

# Step 4: Generate Prisma client
echo "🔧 Generating Prisma client..."  
npx prisma generate

# Step 5: Verify installation
echo "✅ Verifying installation..."
if npm list --depth=0 > /dev/null 2>&1; then
    echo "✅ All dependencies installed successfully!"
else
    echo "❌ Some dependencies may have issues. Check the output above."
    exit 1
fi

echo "========================================="
echo "🎉 Installation complete! You can now run:"
echo "   npm run dev    - Start development server"
echo "   npm run build  - Build for production"  
echo "   npm run lint   - Run linting"
echo "========================================="