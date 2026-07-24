import React from 'react';
import { ComponentBaseProps, SemanticVariant, Size } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import styles from './Badge.module.css';

export interface BadgeProps extends ComponentBaseProps {
  variant?: SemanticVariant;
  size?: Size;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
  ...props
}) => {
  return (
    <span
      className={classNames(
        styles.badge,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
};
