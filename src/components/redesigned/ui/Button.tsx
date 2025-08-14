import React from 'react'
import { LucideIcon } from 'lucide-react'
import styles from './Button.module.css'

// ============================================================================
// TYPES
// ============================================================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'modern' | 'floating' | 'destructive' | 'ghost'
  size?: 'small' | 'default' | 'large'
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
  asChild?: boolean
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
}

// ============================================================================
// BUTTON COMPONENT - Glass Morphism Design Language
// ============================================================================

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'default', 
    loading = false, 
    fullWidth = false, 
    className = '', 
    children, 
    asChild = false,
    icon: Icon,
    iconPosition = 'left',
    disabled,
    ...props 
  }, ref) => {
    
    // Combine CSS classes using the design system
    const combinedClassName = [
      styles.button,
      styles[variant],
      size !== 'default' && styles[size],
      loading && styles.loading,
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      className
    ].filter(Boolean).join(' ')

    // Handle asChild rendering for Next.js Link components
    if (asChild) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={combinedClassName}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {Icon && iconPosition === 'left' && (
            <Icon className={styles.icon} size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />
          )}
          <span className={styles.content}>{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className={styles.icon} size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />
          )}
        </a>
      )
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <div className={styles.loadingSpinner} />
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <Icon className={styles.icon} size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />
            )}
            <span className={styles.content}>{children}</span>
            {Icon && iconPosition === 'right' && (
              <Icon className={styles.icon} size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

// ============================================================================
// SPECIALIZED BUTTON VARIANTS
// ============================================================================

export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
)

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
)

export const ModernButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="modern" />
)

export const FloatingButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="floating" />
)

export const DestructiveButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="destructive" />
)

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="ghost" />
)

// ============================================================================
// ICON BUTTON VARIANT
// ============================================================================

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: LucideIcon
  'aria-label': string
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon: Icon, 
  size = 'default',
  className = '',
  ...props 
}) => {
  const iconSize = size === 'small' ? 14 : size === 'large' ? 20 : 16
  
  return (
    <Button
      {...props}
      className={`${styles.iconOnly} ${className}`}
      size={size}
    >
      <Icon size={iconSize} />
    </Button>
  )
}