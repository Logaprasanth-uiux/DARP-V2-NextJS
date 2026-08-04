'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container } from '@/components/ui';
import styles from './page.module.css';

export default function Demo2LandingPlaceholderPage() {
  const router = useRouter();

  const handleBackToLauncher = () => {
    router.push('/');
  };

  return (
    <div className={styles.wrapper}>
      {/* TOP HEADER */}
      <header className={styles.topHeader}>
        <Container className={styles.topHeaderContainer}>
          <div className={styles.brandBlock} onClick={handleBackToLauncher} style={{ cursor: 'pointer' }}>
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
            <Button variant="outline" size="sm" onClick={handleBackToLauncher}>
              ← Back to Launcher
            </Button>
          </div>
        </Container>
      </header>

      {/* MAIN CONTAINER */}
      <main className={styles.mainContent}>
        <Container className={styles.contentContainer}>
          <div className={styles.placeholderCard}>
            <div className={styles.badgeRow}>
              <span className={styles.demoBadge}>Landing Page – Demo 2</span>
            </div>
            
            <h1 className={styles.placeholderTitle}>Alternative Landing Page Experience</h1>
            <p className={styles.placeholderSubtitle}>
              This alternative landing experience is currently being refined and will be deployed in the next update.
            </p>

            <div className={styles.statusBox}>
              <span className={styles.statusPulse}></span>
              <span className={styles.statusText}>Coming in the next refinement</span>
            </div>

            <div className={styles.actionBlock}>
              <Button variant="primary" size="md" onClick={handleBackToLauncher}>
                Back to Demo Launcher
              </Button>
            </div>
          </div>
        </Container>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <Container className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <span>DARP Enterprise v2</span>
            <span>(v2.0.0)</span>
          </div>
          <div className={styles.footerRight}>
            <span className={styles.footerLink} onClick={handleBackToLauncher}>Launcher</span>
            <span>•</span>
            <span>Support</span>
          </div>
        </Container>
      </footer>
    </div>
  );
}
