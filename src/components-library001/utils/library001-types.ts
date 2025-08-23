// ============================================================================
// LIBRARY001 UTILITY TYPES
// ============================================================================

export type ClassValue = 
  | string 
  | number 
  | boolean 
  | undefined 
  | null 
  | ClassValue[] 
  | Record<string, boolean | undefined | null>