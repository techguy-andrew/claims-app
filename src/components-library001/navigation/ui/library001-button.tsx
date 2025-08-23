import React from 'react';
import styles from './library001-button.module.css';

export interface Library001ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'modern' | 'floating';
  size?: 'small' | 'default' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  asChild?: boolean;
}

const Library001Button = React.forwardRef<HTMLButtonElement, Library001ButtonProps>(
  ({ variant = 'primary', size = 'default', loading = false, fullWidth = false, className, children, asChild, ...props }, ref) => {
    // Combine CSS classes
    const classes = [
      styles.button,
      styles[variant],
      size !== 'default' && styles[size],
      loading && styles.loading,
      fullWidth && styles.fullWidth,
      className
    ].filter(Boolean).join(' ');

    if (asChild) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={loading || props.disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Library001Button.displayName = 'Library001Button';

export { Library001Button };

// Export default for convenience
export default Library001Button;