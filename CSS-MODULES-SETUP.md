# CSS Modules & Stylelint Configuration

## Overview
This project uses CSS Modules for component-scoped styling with global design tokens managed in `src/app/globals.css`.

## Architecture

### Global Design System
- **Location**: `src/app/globals.css`
- **Purpose**: CSS custom properties (variables), global utilities, base styles
- **Import**: Automatically loaded via Next.js `layout.tsx`

### Component Styles
- **Location**: `src/components/**/*.module.css`
- **Purpose**: Component-scoped styles using local class names
- **Variables**: Access global CSS variables using `var(--variable-name)`

## CSS Modules Rules

### ✅ Allowed in CSS Modules
```css
/* Local classes */
.button { }
.cardContainer { }

/* Global variables usage */
.component {
  color: var(--color-primary);
  padding: var(--spacing-md);
}

/* Pseudo-classes and pseudo-elements */
.button:hover { }
.input:focus { }
.card::before { }

/* Media queries */
@media (min-width: 768px) {
  .container { }
}
```

### ❌ Prohibited in CSS Modules
```css
/* Global selectors */
:root { } /* Use globals.css instead */
html { }
body { }
* { }

/* Global animations */
@keyframes fadeIn { } /* Use globals.css instead */

/* Tag selectors without local scope */
div { } /* Use .localClass instead */
```

## Stylelint Configuration

### Custom Rules
- **`custom/no-root-in-modules`**: Prevents `:root` and other global selectors in CSS Modules

### Setup Instructions
1. Install Stylelint dependencies:
   ```bash
   npm install --save-dev stylelint stylelint-config-standard
   ```

2. Run CSS linting:
   ```bash
   npm run lint:css
   ```

### Configuration Files
- **`.stylelintrc.json`**: Main Stylelint configuration
- **`stylelint-rules/no-root-in-modules.js`**: Custom rule to enforce CSS Modules best practices

## Design Token Usage

### Accessing Global Variables
```css
/* In any .module.css file */
.myComponent {
  background: var(--glass-white-95);
  box-shadow: var(--shadow-enterprise);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}
```

### Available Token Categories
- **Colors**: `--color-primary`, `--color-error`, etc.
- **Spacing**: `--spacing-xs` to `--spacing-3xl`
- **Shadows**: `--shadow-enterprise`, `--shadow-floating`
- **Glass Effects**: `--glass-white-95`, `--glass-border`
- **Typography**: `--font-size-sm`, `--font-weight-medium`
- **Animations**: `--transition-fast`, `--ease-out`

## Migration Notes

### Previous Issues (Fixed)
- CSS Modules files were incorrectly importing `design-tokens.module.css` with `:root` selectors
- This caused "Selector ':root' is not pure" errors
- **Solution**: Consolidated all design tokens in `globals.css`

### Breaking Changes
- Updated primary color from `#2563eb` to `#0066ff`
- Adjusted spacing scale (e.g., `--spacing-md` changed from 16px to 12px)
- Enhanced shadow system with more sophisticated layering

## Best Practices

1. **Global First**: Define design tokens in `globals.css`
2. **Local Scope**: Use `.module.css` for component-specific styles
3. **CamelCase**: Name CSS Module classes using camelCase
4. **No Globals**: Avoid global selectors in CSS Modules
5. **Consistent Variables**: Always use design tokens for colors, spacing, etc.

## Troubleshooting

### Common Errors
- **"Selector ':root' is not pure"**: Move CSS custom properties to `globals.css`
- **Variables undefined**: Ensure `globals.css` is imported in `layout.tsx`
- **Styles not applied**: Check class name import/export in TypeScript

### Validation
Run `npm run lint:css` to check for CSS Modules violations before deployment.