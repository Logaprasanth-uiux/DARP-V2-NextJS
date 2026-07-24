import React from 'react';
import { ComponentBaseProps, Size } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import styles from './Icon.module.css';

export interface IconProps extends ComponentBaseProps {
  size?: Size | 'xl';
  label?: string;
}

export const Icon: React.FC<IconProps> = ({
  children,
  size = 'md',
  label,
  className,
  ...props
}) => {
  return (
    <span
      className={classNames(styles.icon, styles[size], className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={!label}
      {...props}
    >
      {children}
    </span>
  );
};
