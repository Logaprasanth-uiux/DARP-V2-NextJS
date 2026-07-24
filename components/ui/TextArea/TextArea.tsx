import React from 'react';
import { ComponentBaseProps } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import { Label } from '../Typography/Typography';
import styles from './TextArea.module.css';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, ComponentBaseProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  helperText,
  error,
  required,
  className,
  id,
  disabled,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={classNames(styles.wrapper, className)}>
      {label && (
        <Label htmlFor={textareaId} required={required}>
          {label}
        </Label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        disabled={disabled}
        rows={rows}
        className={classNames(
          styles.textarea,
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

TextArea.displayName = 'TextArea';
