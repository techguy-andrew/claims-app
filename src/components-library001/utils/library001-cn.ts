// ============================================================================
// LIBRARY001 CLASS NAME UTILITY
// ============================================================================

import { type ClassValue } from './library001-types'

/**
 * Combines class names with conditional logic
 * Similar to clsx but optimized for Library001 components
 */
export function library001Cn(...inputs: ClassValue[]): string {
  const classes: string[] = []
  
  for (const input of inputs) {
    if (!input) continue
    
    if (typeof input === 'string') {
      classes.push(input)
    } else if (Array.isArray(input)) {
      classes.push(library001Cn(...input))
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key)
      }
    }
  }
  
  return classes.filter(Boolean).join(' ')
}

/**
 * Merge default styles with custom className
 */
export function library001MergeStyles(
  defaultStyles: string,
  customClassName?: string
): string {
  return library001Cn(defaultStyles, customClassName)
}

// Export as default for convenience
export default library001Cn