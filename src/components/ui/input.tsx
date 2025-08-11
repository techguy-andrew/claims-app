import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'small' | 'default' | 'large';
  state?: 'default' | 'error' | 'success';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  mobileOptimized?: boolean;
  inlineEditing?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    size = 'default', 
    state = 'default', 
    fullWidth = false, 
    leftIcon, 
    rightIcon, 
    mobileOptimized = false,
    inlineEditing = false,
    className, 
    ...props 
  }, ref) => {
    // Combine CSS classes
    const inputClasses = [
      styles.input,
      size !== 'default' && styles[size],
      state !== 'default' && styles[state],
      fullWidth && styles.fullWidth,
      leftIcon && styles.withIcon,
      rightIcon && styles.withIconRight,
      mobileOptimized && styles.mobileOptimized,
      inlineEditing && styles.inlineEditing,
      className
    ].filter(Boolean).join(' ');

    if (leftIcon || rightIcon) {
      return (
        <div className={styles.inputContainer}>
          {leftIcon && (
            <div className={styles.iconLeft}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
          {rightIcon && (
            <div className={styles.iconRight}>
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={inputClasses}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };