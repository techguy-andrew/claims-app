// ============================================================================
// CORE COMPONENTS EXPORT - Foundation of the Design System
// ============================================================================

// InvisibleInput - Professional contentEditable system
export {
  InvisibleInput,
  InvisibleTextInput,
  InvisibleTextArea,
  InvisibleTitle,
  InvisibleDescription
} from './InvisibleInput'

export type { InvisibleInputProps } from './InvisibleInput'

// FloatingContextMenu - Universal menu system
export {
  FloatingContextMenu,
  useFloatingMenu,
  MenuProvider,
  useMenuContext,
  MenuTrigger
} from './FloatingContextMenu'

export type {
  MenuPosition,
  MenuItem,
  FloatingContextMenuProps,
  UseFloatingMenuOptions,
  MenuTriggerProps
} from './FloatingContextMenu'

// Hooks - SSR-safe utilities  
export { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

// Design tokens - CSS custom properties (import in CSS files)
// import '../core/design-tokens.module.css'