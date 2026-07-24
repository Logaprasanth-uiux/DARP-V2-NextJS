import React from 'react';
import { ComponentBaseProps } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import styles from './Typography.module.css';

export interface TypographyProps extends ComponentBaseProps {
  as?: React.ElementType;
}

export const Display: React.FC<TypographyProps> = ({ children, as: Component = 'h1', className, ...props }) => (
  <Component className={classNames(styles.display, className)} {...props}>{children}</Component>
);

export const PageTitle: React.FC<TypographyProps> = ({ children, as: Component = 'h1', className, ...props }) => (
  <Component className={classNames(styles.pageTitle, className)} {...props}>{children}</Component>
);

export const SectionHeading: React.FC<TypographyProps> = ({ children, as: Component = 'h2', className, ...props }) => (
  <Component className={classNames(styles.sectionHeading, className)} {...props}>{children}</Component>
);

export const CardTitle: React.FC<TypographyProps> = ({ children, as: Component = 'h3', className, ...props }) => (
  <Component className={classNames(styles.cardTitle, className)} {...props}>{children}</Component>
);

export const Body: React.FC<TypographyProps> = ({ children, as: Component = 'p', className, ...props }) => (
  <Component className={classNames(styles.body, className)} {...props}>{children}</Component>
);

export const SecondaryText: React.FC<TypographyProps> = ({ children, as: Component = 'span', className, ...props }) => (
  <Component className={classNames(styles.secondaryText, className)} {...props}>{children}</Component>
);

export const Caption: React.FC<TypographyProps> = ({ children, as: Component = 'span', className, ...props }) => (
  <Component className={classNames(styles.caption, className)} {...props}>{children}</Component>
);

export interface LabelProps extends TypographyProps {
  htmlFor?: string;
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ children, htmlFor, required, className, ...props }) => (
  <label htmlFor={htmlFor} className={classNames(styles.label, className)} {...props}>
    {children}
    {required && <span className={styles.requiredIndicator}> *</span>}
  </label>
);
