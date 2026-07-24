import React from 'react';
import { ComponentBaseProps } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import { Label } from '../Typography/Typography';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, ComponentBaseProps {
  label?: string;
  options?: SelectOption[];
  helperText?: string;
  error?: string;
  required?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options = [],
  helperText,
  error,
  required,
  className,
  id,
  disabled,
  children,
  ...props
}, ref) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={classNames(styles.wrapper, className)}>
      {label && (
        <Label htmlFor={selectId} required={required}>
          {label}
        </Label>
      )}
      <div className={styles.selectContainer}>
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={classNames(
            styles.select,
            error && styles.hasError,
            disabled && styles.disabled
          )}
          aria-invalid={Boolean(error)}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          ▼
        </span>
      </div>
      {error ? (
        <span className={styles.errorText}>{error}</span>
      ) : helperText ? (
        <span className={styles.helperText}>{helperText}</span>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
