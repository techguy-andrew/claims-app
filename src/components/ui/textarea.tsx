import React from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'small' | 'default' | 'large';
  state?: 'default' | 'error' | 'success';
  fullWidth?: boolean;
  resize?: 'vertical' | 'horizontal' | 'both' | 'none';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    size = 'default', 
    state = 'default', 
    fullWidth = false, 
    resize = 'vertical',
    className, 
    ...props 
  }, ref) => {
    // Combine CSS classes
    const textareaClasses = [
      styles.textarea,
      size !== 'default' && styles[size],
      state !== 'default' && styles[state],
      fullWidth && styles.fullWidth,
      resize === 'none' && styles.noResize,
      resize === 'horizontal' && styles.resizeHorizontal,
      resize === 'both' && styles.resizeBoth,
      className
    ].filter(Boolean).join(' ');

    return (
      <textarea
        ref={ref}
        className={textareaClasses}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };