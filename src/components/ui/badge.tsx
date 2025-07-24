import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  style?: 'solid' | 'outline' | 'soft';
  size?: 'small' | 'default' | 'large';
  interactive?: boolean;
  dot?: boolean;
  pulse?: boolean;
  number?: boolean;
  icon?: React.ReactNode;
  onClose?: () => void;
  children: React.ReactNode;
}

export interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    variant = 'default', 
    style = 'solid',
    size = 'default', 
    interactive = false,
    dot = false,
    pulse = false,
    number = false,
    icon,
    onClose,
    className, 
    children,
    onClick,
    ...props 
  }, ref) => {
    // Determine the style class
    const getVariantClass = () => {
      if (style === 'outline') {
        return styles[`${variant}Outline`];
      }
      if (style === 'soft') {
        return styles[`${variant}Soft`];
      }
      return styles[variant];
    };

    // Combine CSS classes
    const badgeClasses = [
      styles.badge,
      getVariantClass(),
      size !== 'default' && styles[size],
      interactive && styles.interactive,
      dot && styles.dot,
      pulse && styles.pulse,
      number && styles.number,
      icon && styles.withIcon,
      onClose && styles.withClose,
      className
    ].filter(Boolean).join(' ');

    const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (interactive && onClick) {
        onClick(e);
      }
    };

    return (
      <span
        ref={ref}
        className={badgeClasses}
        onClick={handleClick}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {icon && (
          <span className={styles.icon}>
            {icon}
          </span>
        )}
        {children}
        {onClose && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Remove"
          >
            <svg 
              viewBox="0 0 12 12" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M9 3L3 9M3 3L9 9" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

const BadgeGroup = React.forwardRef<HTMLDivElement, BadgeGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={[styles.group, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
);

BadgeGroup.displayName = 'BadgeGroup';

export { Badge, BadgeGroup };