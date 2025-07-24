import React from 'react';
import styles from './Label.module.css';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  size?: 'small' | 'default' | 'large';
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  children: React.ReactNode;
}

export interface FieldProps {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  size?: 'small' | 'default' | 'large';
  children: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ 
    size = 'default', 
    required = false, 
    disabled = false, 
    error = false,
    className, 
    children,
    ...props 
  }, ref) => {
    // Combine CSS classes
    const labelClasses = [
      styles.label,
      size !== 'default' && styles[size],
      required && styles.required,
      disabled && styles.disabled,
      error && styles.error,
      className
    ].filter(Boolean).join(' ');

    return (
      <label
        ref={ref}
        className={labelClasses}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = 'Label';

// Field component for complete form field with label and helper text
const Field: React.FC<FieldProps> = ({ 
  label, 
  required = false, 
  disabled = false, 
  error, 
  helperText, 
  size = 'default',
  children 
}) => {
  const hasError = Boolean(error);
  const hasSuccess = !hasError && helperText && !disabled;

  return (
    <div className={styles.fieldContainer}>
      {label && (
        <Label 
          size={size} 
          required={required} 
          disabled={disabled} 
          error={hasError}
        >
          {label}
        </Label>
      )}
      {children}
      {(error || helperText) && (
        <span 
          className={[
            styles.helperText,
            hasError && styles.error,
            hasSuccess && styles.success
          ].filter(Boolean).join(' ')}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export { Label, Field };