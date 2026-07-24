import React from 'react';
import { ComponentBaseProps } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import styles from './Divider.module.css';

export interface DividerProps extends ComponentBaseProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  spacing = 'md',
  className,
  ...props
}) => {
  return (
    <hr
      className={classNames(
        styles.divider,
        styles[orientation],
        styles[`spacing-${spacing}`],
        className
      )}
      aria-orientation={orientation}
      {...props}
    />
  );
};
