import React from 'react';
import { ComponentBaseProps } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import { SectionHeading, SecondaryText } from '../Typography/Typography';
import styles from './EmptyState.module.css';

export interface EmptyStateProps extends ComponentBaseProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  ...props
}) => {
  return (
    <div className={classNames(styles.emptyState, className)} {...props}>
      {icon && <div className={styles.iconContainer}>{icon}</div>}
      <SectionHeading className={styles.title}>{title}</SectionHeading>
      {description && <SecondaryText className={styles.description}>{description}</SecondaryText>}
      {action && <div className={styles.actionContainer}>{action}</div>}
    </div>
  );
};
