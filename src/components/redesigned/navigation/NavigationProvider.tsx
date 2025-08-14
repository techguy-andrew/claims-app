'use client'

import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useCallback, 
  useMemo,
  ReactNode
} from 'react'
import { usePathname } from 'next/navigation'
import { useIsomorphicLayoutEffect } from '../core/useIsomorphicLayoutEffect'
import { NavigationItem } from './Sidebar'

// ============================================================================
// TYPES & INTERFACES - Advanced TypeScript 5 patterns
// ============================================================================

interface NavigationState {
  isOpen: boolean
  isMobile: boolean
  variant: 'overlay' | 'push' | 'static'
  size: 'sm' | 'md' | 'lg'
  theme: 'light' | 'dark' | 'auto'
  collapsible: boolean
  isCollapsed: boolean
  expandedItems: Set<string>
  activeItem: string | null
  items: NavigationItem[]
  breakpoint: number
}

type NavigationAction = 
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'OPEN_SIDEBAR' }
  | { type: 'CLOSE_SIDEBAR' }
  | { type: 'SET_MOBILE'; payload: boolean }
  | { type: 'SET_VARIANT'; payload: NavigationState['variant'] }
  | { type: 'SET_SIZE'; payload: NavigationState['size'] }
  | { type: 'SET_THEME'; payload: NavigationState['theme'] }
  | { type: 'TOGGLE_COLLAPSED' }
  | { type: 'SET_COLLAPSED'; payload: boolean }
  | { type: 'TOGGLE_ITEM'; payload: string }
  | { type: 'EXPAND_ITEM'; payload: string }
  | { type: 'COLLAPSE_ITEM'; payload: string }
  | { type: 'SET_ACTIVE_ITEM'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: NavigationItem[] }
  | { type: 'RESET_STATE' }

interface NavigationContextType {
  state: NavigationState
  actions: {
    toggle: () => void
    open: () => void
    close: () => void
    setMobile: (isMobile: boolean) => void
    setVariant: (variant: NavigationState['variant']) => void
    setSize: (size: NavigationState['size']) => void
    setTheme: (theme: NavigationState['theme']) => void
    toggleCollapsed: () => void
    setCollapsed: (collapsed: boolean) => void
    toggleItem: (id: string) => void
    expandItem: (id: string) => void
    collapseItem: (id: string) => void
    setActiveItem: (id: string | null) => void
    setItems: (items: NavigationItem[]) => void
    reset: () => void
    navigate: (item: NavigationItem) => void
  }
  utils: {
    isItemActive: (item: NavigationItem) => boolean
    isItemExpanded: (id: string) => boolean
    getActiveItem: () => NavigationItem | null
    findItemById: (id: string) => NavigationItem | null
    findItemByHref: (href: string) => NavigationItem | null
  }
}

interface NavigationProviderProps {
  children: ReactNode
  defaultItems?: NavigationItem[]
  defaultOpen?: boolean
  defaultVariant?: NavigationState['variant']
  defaultSize?: NavigationState['size']
  defaultTheme?: NavigationState['theme']
  defaultCollapsible?: boolean
  defaultCollapsed?: boolean
  breakpoint?: number
  onNavigate?: (item: NavigationItem) => void
}

// ============================================================================
// INITIAL STATE & REDUCER
// ============================================================================

const createInitialState = (props: Partial<NavigationProviderProps> = {}): NavigationState => ({
  isOpen: props.defaultOpen ?? false,
  isMobile: false,
  variant: props.defaultVariant ?? 'overlay',
  size: props.defaultSize ?? 'md',
  theme: props.defaultTheme ?? 'light',
  collapsible: props.defaultCollapsible ?? true,
  isCollapsed: props.defaultCollapsed ?? false,
  expandedItems: new Set<string>(),
  activeItem: null,
  items: props.defaultItems ?? [],
  breakpoint: props.breakpoint ?? 768
})

const navigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, isOpen: !state.isOpen }
      
    case 'OPEN_SIDEBAR':
      return { ...state, isOpen: true }
      
    case 'CLOSE_SIDEBAR':
      return { ...state, isOpen: false }
      
    case 'SET_MOBILE':
      return { 
        ...state, 
        isMobile: action.payload,
        variant: action.payload ? 'overlay' : state.variant,
        isOpen: action.payload ? false : state.isOpen
      }
      
    case 'SET_VARIANT':
      return { ...state, variant: action.payload }
      
    case 'SET_SIZE':
      return { ...state, size: action.payload }
      
    case 'SET_THEME':
      return { ...state, theme: action.payload }
      
    case 'TOGGLE_COLLAPSED':
      return { ...state, isCollapsed: !state.isCollapsed }
      
    case 'SET_COLLAPSED':
      return { ...state, isCollapsed: action.payload }
      
    case 'TOGGLE_ITEM': {
      const newExpandedItems = new Set(state.expandedItems)
      if (newExpandedItems.has(action.payload)) {
        newExpandedItems.delete(action.payload)
      } else {
        newExpandedItems.add(action.payload)
      }
      return { ...state, expandedItems: newExpandedItems }
    }
    
    case 'EXPAND_ITEM': {
      const newExpandedItems = new Set(state.expandedItems)
      newExpandedItems.add(action.payload)
      return { ...state, expandedItems: newExpandedItems }
    }
    
    case 'COLLAPSE_ITEM': {
      const newExpandedItems = new Set(state.expandedItems)
      newExpandedItems.delete(action.payload)
      return { ...state, expandedItems: newExpandedItems }
    }
    
    case 'SET_ACTIVE_ITEM':
      return { ...state, activeItem: action.payload }
      
    case 'SET_ITEMS':
      return { ...state, items: action.payload }
      
    case 'RESET_STATE':
      return createInitialState()
      
    default:
      return state
  }
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const NavigationContext = createContext<NavigationContextType | null>(null)

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  defaultItems = [],
  defaultOpen = false,
  defaultVariant = 'overlay',
  defaultSize = 'md',
  defaultTheme = 'light',
  defaultCollapsible = true,
  defaultCollapsed = false,
  breakpoint = 768,
  onNavigate
}) => {
  const pathname = usePathname()
  
  // Initialize state with props
  const [state, dispatch] = useReducer(
    navigationReducer,
    {
      defaultItems,
      defaultOpen,
      defaultVariant,
      defaultSize,
      defaultTheme,
      defaultCollapsible,
      defaultCollapsed,
      breakpoint
    },
    createInitialState
  )

  // ============================================================================
  // ACTION CREATORS - Memoized for performance
  // ============================================================================

  const actions = useMemo(() => ({
    toggle: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    open: () => dispatch({ type: 'OPEN_SIDEBAR' }),
    close: () => dispatch({ type: 'CLOSE_SIDEBAR' }),
    setMobile: (isMobile: boolean) => dispatch({ type: 'SET_MOBILE', payload: isMobile }),
    setVariant: (variant: NavigationState['variant']) => dispatch({ type: 'SET_VARIANT', payload: variant }),
    setSize: (size: NavigationState['size']) => dispatch({ type: 'SET_SIZE', payload: size }),
    setTheme: (theme: NavigationState['theme']) => dispatch({ type: 'SET_THEME', payload: theme }),
    toggleCollapsed: () => dispatch({ type: 'TOGGLE_COLLAPSED' }),
    setCollapsed: (collapsed: boolean) => dispatch({ type: 'SET_COLLAPSED', payload: collapsed }),
    toggleItem: (id: string) => dispatch({ type: 'TOGGLE_ITEM', payload: id }),
    expandItem: (id: string) => dispatch({ type: 'EXPAND_ITEM', payload: id }),
    collapseItem: (id: string) => dispatch({ type: 'COLLAPSE_ITEM', payload: id }),
    setActiveItem: (id: string | null) => dispatch({ type: 'SET_ACTIVE_ITEM', payload: id }),
    setItems: (items: NavigationItem[]) => dispatch({ type: 'SET_ITEMS', payload: items }),
    reset: () => dispatch({ type: 'RESET_STATE' }),
    navigate: (item: NavigationItem) => {
      dispatch({ type: 'SET_ACTIVE_ITEM', payload: item.id })
      onNavigate?.(item)
      if (state.isMobile && state.variant === 'overlay') {
        dispatch({ type: 'CLOSE_SIDEBAR' })
      }
    }
  }), [onNavigate, state.isMobile, state.variant])

  // ============================================================================
  // UTILITY FUNCTIONS - Memoized for performance
  // ============================================================================

  const utils = useMemo(() => {
    const findItemRecursive = (items: NavigationItem[], predicate: (item: NavigationItem) => boolean): NavigationItem | null => {
      for (const item of items) {
        if (predicate(item)) return item
        if (item.children) {
          const found = findItemRecursive(item.children, predicate)
          if (found) return found
        }
      }
      return null
    }

    return {
      isItemActive: (item: NavigationItem): boolean => {
        if (item.href && pathname === item.href) return true
        if (item.children) {
          return item.children.some(child => utils.isItemActive(child))
        }
        return false
      },
      
      isItemExpanded: (id: string): boolean => state.expandedItems.has(id),
      
      getActiveItem: (): NavigationItem | null => {
        return state.activeItem ? utils.findItemById(state.activeItem) : null
      },
      
      findItemById: (id: string): NavigationItem | null => {
        return findItemRecursive(state.items, item => item.id === id)
      },
      
      findItemByHref: (href: string): NavigationItem | null => {
        return findItemRecursive(state.items, item => item.href === href)
      }
    }
  }, [pathname, state.expandedItems, state.activeItem, state.items])

  // ============================================================================
  // SIDE EFFECTS
  // ============================================================================

  // Handle responsive behavior
  useIsomorphicLayoutEffect(() => {
    const checkIsMobile = () => {
      const isMobile = window.innerWidth < state.breakpoint
      if (isMobile !== state.isMobile) {
        actions.setMobile(isMobile)
      }
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [state.breakpoint, state.isMobile, actions])

  // Auto-detect active item based on pathname
  useIsomorphicLayoutEffect(() => {
    const activeItem = utils.findItemByHref(pathname)
    if (activeItem && activeItem.id !== state.activeItem) {
      dispatch({ type: 'SET_ACTIVE_ITEM', payload: activeItem.id })
      
      // Auto-expand parent items of active item
      const expandParents = (items: NavigationItem[], targetId: string, parents: string[] = []): boolean => {
        for (const item of items) {
          const currentPath = [...parents, item.id]
          if (item.id === targetId) {
            // Expand all parents
            parents.forEach(parentId => {
              dispatch({ type: 'EXPAND_ITEM', payload: parentId })
            })
            return true
          }
          if (item.children && expandParents(item.children, targetId, currentPath)) {
            return true
          }
        }
        return false
      }

      expandParents(state.items, activeItem.id)
    }
  }, [pathname, state.items, state.activeItem, utils])

  // Auto-detect theme based on system preference
  useIsomorphicLayoutEffect(() => {
    if (state.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        // This would trigger theme changes in a real implementation
        // For now, we'll just keep track of the preference
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [state.theme])

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue = useMemo(() => ({
    state,
    actions,
    utils
  }), [state, actions, utils])

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}

// ============================================================================
// HOOK FOR CONSUMING CONTEXT
// ============================================================================

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

export const useNavigationState = () => useNavigation().state
export const useNavigationActions = () => useNavigation().actions
export const useNavigationUtils = () => useNavigation().utils

export default NavigationProvider