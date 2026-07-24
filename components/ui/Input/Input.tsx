import React from 'react';
import { ComponentBaseProps } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import { Label } from '../Typography/Typography';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, ComponentBaseProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  required,
  className,
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={classNames(styles.wrapper, className)}>
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}
      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        className={classNames(
          styles.input,
          error && styles.hasError,
          disabled && styles.disabled
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? (
        <span className={styles.errorText}>{error}</span>
      ) : helperText ? (
        <span className={styles.helperText}>{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
