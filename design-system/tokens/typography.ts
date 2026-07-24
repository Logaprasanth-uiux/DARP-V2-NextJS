/**
 * Enterprise Design Tokens – Typography Scale Contracts
 */
export const typographyTokens = {
  fontFamily: {
    base: 'var(--font-family-base)',
    mono: 'var(--font-family-mono)',
  },
  fontSize: {
    display: 'var(--font-size-display)',
    pageTitle: 'var(--font-size-page-title)',
    heading: 'var(--font-size-heading)',
    cardTitle: 'var(--font-size-card-title)',
    body: 'var(--font-size-body)',
    secondary: 'var(--font-size-secondary)',
    caption: 'var(--font-size-caption)',
    label: 'var(--font-size-label)',
  },
  fontWeight: {
    regular: 'var(--font-weight-regular)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
  },
  lineHeight: {
    tight: 'var(--line-height-tight)',
    snug: 'var(--line-height-snug)',
    normal: 'var(--line-height-normal)',
    relaxed: 'var(--line-height-relaxed)',
  },
} as const;
