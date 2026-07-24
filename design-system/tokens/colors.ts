/**
 * Enterprise Design Tokens – Color Contracts
 */
export const colorTokens = {
  surface: 'var(--color-surface)',
  surfaceSubtle: 'var(--color-surface-subtle)',
  surfaceHover: 'var(--color-surface-hover)',
  background: 'var(--color-background)',
  border: 'var(--color-border)',
  borderHover: 'var(--color-border-hover)',
  borderStrong: 'var(--color-border-strong)',
  
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textMuted: 'var(--color-text-muted)',
  textInverse: 'var(--color-text-inverse)',

  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  primaryActive: 'var(--color-primary-active)',

  secondary: 'var(--color-secondary)',
  secondaryHover: 'var(--color-secondary-hover)',
  secondaryActive: 'var(--color-secondary-active)',

  success: 'var(--color-success)',
  successBg: 'var(--color-success-bg)',
  successBorder: 'var(--color-success-border)',
  successText: 'var(--color-success-text)',

  warning: 'var(--color-warning)',
  warningBg: 'var(--color-warning-bg)',
  warningBorder: 'var(--color-warning-border)',
  warningText: 'var(--color-warning-text)',

  danger: 'var(--color-danger)',
  dangerHover: 'var(--color-danger-hover)',
  dangerBg: 'var(--color-danger-bg)',
  dangerBorder: 'var(--color-danger-border)',
  dangerText: 'var(--color-danger-text)',

  info: 'var(--color-info)',
  infoBg: 'var(--color-info-bg)',
  infoBorder: 'var(--color-info-border)',
  infoText: 'var(--color-info-text)',
  focusRing: 'var(--color-focus-ring)',
} as const;
