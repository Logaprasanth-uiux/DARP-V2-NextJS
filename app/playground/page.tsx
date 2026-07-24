'use client';

import React, { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardContent,
  Container,
  Divider,
  EmptyState,
  Icon,
  Input,
  Link,
  Select,
  Skeleton,
  Spinner,
  StatusChip,
  TextArea,
  Display,
  PageTitle,
  SectionHeading,
  CardTitle,
  Body,
  SecondaryText,
  Caption,
  Label,
} from '@/components/ui';
import styles from './page.module.css';

export default function ComponentPlayground() {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('option-1');

  return (
    <Container style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header className={styles.playgroundHeader}>
        <PageTitle>Enterprise Design System Component Playground</PageTitle>
        <SecondaryText style={{ display: 'block', marginTop: '0.5rem' }}>
          DARP Enterprise v2 – Visual Token & Component Showcase
        </SecondaryText>
      </header>

      {/* 1. Design Tokens */}
      <section className={styles.section}>
        <SectionHeading>1. Neutral & Semantic Tokens</SectionHeading>
        <SecondaryText style={{ display: 'block', marginTop: '0.25rem' }}>
          Restrained, enterprise-grade neutral surfaces with semantic indicators.
        </SecondaryText>

        <div className={styles.tokenGrid}>
          <div className={styles.swatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--color-surface)' }} />
            <div className={styles.swatchName}>Surface</div>
          </div>
          <div className={styles.swatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--color-surface-subtle)' }} />
            <div className={styles.swatchName}>Surface Subtle</div>
          </div>
          <div className={styles.swatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className={styles.swatchName}>Primary</div>
          </div>
          <div className={styles.swatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--color-success-bg)', borderColor: 'var(--color-success-border)' }} />
            <div className={styles.swatchName}>Success</div>
          </div>
          <div className={styles.swatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--color-warning-bg)', borderColor: 'var(--color-warning-border)' }} />
            <div className={styles.swatchName}>Warning</div>
          </div>
          <div className={styles.swatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--color-danger-bg)', borderColor: 'var(--color-danger-border)' }} />
            <div className={styles.swatchName}>Danger</div>
          </div>
          <div className={styles.swatch}>
            <div className={styles.swatchBox} style={{ backgroundColor: 'var(--color-info-bg)', borderColor: 'var(--color-info-border)' }} />
            <div className={styles.swatchName}>Info / Focus</div>
          </div>
        </div>
      </section>

      <Divider spacing="lg" />

      {/* 2. Typography Scale */}
      <section className={styles.section}>
        <SectionHeading>2. Typography Hierarchy</SectionHeading>
        <SecondaryText style={{ display: 'block', marginTop: '0.25rem', marginBottom: '1rem' }}>
          Clean typography scale guiding user attention through restraint and hierarchy.
        </SecondaryText>

        <div className={styles.specimenBox}>
          <div>
            <Label>Display</Label>
            <Display>DARP Enterprise v2</Display>
          </div>
          <Divider spacing="sm" />
          <div>
            <Label>Page Title</Label>
            <PageTitle>Financial Performance Assessment</PageTitle>
          </div>
          <Divider spacing="sm" />
          <div>
            <Label>Section Heading</Label>
            <SectionHeading>Operational Risk Summary</SectionHeading>
          </div>
          <Divider spacing="sm" />
          <div>
            <Label>Card Title</Label>
            <CardTitle>Compliance Evaluation Metric</CardTitle>
          </div>
          <Divider spacing="sm" />
          <div>
            <Label>Body Text</Label>
            <Body>
              Standard enterprise body typography designed for legibility, optimal line height, and structured information layout.
            </Body>
          </div>
          <Divider spacing="sm" />
          <div>
            <Label>Secondary Text</Label>
            <SecondaryText style={{ display: 'block' }}>
              Subtle context label providing additional explanation.
            </SecondaryText>
          </div>
          <Divider spacing="sm" />
          <div>
            <Label>Caption & Label</Label>
            <div>
              <Caption>LAST UPDATED 2026-07-21</Caption>
            </div>
          </div>
        </div>
      </section>

      <Divider spacing="lg" />

      {/* 3. Buttons & Interactive States */}
      <section className={styles.section}>
        <SectionHeading>3. Buttons & Interactive States</SectionHeading>
        <SecondaryText style={{ display: 'block', marginTop: '0.25rem', marginBottom: '1rem' }}>
          Primary, secondary, outline, ghost, and danger variants across size scales and interactive states.
        </SecondaryText>

        <div className={styles.specimenBox}>
          <div>
            <Label>Variants (Medium Size)</Label>
            <div className={styles.row}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          <Divider spacing="sm" />

          <div>
            <Label>Sizes (Primary Variant)</Label>
            <div className={styles.row}>
              <Button size="sm">Small (2rem)</Button>
              <Button size="md">Medium (2.375rem)</Button>
              <Button size="lg">Large (2.75rem)</Button>
            </div>
          </div>

          <Divider spacing="sm" />

          <div>
            <Label>Disabled State</Label>
            <div className={styles.row}>
              <Button variant="primary" disabled>Primary Disabled</Button>
              <Button variant="secondary" disabled>Secondary Disabled</Button>
              <Button variant="outline" disabled>Outline Disabled</Button>
            </div>
          </div>
        </div>
      </section>

      <Divider spacing="lg" />

      {/* 4. Form Controls */}
      <section className={styles.section}>
        <SectionHeading>4. Form Controls</SectionHeading>
        <SecondaryText style={{ display: 'block', marginTop: '0.25rem', marginBottom: '1rem' }}>
          Form inputs with persistent top labels, helper text, focus-visible states, and error handling.
        </SecondaryText>

        <div className={styles.grid2}>
          <Card>
            <CardHeader>
              <CardTitle>Standard Input & Select Controls</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Input
                label="Organization Identifier"
                placeholder="e.g. ORG-88241"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="Enter your unique enterprise registration code"
                required
              />

              <Select
                label="Assessment Scope"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[
                  { value: 'option-1', label: 'Full Enterprise Audit' },
                  { value: 'option-2', label: 'Regional Compliance Review' },
                  { value: 'option-3', label: 'Targeted Financial Inspection' },
                ]}
                helperText="Select evaluation boundaries"
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>States & Error Validation</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Input
                label="Tax Identification Number"
                value="INVALID-TAX-ID"
                error="Required format: XX-XXXXXXX"
                required
              />

              <TextArea
                label="Executive Summary Notes"
                placeholder="Enter summary narrative..."
                helperText="Maximum 500 characters"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Divider spacing="lg" />

      {/* 5. Badges & Status Chips */}
      <section className={styles.section}>
        <SectionHeading>5. Badges & Status Chips</SectionHeading>
        <SecondaryText style={{ display: 'block', marginTop: '0.25rem', marginBottom: '1rem' }}>
          Semantic status tags and operational status chips with indicator dots.
        </SecondaryText>

        <div className={styles.specimenBox}>
          <div>
            <Label>Semantic Badges</Label>
            <div className={styles.row}>
              <Badge variant="neutral">Neutral</Badge>
              <Badge variant="success">Active</Badge>
              <Badge variant="warning">Review Required</Badge>
              <Badge variant="danger">Critical Risk</Badge>
              <Badge variant="info">In Progress</Badge>
            </div>
          </div>

          <Divider spacing="sm" />

          <div>
            <Label>Operational Status Chips (With Indicator Dot)</Label>
            <div className={styles.row}>
              <StatusChip variant="neutral" label="Unassigned" />
              <StatusChip variant="success" label="Operational" />
              <StatusChip variant="warning" label="Under Investigation" />
              <StatusChip variant="danger" label="Non-Compliant" />
              <StatusChip variant="info" label="Processing Data" />
            </div>
          </div>
        </div>
      </section>

      <Divider spacing="lg" />

      {/* 6. Primitives & Feedback Elements */}
      <section className={styles.section}>
        <SectionHeading>6. Primitives & Feedback Elements</SectionHeading>
        <SecondaryText style={{ display: 'block', marginTop: '0.25rem', marginBottom: '1rem' }}>
          Icon wrappers, accessible links, spinners, skeleton loaders, and empty states.
        </SecondaryText>

        <div className={styles.grid2}>
          <Card>
            <CardHeader>
              <CardTitle>Links, Spinners & Skeletons</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <Label>Accessible Links</Label>
                <div className={styles.row}>
                  <Link href="#internal">Internal Link</Link>
                  <Link href="https://example.com" external>External Documentation</Link>
                </div>
              </div>

              <div>
                <Label>Spinners & Icon Container</Label>
                <div className={styles.row}>
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <Icon size="lg" label="Checkmark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </Icon>
                </div>
              </div>

              <div>
                <Label>Skeleton Loading Shimmer</Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="rectangular" height="3rem" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Empty State Container</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={
                  <Icon size="xl">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </Icon>
                }
                title="No Assessment Records Found"
                description="Start a new evaluation or adjust your search parameters to view results."
                action={
                  <Button variant="primary" size="sm">Create Assessment</Button>
                }
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </Container>
  );
}
