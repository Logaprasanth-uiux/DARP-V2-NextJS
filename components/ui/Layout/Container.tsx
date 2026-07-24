import React from 'react';
import { ComponentBaseProps } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import styles from './Container.module.css';

export interface ContainerProps extends ComponentBaseProps {
  fluid?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  fluid = false,
  className,
  ...props
}) => {
  return (
    <div
      className={classNames(
        styles.container,
        fluid ? styles.fluid : styles.fixed,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
