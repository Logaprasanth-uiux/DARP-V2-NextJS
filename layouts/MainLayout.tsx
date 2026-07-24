import React from 'react';
import { ComponentBaseProps } from '@/types';
import { classNames } from '@/lib/utils';
import styles from './MainLayout.module.css';

export interface MainLayoutProps extends ComponentBaseProps {}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  return (
    <div className={classNames(styles.shell, className)}>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};
