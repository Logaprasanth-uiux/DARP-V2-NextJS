'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  Container,
  Input,
} from '@/components/ui';
import styles from './page.module.css';

export default function Demo2LoginPage() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleLoginSubmit = (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const isDemo3 = searchParams ? searchParams.get('demo') === '3' : false;
    
    if (isDemo3) {
      router.push('/demo3-workspace');
    } else {
      router.push('/demo2-workspace');
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* TOP NAVBAR (Reusing Landing Page header markup structure) */}
      <header className={styles.topHeader}>
        <Container className={styles.topHeaderContainer}>
          <div className={styles.brandBlock} onClick={handleBackToHome} style={{ cursor: 'pointer' }}>
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

          <div className={styles.navAction}>
            <Button variant="outline" size="sm" onClick={handleBackToHome} className={styles.backButton}>
              ← Back to Home
            </Button>
          </div>
        </Container>
      </header>

      {/* TWO COLUMN GRID CONTENT */}
      <main className={styles.mainContent}>
        <Container className={styles.gridContainer}>
          
          {/* LEFT PANEL (~45%): Assessment Experience Preview */}
          <section className={styles.leftPanel}>
            <div className={styles.illustrationPlaceholder}>
              <img 
                src="/images/assessment-preview.jpg" 
                alt="Assessment Experience Preview" 
                className={styles.previewImage}
              />
            </div>
          </section>

          {/* RIGHT PANEL (~55%): Authentication Section */}
          <section className={styles.rightPanel}>
            <div className={styles.authWrapper}>
              
              {/* HERO HEADLINE */}
              <h1 className={styles.headline}>
                Your complete AI Readiness Assessment in just <span className={styles.greenHighlight}>2 minutes</span>.
              </h1>
              
              {/* SUPPORTING DESCRIPTION */}
              <p className={styles.description}>
                Sign in to begin your complimentary AI readiness assessment and receive your personalized enterprise report in just 2 minutes.
              </p>

              {/* TRUST INDICATORS */}
              <div className={styles.trustRow}>
                <div className={styles.trustItem}>
                  <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className={styles.trustLabel}>Secure Login</span>
                </div>
                <div className={styles.trustItem}>
                  <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className={styles.trustLabel}>AES-256 Encrypted</span>
                </div>
                <div className={styles.trustItem}>
                  <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className={styles.trustLabel}>Private & Confidential</span>
                </div>
              </div>

              {/* AUTHENTICATION CARD */}
              <Card className={styles.authCard}>
                <CardContent className={styles.cardInner}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Sign in to continue</h2>
                    <p className={styles.cardSubtitle}>Access your assessment securely.</p>
                  </div>

                  {/* GOOGLE PRIMARY ACTION */}
                  <Button variant="outline" className={styles.googleBtn} fullWidth onClick={handleLoginSubmit}>
                    {/* Standard Google G Logo (monochrome/branding-compliant) */}
                    <svg className={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </Button>

                  {/* DIVIDER */}
                  <div className={styles.divider}>
                    <span className={styles.dividerLine} />
                    <span className={styles.dividerText}>OR</span>
                    <span className={styles.dividerLine} />
                  </div>

                  {/* EMAIL INPUT */}
                  <div className={styles.inputWrapper}>
                    <Input
                      type="email"
                      placeholder="Enter your work email"
                      className={styles.emailInput}
                      aria-label="Work Email"
                    />
                  </div>

                  {/* EMAIL SUBMIT CTA */}
                  <Button variant="primary" className={styles.emailSubmitBtn} fullWidth onClick={handleLoginSubmit}>
                    Continue with Email
                  </Button>

                  {/* FOOTER TERMS & PRIVACY */}
                  <p className={styles.termsText}>
                    By continuing, you agree to our Terms and Privacy Policy.
                  </p>
                </CardContent>
              </Card>

            </div>
          </section>
          
        </Container>
      </main>
    </div>
  );
}
