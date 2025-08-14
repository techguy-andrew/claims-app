# CSS Token Conflict Analysis & Resolution

## Overview
Analysis of conflicting CSS custom properties between `globals.css` and `design-tokens.module.css` before consolidation.

## Critical Conflicts (Breaking Changes)

### 1. Primary Color System
| Token | globals.css | design-tokens.module.css | **Resolution** |
|-------|-------------|---------------------------|----------------|
| `--color-primary` | `#2563eb` (blue-600) | `#0066ff` (bright blue) | **Use newer `#0066ff`** - more vibrant, modern |
| `--color-primary-hover` | `#1d4ed8` | N/A | **Keep from globals.css** |
| `--color-primary-dark` | N/A | `#0052cc` | **Add from design-tokens** |
| `--color-primary-darker` | N/A | `#003d99` | **Add from design-tokens** |

### 2. Spacing System
| Token | globals.css | design-tokens.module.css | **Resolution** |
|-------|-------------|---------------------------|----------------|
| `--spacing-xs` | `0.25rem` (4px) | `0.25rem` (4px) | ✅ **No conflict** |
| `--spacing-sm` | `0.5rem` (8px) | `0.5rem` (8px) | ✅ **No conflict** |
| `--spacing-md` | `1rem` (16px) | `0.75rem` (12px) | ⚠️ **Use design-tokens `0.75rem`** |
| `--spacing-lg` | `1.5rem` (24px) | `1rem` (16px) | ⚠️ **Use design-tokens `1rem`** |
| `--spacing-xl` | `2rem` (32px) | `1.5rem` (24px) | ⚠️ **Use design-tokens `1.5rem`** |
| `--spacing-2xl` | `3rem` (48px) | `2rem` (32px) | ⚠️ **Use design-tokens `2rem`** |

### 3. Shadow System (Major Enhancement)
| Token | globals.css | design-tokens.module.css | **Resolution** |
|-------|-------------|---------------------------|----------------|
| `--shadow-enterprise` | Simple: `0 8px 30px rgb(0 0 0 / 0.06)` | Complex layered system | **Use design-tokens** - more sophisticated |
| `--shadow-enterprise-hover` | `0 8px 40px rgb(0 0 0 / 0.12)` | Multi-layer with inset | **Use design-tokens** - better depth |
| `--shadow-floating` | N/A | Blue-tinted floating shadows | **Add from design-tokens** |
| `--shadow-floating-hover` | N/A | Enhanced floating shadows | **Add from design-tokens** |

## New Additions (No Conflicts)

### Glass Morphism System (design-tokens only)
```css
--glass-white-95: rgba(255, 255, 255, 0.95);
--glass-white-90: rgba(255, 255, 255, 0.90);
--glass-white-80: rgba(255, 255, 255, 0.80);
--glass-white-70: rgba(255, 255, 255, 0.70);
--glass-border: rgba(229, 231, 235, 0.8);
--glass-border-hover: rgba(156, 163, 175, 0.6);
--glass-border-active: rgba(99, 102, 241, 0.4);
```

### Advanced Backdrop Blur (design-tokens only)
```css
--backdrop-blur-sm: blur(8px) saturate(1.05);
--backdrop-blur-md: blur(12px) saturate(1.1);
--backdrop-blur-lg: blur(16px) saturate(1.15);
```

### Enhanced Animation System (design-tokens only)
```css
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

### Professional Touch Targets (design-tokens only)
```css
--touch-target-min: 44px;
--touch-target-small: 40px;
--touch-target-large: 52px;
--mobile-padding: 12px 20px;
--desktop-padding: 8px 16px;
```

### Z-Index Layer System (design-tokens only)
```css
--z-base: 0;
--z-dropdown: 10;
--z-sticky: 20;
--z-fixed: 30;
--z-modal-backdrop: 40;
--z-modal: 50;
--z-popover: 60;
--z-tooltip: 70;
--z-toast: 80;
--z-maximum: 9999;
```

## Migration Impact Assessment

### High Risk Components
1. **Button components** - Primary color change affects all buttons
2. **Card components** - Spacing and shadow changes may affect layout
3. **Modal components** - Z-index and backdrop changes

### Medium Risk Components
1. **Form components** - Spacing adjustments may affect form layouts
2. **Toast components** - New z-index system

### Low Risk Components
1. **PDF/Image modals** - Mostly benefit from enhancements
2. **FloatingContextMenu** - Enhanced with better glass effects

## Rollback Strategy
- Git commit each component update separately
- Keep screenshots of before/after states
- Document any visual differences for stakeholder review

## Post-Migration Validation
- [ ] Visual regression testing on all 9 affected components
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile responsiveness verification
- [ ] Accessibility contrast ratio validation with new colors

## Performance Notes
- Design tokens system is more comprehensive but uses same CSS custom properties
- No performance impact expected
- Enhanced blur effects may require GPU acceleration testing

---
**Next Steps:** Take component screenshots → Consolidate tokens → Remove imports → Verify