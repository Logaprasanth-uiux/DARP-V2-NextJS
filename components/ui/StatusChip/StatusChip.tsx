import React from 'react';
import { ComponentBaseProps, SemanticVariant, Size } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import styles from './StatusChip.module.css';

export interface StatusChipProps extends ComponentBaseProps {
  variant?: SemanticVariant;
  size?: Size;
  label: string;
  dot?: boolean;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  dot = true,
  className,
  ...props
}) => {
  return (
    <span
      className={classNames(
        styles.chip,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      <span className={styles.label}>{label}</span>
    </span>
  );
};
