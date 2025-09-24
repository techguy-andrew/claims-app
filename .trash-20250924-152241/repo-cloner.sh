#!/bin/bash
# repo-cloner.sh - Universal Repository Cloner
# Clone any repository, remove its git history, and push to a new repository

echo "==================================="
echo "       REPO CLONER v1.0           "
echo "==================================="
echo ""
echo "This tool will help you clone any repository as a template"
echo "and push it to a new repository with a fresh git history."
echo ""

# Question 1: Source repository
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. SOURCE REPOSITORY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Which repository would you like to use as a template?"
echo ""
echo "Examples:"
echo "  • https://github.com/techguy-andrew/new-project"
echo "  • https://github.com/username/repository-name"
echo "  • git@github.com:username/repository-name.git"
echo ""
read -p "Source repository URL: " SOURCE_REPO

# Question 2: Local directory
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. LOCAL DIRECTORY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Where should this project be created on your local machine?"
echo ""
echo "Examples:"
echo "  • /Users/$(whoami)/Documents/dev/my-new-project"
echo "  • ~/projects/client-website"
echo "  • ./my-new-app"
echo ""
read -p "Local directory path: " TARGET_DIR

# Expand tilde to home directory
TARGET_DIR="${TARGET_DIR/#\~/$HOME}"

# Question 3: Destination repository
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. DESTINATION REPOSITORY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "What is the GitHub repository URL for your new project?"
echo ""
echo "Examples:"
echo "  • https://github.com/$(whoami)/my-new-project"
echo "  • git@github.com:username/repository-name.git"
echo ""
echo "Note: You'll need to create this repository on GitHub first"
echo "      if you want to push immediately."
echo ""
read -p "Destination repository URL: " DEST_REPO

# Summary and confirmation
echo ""
echo "==================================="
echo "         CONFIRMATION              "
echo "==================================="
echo ""
echo "📋 Source:      $SOURCE_REPO"
echo "📁 Local:       $TARGET_DIR"
echo "🚀 Destination: $DEST_REPO"
echo ""
echo "==================================="
echo ""
read -p "Ready to proceed? (y/n): " CONFIRM

if [[ $CONFIRM != "y" && $CONFIRM != "Y" ]]; then
    echo ""
    echo "❌ Operation cancelled."
    exit 0
fi

# Execute the cloning workflow
echo ""
echo "==================================="
echo "       STARTING SETUP              "
echo "==================================="
echo ""

# Step 1: Clone the source repository
echo "📥 Step 1/4: Cloning source repository..."
git clone "$SOURCE_REPO" "$TARGET_DIR"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Error: Failed to clone source repository"
    echo "   Please check the repository URL and your access permissions."
    exit 1
fi

# Step 2: Remove git history
cd "$TARGET_DIR"
echo "🧹 Step 2/4: Removing git history..."
rm -rf .git

# Step 3: Initialize new repository
echo "🎉 Step 3/4: Initializing fresh repository..."
git init
git add .

# Extract repository name from destination URL for commit message
REPO_NAME=$(basename "$DEST_REPO" .git)
git commit -m "Initial commit from template: $(basename "$SOURCE_REPO" .git)"

# Step 4: Set up remote and attempt push
echo "🚀 Step 4/4: Configuring remote repository..."
git remote add origin "$DEST_REPO"
git branch -M main

echo ""
echo "Attempting to push to remote repository..."
git push -u origin main

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Warning: Push failed!"
    echo ""
    echo "This usually means one of the following:"
    echo "  1. The repository doesn't exist on GitHub yet"
    echo "  2. You don't have push permissions"
    echo "  3. Authentication is required"
    echo ""
    echo "The local repository has been set up successfully."
    echo "To push later, run:"
    echo "  cd $TARGET_DIR"
    echo "  git push -u origin main"
else
    echo ""
    echo "✅ Success! Repository cloned and pushed!"
fi

# Final summary
echo ""
echo "==================================="
echo "         SETUP COMPLETE!           "
echo "==================================="
echo ""
echo "📁 Project location: $TARGET_DIR"
echo "🔗 Repository: $DEST_REPO"
echo ""
echo "==================================="
echo "         NEXT STEPS                "
echo "==================================="
echo ""
echo "1. Navigate to project:"
echo "   cd $TARGET_DIR"
echo ""
echo "2. Install dependencies (if applicable):"
echo "   npm install    # or"
echo "   pnpm install   # or"
echo "   yarn install"
echo ""
echo "3. Set up environment variables (if needed):"
echo "   cp .env.example .env.local"
echo ""
echo "4. Start developing!"
echo ""
echo "==================================="
echo "Happy coding! 🚀"
echo "==================================="

