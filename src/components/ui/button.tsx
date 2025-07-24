import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'small' | 'default' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  asChild?: boolean;
}

export interface ButtonAsLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'small' | 'default' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  asChild: true;
}

type ButtonComponentProps = ButtonProps | ButtonAsLinkProps;

function isLinkProps(props: ButtonComponentProps): props is ButtonAsLinkProps {
  return 'asChild' in props && props.asChild === true;
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonComponentProps>(
  ({ variant = 'primary', size = 'default', loading = false, fullWidth = false, className, children, ...props }, ref) => {
    // Combine CSS classes
    const classes = [
      styles.button,
      styles[variant],
      size !== 'default' && styles[size],
      loading && styles.loading,
      fullWidth && styles.fullWidth,
      className
    ].filter(Boolean).join(' ');

    if (isLinkProps(props)) {
      const { asChild, ...linkProps } = props;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...linkProps}
        >
          {children}
        </a>
      );
    }

    const { asChild, ...buttonProps } = props as ButtonProps;
    
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={loading || buttonProps.disabled}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };