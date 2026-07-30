'use client';

import { useRouter } from 'next/navigation';
import {
  Badge,
  Button,
  Container,
  Icon,
  Link,
} from '@/components/ui';
import styles from './page.module.css';
import HeroLottieAnimations from '@/components/HeroLottieAnimations';

export default function AssessmentEntryPage() {
  const router = useRouter();
  const handleStartAnalysis = () => {
    router.push('/demo-selection');
  };

  return (
    <div className={styles.landingWrapper}>
      {/* TOP NAVBAR */}
      <header className={styles.topHeader}>
        <Container className={styles.topHeaderContainer}>
          <div className={styles.brandBlock}>
            <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 815.71 212.04" className={styles.brandLogoSvg} aria-label="DARP Logo">
              <defs>
                <style>
                  {`
                    .cls-1 { fill: #35bc48; }
                    .cls-2 { fill: #0f172a; }
                  `}
                </style>
              </defs>
              <g id="Layer_1-2" data-name="Layer 1">
                <g>
                  <path className="cls-2" d="M392.79,64.63c-6.07-11.61-14.76-20.55-26.06-26.79-11.31-6.25-24.81-9.37-40.52-9.37h-55.79v155.97h55.27c15.84,0,29.45-3.12,40.83-9.37,11.37-6.24,20.11-15.19,26.22-26.85,6.11-11.65,9.16-25.61,9.16-41.87s-3.04-30.1-9.11-41.72ZM364.06,134.77c-3.39,7.37-8.41,12.77-15.08,16.23-6.66,3.45-14.91,5.18-24.75,5.18h-20.94V56.73h21.04c9.77,0,17.99,1.73,24.65,5.18,6.67,3.46,11.69,8.85,15.08,16.18,3.38,7.32,5.07,16.75,5.07,28.26s-1.69,21.06-5.07,28.42Z"/>
                  <path className="cls-2" d="M499.15,28.47h-42.5l-53.81,155.97h35.28l11.57-35.59h56.42l11.57,35.59h35.17l-53.7-155.97ZM458.07,123.1l19.2-59.04h1.26l19.2,59.04h-39.66Z"/>
                  <path className="cls-2" d="M654.35,123.91c.49-.21.98-.43,1.46-.65,8.48-3.95,14.95-9.65,19.41-17.12,4.47-7.47,6.7-16.36,6.7-26.69s-2.21-19.32-6.64-26.96c-4.44-7.64-10.82-13.55-19.16-17.74-8.34-4.19-18.41-6.28-30.2-6.28h-61.45v155.97h32.87v-55.27h24.11l29.59,55.27h36.43l-33.12-60.53ZM597.34,55.48h22.3c6.35,0,11.62.92,15.81,2.77,4.18,1.85,7.31,4.54,9.36,8.06,2.06,3.52,3.09,7.9,3.09,13.14s-1.03,9.45-3.09,12.87c-2.05,3.42-5.16,6.01-9.31,7.75-4.16,1.74-9.41,2.62-15.76,2.62h-22.4v-47.21Z"/>
                  <path className="cls-2" d="M809.06,53.9c-4.43-7.95-10.82-14.18-19.16-18.68-8.34-4.5-18.4-6.75-30.2-6.75h-61.45v155.97h32.87v-50.56h27.75c12,0,22.24-2.21,30.72-6.65,8.48-4.43,14.95-10.58,19.42-18.47,4.46-7.89,6.7-16.99,6.7-27.32s-2.22-19.58-6.65-27.54ZM778.6,94.94c-2.06,3.91-5.17,6.98-9.32,9.21-4.15,2.24-9.4,3.35-15.75,3.35h-22.41v-52.02h22.3c6.35,0,11.62,1.08,15.81,3.24s7.31,5.18,9.37,9.06c2.06,3.87,3.09,8.42,3.09,13.66s-1.03,9.59-3.09,13.5Z"/>
                </g>
                <rect className="cls-2" x="2.44" y="24.82" width="88.2" height="43.42" transform="translate(46.53 112.34) rotate(-135)"/>
                <rect className="cls-2" x="121.41" y="143.8" width="88.2" height="43.42" transform="translate(165.51 399.57) rotate(-135)"/>
                <rect className="cls-2" x="3.39" y="143.8" width="88.2" height="43.42" transform="translate(198.11 248.95) rotate(135)"/>
                <rect className="cls-1" x="122.37" y="24.82" width="88.2" height="43.42" transform="translate(317.08 -38.27) rotate(135)"/>
              </g>
            </svg>
            <span className={styles.brandSubtext}>Discover • Assess • Recover • Prevent</span>
          </div>

          <nav className={styles.navLinks}>
            <Link href="#about" underline="hover">About</Link>
            <Link href="#security" underline="hover">Security & Privacy</Link>
            <Link href="#support" underline="hover">Contact Support</Link>
          </nav>

          <div className={styles.navAction}>
            <Button variant="primary" size="md" onClick={handleStartAnalysis}>
              Start Free Analysis →
            </Button>
          </div>
        </Container>
      </header>

      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <Container className={styles.heroContainer}>
          <HeroLottieAnimations
            classLeft={styles.lottieLeft}
            classRight={styles.lottieRight}
          />
          <div className={styles.heroContent}>
            <Badge variant="neutral" className={styles.heroBadge}>
              AI-Powered Financial Recovery Platform
            </Badge>

            <h1 className={styles.heroHeadline}>
              Turn Hidden Financial Leakage Into Recovered Working Capital.
            </h1>

            <p className={styles.heroSubtitle}>
              DARP autonomously inspects accounts payable ledgers, customer receivables, and tax filings to pinpoint overpayments, unclaimed tax credits, and uncollected revenue — restoring capital straight to your balance sheet.
            </p>

            <div className={styles.heroActionBlock}>
              <Button
                variant="primary"
                size="lg"
                className={styles.primaryHeroBtn}
                onClick={handleStartAnalysis}
              >
                Start Free Analysis →
              </Button>
              <span className={styles.heroSubnote}>
                Free 2 minute assessment • No credit card required
              </span>
            </div>

            <div className={styles.heroTrustStrip}>
              <span>256-Bit AES Encryption</span>
              <span className={styles.trustSeparator}>•</span>
              <span>SOC2 Type II Ready</span>
              <span className={styles.trustSeparator}>•</span>
              <span>Zero Data Retention Without Permission</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. THE RECOVERY JOURNEY */}
      <section className={styles.journeySection}>
        <Container>
          <div className={styles.sectionHeaderCenter}>
            <Badge variant="neutral">THE RECOVERY JOURNEY</Badge>
            <h2 style={{ fontSize: 'var(--font-size-page-title)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginTop: '0.5rem' }}>
              How DARP Restores Your Capital
            </h2>
            <span style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)' }}>
              From initial ledger inspection to continuous protection, experience a guided AI recovery lifecycle.
            </span>
          </div>

          <div className={styles.journeyGrid}>
            {/* Card 1 */}
            <div className={styles.journeyCard}>
              <div className={styles.journeyCardTop}>
                <div className={styles.journeyBadgeRow}>
                  <Badge variant="neutral" size="sm">01 • DISCOVER</Badge>
                  <Icon size="sm" label="Search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </Icon>
                </div>
                <h3 className={styles.journeyCardTitle}>Uncover Leakage</h3>
                <p className={styles.journeyCardDesc}>
                  Scan vendor payables and sales registers to detect duplicate payments, unapplied credit notes, and pricing variances.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className={styles.journeyCard}>
              <div className={styles.journeyCardTop}>
                <div className={styles.journeyBadgeRow}>
                  <Badge variant="neutral" size="sm">02 • ASSESS</Badge>
                  <Icon size="sm" label="Chart">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 20V10M12 20V4M6 20v-6" />
                    </svg>
                  </Icon>
                </div>
                <h3 className={styles.journeyCardTitle}>Quantify Impact</h3>
                <p className={styles.journeyCardDesc}>
                  Evaluate GSTR-2B mismatches, unclaimed Input Tax Credits (ITC), and bank statement reconciliation gaps.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className={styles.journeyCard}>
              <div className={styles.journeyCardTop}>
                <div className={styles.journeyBadgeRow}>
                  <Badge variant="neutral" size="sm">03 • RECOVER</Badge>
                  <Icon size="sm" label="Cash">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                  </Icon>
                </div>
                <h3 className={styles.journeyCardTitle}>Claw Back Cash</h3>
                <p className={styles.journeyCardDesc}>
                  Generate structured vendor claim packages, tax adjustment filings, and actionable recovery steps.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className={styles.journeyCard}>
              <div className={styles.journeyCardTop}>
                <div className={styles.journeyBadgeRow}>
                  <Badge variant="neutral" size="sm">FUTURE VISION</Badge>
                  <Icon size="sm" label="Shield">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </Icon>
                </div>
                <h3 className={styles.journeyCardTitle}>Prevent Leakage</h3>
                <p className={styles.journeyCardDesc}>
                  Future automated guardrails to detect and block financial errors at the source before disbursements occur.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. VALUE DELIVERED */}
      <section className={styles.valueSection}>
        <Container>
          <div className={styles.sectionHeaderCenter}>
            <Badge variant="neutral">VALUE DELIVERED</Badge>
            <h2 style={{ fontSize: 'var(--font-size-page-title)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginTop: '0.5rem' }}>
              Designed for Modern Finance Leaders
            </h2>
            <span style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)' }}>
              Empowering CFOs, Controllers, and Audit Teams with automated financial intelligence.
            </span>
          </div>

          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIconBox}>
                <Icon size="md" label="Restoration">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                </Icon>
              </div>
              <h3 className={styles.valueCardTitle}>Capital Restoration</h3>
              <p className={styles.valueCardDesc}>
                Identify forgotten credit memos, unbilled customer deliveries, and overbilled vendor invoices to reclaim lost gross margin.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconBox}>
                <Icon size="md" label="Tax">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </Icon>
              </div>
              <h3 className={styles.valueCardTitle}>Tax & Compliance Matching</h3>
              <p className={styles.valueCardDesc}>
                Seamlessly cross-verify purchase registers against GSTR-2B filings to capture every eligible Input Tax Credit before deadlines.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconBox}>
                <Icon size="md" label="Stateless">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </Icon>
              </div>
              <h3 className={styles.valueCardTitle}>Stateless AI Audit</h3>
              <p className={styles.valueCardDesc}>
                Upload standard accounting exports safely. DARP processes files statelessly with 256-bit client-side encryption.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. BANK-GRADE ASSURANCE */}
      <section className={styles.assuranceSection} id="security">
        <Container>
          <div className={styles.assuranceCard}>
            <div className={styles.assuranceHeader}>
              <span style={{ fontSize: 'var(--font-size-caption)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', letterSpacing: '0.04em' }}>
                BANK-GRADE ASSURANCE
              </span>
              <Badge variant="neutral">SOC2 TYPE II READY</Badge>
            </div>
            
            <h2 className={styles.assuranceTitle}>
              Security Built Into Every Layer
            </h2>

            <div className={styles.assuranceGrid}>
              <div className={styles.assuranceItem}>
                <div className={styles.assuranceItemHeader}>
                  <Icon size="sm" label="Lock">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </Icon>
                  <span className={styles.assuranceItemTitle}>256-Bit TLS 1.3</span>
                </div>
                <p className={styles.assuranceItemDesc}>
                  Uploads are encrypted end-to-end using standard enterprise TLS.
                </p>
              </div>

              <div className={styles.assuranceItem}>
                <div className={styles.assuranceItemHeader}>
                  <Icon size="sm" label="Globe">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                    </svg>
                  </Icon>
                  <span className={styles.assuranceItemTitle}>Zero Data Sales</span>
                </div>
                <p className={styles.assuranceItemDesc}>
                  Ledgers are never shared, sold, or used to train public AI models.
                </p>
              </div>

              <div className={styles.assuranceItem}>
                <div className={styles.assuranceItemHeader}>
                  <Icon size="sm" label="Flash">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </Icon>
                  <span className={styles.assuranceItemTitle}>Stateless Processing</span>
                </div>
                <p className={styles.assuranceItemDesc}>
                  Files are processed ephemerally with automatic client-side purging.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. FINAL CALL TO ACTION CARD */}
      <section className={styles.finalCtaSection}>
        <Container>
          <div className={styles.finalCtaCard}>
            <h2 className={styles.finalCtaTitle}>
              Ready to Recover Your Trapped Cash?
            </h2>
            <p className={styles.finalCtaSubtitle}>
              Start your free financial recovery assessment now. It takes less than 2 minutes to configure your focus areas.
            </p>
            <Button
              variant="primary"
              size="lg"
              className={styles.finalCtaButton}
              onClick={handleStartAnalysis}
            >
              Start Free Analysis →
            </Button>
            <span className={styles.finalCtaNote}>
              No integration required • Confidential document inspection
            </span>
          </div>
        </Container>
      </section>

      {/* MINIMAL ENTERPRISE FOOTER */}
      <footer className={styles.footer}>
        <Container className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <span>DARP Enterprise v2</span>
            <span>(v2.0.0)</span>
          </div>
          <div className={styles.footerRight}>
            <Link href="#privacy" underline="hover">Privacy</Link>
            <span>•</span>
            <Link href="#terms" underline="hover">Terms</Link>
            <span>•</span>
            <Link href="#support" underline="hover">Support</Link>
          </div>
        </Container>
      </footer>
    </div>
  );
}
