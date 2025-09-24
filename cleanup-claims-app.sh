#!/bin/zsh
set -euo pipefail

# Claims App Cleanup Script - Safe Trash Folder Approach
# Moves unused files to timestamped trash folder for safe cleanup

ROOT="/Users/andrewbarron/Library/Mobile Documents/com~apple~CloudDocs/iCloud Documents/dev/projects/claims-app"
TRASH="$ROOT/.trash-$(date +%Y%m%d-%H%M%S)"

echo "🧹 Claims App Cleanup Script"
echo "📁 Root: $ROOT"
echo "🗑️  Trash: $TRASH"
echo ""

mkdir -p "$TRASH"

move() {
  local p="$1"
  if [ -e "$ROOT/$p" ]; then
    mkdir -p "$TRASH/$(dirname "$p")"
    # Try git mv first (preserves history), fallback to regular mv
    if git -C "$ROOT" mv "$p" "$TRASH/$p" 2>/dev/null; then
      echo "📦 git moved: $p"
    else
      mv "$ROOT/$p" "$TRASH/$p"
      echo "📦 moved: $p"
    fi
  else
    echo "⏭️  skip (not found): $p"
  fi
}

echo "🎯 Moving unused shadcn/ui components (19 of 26)..."

# Unused shadcn/ui components (keep: badge, button, card, dropdown-menu, sheet, toast, toaster)
move "src/components/ui/alert.tsx"
move "src/components/ui/aspect-ratio.tsx"
move "src/components/ui/avatar.tsx"
move "src/components/ui/checkbox.tsx"
move "src/components/ui/dialog.tsx"
move "src/components/ui/hover-card.tsx"
move "src/components/ui/input.tsx"
move "src/components/ui/label.tsx"
move "src/components/ui/navigation-menu.tsx"
move "src/components/ui/popover.tsx"
move "src/components/ui/radio-group.tsx"
move "src/components/ui/scroll-area.tsx"
move "src/components/ui/select.tsx"
move "src/components/ui/separator.tsx"
move "src/components/ui/skeleton.tsx"
move "src/components/ui/switch.tsx"
move "src/components/ui/tabs.tsx"
move "src/components/ui/textarea.tsx"
move "src/components/ui/tooltip.tsx"

echo ""
echo "🎯 Moving unused layout helpers..."

# Unused layout helpers (keep: Navigation, TopBar, MobileNav, Sidebar)
move "src/components/layouts/grid.tsx"
move "src/components/layouts/page-layout.tsx"
move "src/components/layouts/section.tsx"
move "src/components/layouts/stack.tsx"

echo ""
echo "🎯 Moving unused library files..."

# Unused lib files (keep: prisma, utils, navigation)
move "src/lib/constants.ts"
move "src/lib/validations.ts"

echo ""
echo "🎯 Moving demo/template directories..."

# Demo/template directories (if they exist)
if [ -d "$ROOT/src/app/framer-demo" ]; then
  mkdir -p "$TRASH/src/app"
  if git -C "$ROOT" mv "src/app/framer-demo" "$TRASH/src/app/framer-demo" 2>/dev/null; then
    echo "📦 git moved: src/app/framer-demo/"
  else
    mv "$ROOT/src/app/framer-demo" "$TRASH/src/app/framer-demo"
    echo "📦 moved: src/app/framer-demo/"
  fi
else
  echo "⏭️  skip (not found): src/app/framer-demo/"
fi

if [ -d "$ROOT/src/components/templates" ]; then
  mkdir -p "$TRASH/src/components"
  if git -C "$ROOT" mv "src/components/templates" "$TRASH/src/components/templates" 2>/dev/null; then
    echo "📦 git moved: src/components/templates/"
  else
    mv "$ROOT/src/components/templates" "$TRASH/src/components/templates"
    echo "📦 moved: src/components/templates/"
  fi
else
  echo "⏭️  skip (not found): src/components/templates/"
fi

echo ""
echo "🎯 Moving optional/deprecated files..."

# Optional repo helper
move "repo-cloner.sh"

# Note: Keeping middleware.ts.disabled as recommended for future Clerk usage

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Files moved to: $TRASH"
echo ""
echo "🔍 Next steps:"
echo "  1. cd $ROOT"
echo "  2. pnpm install"
echo "  3. pnpm type-check && pnpm lint && pnpm build"
echo "  4. Test core functionality:"
echo "     - / (dashboard)"
echo "     - /claims (claims list)"
echo "     - /claims/[id] (claim details)"
echo "     - Mobile navigation drawer"
echo "     - Toast notifications"
echo "  5. Check for unused imports:"
echo "     grep -r \"@/components/ui/\" src/ | grep -E \"(alert|aspect-ratio|avatar|checkbox|dialog|hover-card|input|label|navigation-menu|popover|radio-group|scroll-area|select|separator|skeleton|switch|tabs|textarea|tooltip)\""
echo "  6. If all good, commit changes"
echo "  7. Delete trash folder: rm -rf $TRASH"
echo ""
echo "🔄 To rollback: mv $TRASH/* $ROOT/ (and handle conflicts)"