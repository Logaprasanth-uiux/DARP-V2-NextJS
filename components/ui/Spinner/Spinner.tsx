import React from 'react';
import { ComponentBaseProps, Size } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import styles from './Spinner.module.css';

export interface SpinnerProps extends ComponentBaseProps {
  size?: Size;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  className,
  ...props
}) => {
  return (
    <span
      className={classNames(styles.spinner, styles[size], className)}
      role="status"
      aria-label={label}
      {...props}
    >
      <svg className={styles.svg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className={styles.track} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className={styles.head} d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
};
