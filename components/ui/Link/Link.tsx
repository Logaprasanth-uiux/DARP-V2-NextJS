import React from 'react';
import NextLink from 'next/link';
import { ComponentBaseProps } from '@/types/design-system';
import { classNames } from '@/lib/utils';
import styles from './Link.module.css';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, ComponentBaseProps {
  external?: boolean;
  underline?: 'always' | 'hover' | 'none';
}

export const Link: React.FC<LinkProps> = ({
  children,
  href,
  external = false,
  underline = 'hover',
  className,
  ...props
}) => {
  const isExternal = external || (href && (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')));
  const isAnchor = href && href.startsWith('#');

  const combinedClassName = classNames(
    styles.link,
    styles[`underline-${underline}`],
    className
  );

  if (isExternal || isAnchor || !href) {
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={combinedClassName}
        {...props}
      >
        {children}
        {isExternal && <span className={styles.externalIndicator} aria-hidden="true"> ↗</span>}
      </a>
    );
  }

  return (
    <NextLink
      href={href}
      className={combinedClassName}
      {...(props as any)}
    >
      {children}
    </NextLink>
  );
};
