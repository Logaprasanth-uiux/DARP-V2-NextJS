import React from 'react';
import { ComponentBaseProps } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import styles from './Card.module.css';

export interface CardProps extends ComponentBaseProps {
  elevated?: boolean;
}

export const CardHeader: React.FC<ComponentBaseProps> = ({ children, className }) => (
  <div className={classNames(styles.header, className)}>{children}</div>
);

export const CardContent: React.FC<ComponentBaseProps> = ({ children, className }) => (
  <div className={classNames(styles.content, className)}>{children}</div>
);

export const CardFooter: React.FC<ComponentBaseProps> = ({ children, className }) => (
  <div className={classNames(styles.footer, className)}>{children}</div>
);

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  className,
  ...props
}) => {
  return (
    <div
      className={classNames(
        styles.card,
        elevated && styles.elevated,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
