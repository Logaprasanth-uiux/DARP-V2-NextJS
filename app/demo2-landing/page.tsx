'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Badge,
  Button,
  Container,
  Icon,
  Link,
} from '@/components/ui';
import { Modal } from '@/components/ui/Modal/Modal';
import styles from './page.module.css';
import { classNames } from '@/lib/utils';
import HeroLottieAnimationsDemo2 from '@/components/HeroLottieAnimationsDemo2';

export default function Demo2LandingPage() {
  const router = useRouter();
  const [modalType, setModalType] = useState<'about' | 'security' | 'support' | 'privacyTerms' | null>(null);

  const handleStartAnalysis = () => {
    router.push('/demo-selection');
  };

  const handleBackToLauncher = () => {
    router.push('/');
  };

  return (
    <div className={styles.landingWrapper}>
      {/* TOP NAVBAR */}
      <header className={styles.topHeader}>
        <Container className={styles.topHeaderContainer}>
          <div className={styles.brandBlock} onClick={handleBackToLauncher} style={{ cursor: 'pointer' }}>
            <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 815.71 212.04" className={styles.brandLogoSvg} aria-label="DARP Logo">
              <defs>
                <style>
                  {`
                    .cls-1 { fill: #041e3c; }
                    .cls-2 { fill: #ef761b; }
                  `}
                </style>
              </defs>
              <g id="Layer_1-2" data-name="Layer 1">
                <g>
                  <path className="cls-1" d="M392.79,64.63c-6.07-11.61-14.76-20.55-26.06-26.79-11.31-6.25-24.81-9.37-40.52-9.37h-55.79v155.97h55.27c15.84,0,29.45-3.12,40.83-9.37,11.37-6.24,20.11-15.19,26.22-26.85,6.11-11.65,9.16-25.61,9.16-41.87s-3.04-30.1-9.11-41.72ZM364.06,134.77c-3.39,7.37-8.41,12.77-15.08,16.23-6.66,3.45-14.91,5.18-24.75,5.18h-20.94V56.73h21.04c9.77,0,17.99,1.73,24.65,5.18,6.67,3.46,11.69,8.85,15.08,16.18,3.38,7.32,5.07,16.75,5.07,28.26s-1.69,21.06-5.07,28.42Z"/>
                  <path className="cls-1" d="M499.15,28.47h-42.5l-53.81,155.97h35.28l11.57-35.59h56.42l11.57,35.59h35.17l-53.7-155.97ZM458.07,123.1l19.2-59.04h1.26l19.2,59.04h-39.66Z"/>
                  <path className="cls-1" d="M654.35,123.91c.49-.21.98-.43,1.46-.65,8.48-3.95,14.95-9.65,19.41-17.12,4.47-7.47,6.7-16.36,6.7-26.69s-2.21-19.32-6.64-26.96c-4.44-7.64-10.82-13.55-19.16-17.74-8.34-4.19-18.41-6.28-30.2-6.28h-61.45v155.97h32.87v-55.27h24.11l29.59,55.27h36.43l-33.12-60.53ZM619.74,102.69h-22.4v-47.22h22.3c6.35,0,11.62.93,15.81,2.77,4.18,1.85,7.31,4.54,9.36,8.06,2.06,3.52,3.09,7.9,3.09,13.14s-1.03,9.45-3.09,12.87c-2.05,3.42-5.16,6.01-9.31,7.75-4.16,1.74-9.41,2.62-15.76,2.62Z"/>
                  <path className="cls-1" d="M809.06,53.9c-4.43-7.95-10.82-14.18-19.16-18.68-8.34-4.5-18.4-6.75-30.2-6.75h-61.45v155.97h32.87v-50.56h27.75c12,0,22.24-2.21,30.72-6.65,8.48-4.43,14.95-10.58,19.42-18.47,4.46-7.89,6.7-16.99,6.7-27.32s-2.22-19.58-6.65-27.54ZM778.6,94.94c-2.06,3.91-5.17,6.98-9.32,9.21-4.15,2.24-9.4,3.35-15.75,3.35h-22.41v-52.03h22.3c6.35,0,11.62,1.09,15.81,3.25s7.31,5.18,9.37,9.06c2.06,3.87,3.09,8.42,3.09,13.66s-1.03,9.59-3.09,13.5Z"/>
                </g>
                <rect className="cls-1" x="2.44" y="24.82" width="88.2" height="43.42" transform="translate(46.53 112.34) rotate(-135)"/>
                <rect className="cls-1" x="121.41" y="143.8" width="88.2" height="43.42" transform="translate(165.51 399.57) rotate(-135)"/>
                <rect className="cls-1" x="3.39" y="143.8" width="88.2" height="43.42" transform="translate(198.11 248.95) rotate(135)"/>
                <rect className="cls-2" x="122.37" y="24.82" width="88.2" height="43.42" transform="translate(317.08 -38.27) rotate(135)"/>
              </g>
            </svg>
            <span className={styles.brandSubtext}>Discover • Assess • Recover • Prevent</span>
          </div>

          <nav className={styles.navLinks}>
            <Link 
              className={classNames(styles.navLink, modalType === 'about' && styles.navLinkActive)} 
              onClick={(e) => { e.preventDefault(); setModalType('about'); }}
              underline="none"
            >
              About
            </Link>
            <Link 
              className={classNames(styles.navLink, modalType === 'security' && styles.navLinkActive)} 
              onClick={(e) => { e.preventDefault(); setModalType('security'); }}
              underline="none"
            >
              Security & Privacy
            </Link>
            <Link 
              className={classNames(styles.navLink, modalType === 'support' && styles.navLinkActive)} 
              onClick={(e) => { e.preventDefault(); setModalType('support'); }}
              underline="none"
            >
              Contact Support
            </Link>
          </nav>

          <div className={styles.navAction}>
            <Button variant="outline" size="md" onClick={() => router.push('/demo2-login')}>
              Existing User Login
            </Button>
            <Button variant="primary" size="md" onClick={handleStartAnalysis}>
              Start Free Analysis →
            </Button>
          </div>
        </Container>
      </header>

      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <Container className={styles.heroContainer}>
          <HeroLottieAnimationsDemo2
            classLeft={styles.lottieLeft}
            classRight={styles.lottieRight}
          />
          <div className={styles.heroContent}>
            <Badge variant="neutral" className={styles.heroBadge}>
              AI-Powered Financial Recovery Platform
            </Badge>

            <h1 className={styles.heroHeadline}>
              Ready to Recover Your Trapped Cash? in Just <span className={styles.greenHighlight}>2 Minutes</span>
              <span className={styles.heroSecondLine}>Recover Money That's Already Yours.</span>
            </h1>

            <div className={styles.heroTrustStrip}>
              <span className={styles.trustItem}>256-Bit AES Encryption</span>
              <span className={styles.trustSeparator}>•</span>
              <span className={styles.trustItem}>SOC2 Type II Ready</span>
              <span className={styles.trustSeparator}>•</span>
              <span className={styles.trustItem}>Zero Data Retention Without Permission</span>
            </div>

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
            <span className={styles.sectionBrief}>
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
                <h3 className={styles.journeyCardTitle}>Quantify Impact</h3>
                <p className={styles.journeyCardDesc}>
                  Quickly see where money may be waiting to be recovered.
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
                <h3 className={styles.journeyCardTitle}>Uncover Leakage</h3>
                <p className={styles.journeyCardDesc}>
                  Find hidden losses across your financial records.
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
                  Turn identified opportunities into recovered cash.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className={styles.journeyCard}>
              <div className={styles.journeyCardTop}>
                <div className={styles.journeyBadgeRow}>
                  <Badge variant="neutral" size="sm">04 • PREVENT</Badge>
                  <Icon size="sm" label="Shield">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </Icon>
                </div>
                <h3 className={styles.journeyCardTitle}>Prevent Leakage</h3>
                <p className={styles.journeyCardDesc}>
                  Stop the same cash losses from happening again.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* WHY DARP STANDS APART (Premium dark-themed section) */}
      <WhyDarpSection />

      {/* 3. VALUE DELIVERED */}
      <section className={styles.valueSection}>
        <Container>
          <div className={styles.sectionHeaderCenter}>
            <Badge variant="neutral">VALUE DELIVERED</Badge>
            <h2 style={{ fontSize: 'var(--font-size-page-title)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginTop: '0.5rem' }}>
              Designed for Modern Finance Leaders
            </h2>
            <span className={styles.sectionBrief}>
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
                <div className={styles.assuranceIconBox}>
                  <Icon size="sm" label="Lock">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </Icon>
                </div>
                <h3 className={styles.assuranceItemTitle}>256-Bit TLS 1.3</h3>
                <p className={styles.assuranceItemDesc}>
                  Uploads are encrypted end-to-end using standard enterprise TLS.
                </p>
              </div>

              <div className={styles.assuranceItem}>
                <div className={styles.assuranceIconBox}>
                  <Icon size="sm" label="Globe">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                    </svg>
                  </Icon>
                </div>
                <h3 className={styles.assuranceItemTitle}>Zero Data Sales</h3>
                <p className={styles.assuranceItemDesc}>
                  Ledgers are never shared, sold, or used to train public AI models.
                </p>
              </div>

              <div className={styles.assuranceItem}>
                <div className={styles.assuranceIconBox}>
                  <Icon size="sm" label="Flash">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </Icon>
                </div>
                <h3 className={styles.assuranceItemTitle}>Stateless Processing</h3>
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
              Start Your Free Recovery Assessment
            </h2>
            <p className={styles.finalCtaSubtitle}>
              See how much recoverable cash may already exist in your financial records. Your AI-powered assessment takes less than 2 minutes to begin.
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
            <Link 
              className={styles.footerLink} 
              onClick={(e) => { e.preventDefault(); setModalType('privacyTerms'); }}
              underline="none"
            >
              Privacy & Terms
            </Link>
            <span className={styles.footerDivider}>|</span>
            <Link 
              className={styles.footerLink} 
              onClick={(e) => { e.preventDefault(); setModalType('support'); }}
              underline="none"
            >
              Support
            </Link>
          </div>
        </Container>
      </footer>

      {/* NAVIGATION MODALS */}
      <Modal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType || 'about'}
      />
    </div>
  );
}

function WhyDarpSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeState, setActiveState] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const activeStateRef = useRef(activeState);
  const lastTransitionTimeRef = useRef(0);

  // Stateful delays for nodes and cards
  const [activeD, setActiveD] = useState(false);
  const [activeCard1, setActiveCard1] = useState(false);
  const [activeA, setActiveA] = useState(false);
  const [activeCard2, setActiveCard2] = useState(false);
  const [activeP, setActiveP] = useState(false);
  const [activeCard3, setActiveCard3] = useState(false);
  const [activeR, setActiveR] = useState(false);
  const [activeCard4, setActiveCard4] = useState(false);

  // Keep ref updated and lock completion state once State 5 is reached
  useEffect(() => {
    activeStateRef.current = activeState;
    if (activeState === 5 && !isCompleted) {
      setIsCompleted(true);
    }
  }, [activeState, isCompleted]);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setIsCompleted(true);
      setActiveState(5);
    }
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setIsCompleted(true);
        setActiveState(5);
      }
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Intercept scroll/wheel and swipe gestures to progress state-based storytelling
  useEffect(() => {
    if (isCompleted || prefersReducedMotion) return;

    const element = sectionRef.current;
    if (!element) return;

    let touchStart = 0;

    const handleWheel = (e: WheelEvent) => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isSticky = rect.top <= 5 && rect.bottom >= viewportHeight - 5;
      
      if (!isSticky) return;

      // If in State 5 and scrolling down, let normal page scroll happen
      if (activeStateRef.current >= 5 && e.deltaY > 0) return;

      // Prevent default page scroll for animation states
      e.preventDefault();

      const now = Date.now();
      if (now - lastTransitionTimeRef.current < 1000) return; // strict 1s transition cooldown

      if (e.deltaY > 0) {
        lastTransitionTimeRef.current = now;
        setActiveState((prev) => Math.min(5, prev + 1));
      } else if (e.deltaY < 0) {
        lastTransitionTimeRef.current = now;
        setActiveState((prev) => Math.max(0, prev - 1));
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStart = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isSticky = rect.top <= 5 && rect.bottom >= viewportHeight - 5;
      
      if (!isSticky) return;

      const touchEnd = e.touches[0].clientY;
      const deltaY = touchStart - touchEnd;

      if (Math.abs(deltaY) > 30) {
        // If in State 5 and swiping up (scrolling down), let normal page scroll happen
        if (activeStateRef.current >= 5 && deltaY > 0) return;

        e.preventDefault();
        const now = Date.now();
        if (now - lastTransitionTimeRef.current < 1000) return;

        if (deltaY > 0) {
          lastTransitionTimeRef.current = now;
          setActiveState((prev) => Math.min(5, prev + 1));
        } else if (deltaY < 0) {
          lastTransitionTimeRef.current = now;
          setActiveState((prev) => Math.max(0, prev - 1));
        }
        touchStart = touchEnd;
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isCompleted, prefersReducedMotion]);

  // Reset state machine if the user scrolls back above the section
  useEffect(() => {
    if (isCompleted || prefersReducedMotion) return;

    const element = sectionRef.current;
    if (!element) return;

    const handleScrollReset = () => {
      const rect = element.getBoundingClientRect();
      if (rect.top > 5) {
        setActiveState(0);
      }
    };

    window.addEventListener('scroll', handleScrollReset, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollReset);
  }, [isCompleted, prefersReducedMotion]);

  // Determine drawing segment percentage
  const getDrawProgress = () => {
    if (activeState === 0) return 0;
    if (activeState === 1) return 0.25;
    if (activeState === 2) return 0.50;
    if (activeState === 3) return 0.75;
    return 1.00;
  };
  const drawProgress = (prefersReducedMotion || isCompleted) ? 1 : getDrawProgress();

  // Sync letter and card reveals to state machine transitions with 120ms delays
  useEffect(() => {
    if (prefersReducedMotion || isCompleted) {
      setActiveD(true); setActiveCard1(true);
      setActiveA(true); setActiveCard2(true);
      setActiveP(true); setActiveCard3(true);
      setActiveR(true); setActiveCard4(true);
      return;
    }

    if (activeState === 0) {
      setActiveD(false); setActiveCard1(false);
      setActiveA(false); setActiveCard2(false);
      setActiveP(false); setActiveCard3(false);
      setActiveR(false); setActiveCard4(false);
    } else if (activeState === 1) {
      setActiveD(true);
      const t = setTimeout(() => setActiveCard1(true), 120);
      setActiveA(false); setActiveCard2(false);
      setActiveP(false); setActiveCard3(false);
      setActiveR(false); setActiveCard4(false);
      return () => clearTimeout(t);
    } else if (activeState === 2) {
      setActiveD(true); setActiveCard1(true);
      setActiveA(true);
      const t = setTimeout(() => setActiveCard2(true), 120);
      setActiveP(false); setActiveCard3(false);
      setActiveR(false); setActiveCard4(false);
      return () => clearTimeout(t);
    } else if (activeState === 3) {
      setActiveD(true); setActiveCard1(true);
      setActiveA(true); setActiveCard2(true);
      setActiveP(true);
      const t = setTimeout(() => setActiveCard3(true), 120);
      setActiveR(false); setActiveCard4(false);
      return () => clearTimeout(t);
    } else if (activeState >= 4) {
      setActiveD(true); setActiveCard1(true);
      setActiveA(true); setActiveCard2(true);
      setActiveP(true); setActiveCard3(true);
      setActiveR(true);
      const t = setTimeout(() => setActiveCard4(true), 120);
      return () => clearTimeout(t);
    }
  }, [activeState, prefersReducedMotion, isCompleted]);

  return (
    <section 
      ref={sectionRef} 
      className={styles.whySection}
      style={{ height: isCompleted ? 'auto' : prefersReducedMotion ? 'auto' : '200vh' }}
    >
      <div 
        className={styles.whySectionSticky}
        style={{
          position: isCompleted ? 'relative' : 'sticky',
          height: isCompleted ? 'auto' : '100vh',
          paddingTop: isCompleted ? 'var(--space-16)' : '0',
          paddingBottom: isCompleted ? 'var(--space-16)' : '0'
        }}
      >
        <Container>
          <div className={`${styles.sectionHeaderCenter} ${styles.whyHeaderCenter}`}>
            <Badge variant="neutral" className={styles.whyBadge}>WHY DARP</Badge>
            <h2 className={styles.whyTitle} style={{ fontSize: 'var(--font-size-page-title)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-neutral-0)' }}>
              Why DARP Stands Apart
            </h2>
            <span className={styles.sectionBriefDark}>
              DARP is built on principles that transform uncertain financial recovery into measurable business outcomes.
            </span>
          </div>

          <div className={styles.whyGrid}>
            <div className={styles.whyCol}>
              <div className={styles.whyCard} style={{ opacity: activeCard1 ? 1 : 0, transform: activeCard1 ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out' }}>
                <h3 className={styles.whyCardTitle}>Evidence, not a benchmark</h3>
                <p className={styles.whyCardDesc}>Findings come from the customer's own ledger, not an industry average.</p>
              </div>
              <div className={styles.whyCard} style={{ opacity: activeCard4 ? 1 : 0, transform: activeCard4 ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out' }}>
                <h3 className={styles.whyCardTitle}>Funded by money already written off</h3>
                <p className={styles.whyCardDesc}>The engagement pays for itself out of cash the business had given up on.</p>
              </div>
            </div>

            <div className={styles.whyCenterContainer}>
              <div className={styles.whyRadialGlow} />
              <div className={styles.whyCenterQuestion}>?</div>
              <svg viewBox="0 0 360 360" className={styles.whySvgVisualizer}>
                <circle cx="180" cy="180" r="145" stroke={(activeState > 0 || isCompleted) ? "rgba(255, 255, 255, 0.04)" : "none"} strokeWidth="2.5" fill="none" />
                <circle 
                  cx="180" cy="180" r="145" stroke="#ef761b" strokeWidth="2.5" fill="none" 
                  strokeDasharray="911" strokeDashoffset={911 * (1 - drawProgress)} 
                  transform="rotate(-90 180 180)" strokeLinecap="round"
                  style={{ transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
              </svg>
              <div className={`${styles.whyNode} ${activeD ? styles.whyNodeActive : ''}`} style={{ top: '9px', left: '154px', opacity: activeD ? 1 : 0, transform: activeD ? 'scale(1)' : 'scale(0.8) translateY(-10px)' }}>D</div>
              <div className={`${styles.whyNode} ${activeA ? styles.whyNodeActive : ''}`} style={{ top: '154px', right: '9px', opacity: activeA ? 1 : 0, transform: activeA ? 'scale(1)' : 'scale(0.8) translateX(10px)' }}>A</div>
              <div className={`${styles.whyNode} ${activeP ? styles.whyNodeActive : ''}`} style={{ bottom: '9px', left: '154px', opacity: activeP ? 1 : 0, transform: activeP ? 'scale(1)' : 'scale(0.8) translateY(10px)' }}>P</div>
              <div className={`${styles.whyNode} ${activeR ? styles.whyNodeActive : ''}`} style={{ top: '154px', left: '9px', opacity: activeR ? 1 : 0, transform: activeR ? 'scale(1)' : 'scale(0.8) translateX(-10px)' }}>R</div>
            </div>

            <div className={styles.whyCol}>
              <div className={styles.whyCard} style={{ opacity: activeCard2 ? 1 : 0, transform: activeCard2 ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out' }}>
                <h3 className={styles.whyCardTitle}>A number before a commitment</h3>
                <p className={styles.whyCardDesc}>The value is quantified and agreed before anyone signs for the platform.</p>
              </div>
              <div className={styles.whyCard} style={{ opacity: activeCard3 ? 1 : 0, transform: activeCard3 ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out' }}>
                <h3 className={styles.whyCardTitle}>One rule set, two directions</h3>
                <p className={styles.whyCardDesc}>What found the money backwards runs forwards at entry. No second build.</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
