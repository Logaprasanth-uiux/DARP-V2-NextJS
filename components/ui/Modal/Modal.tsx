"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../Button/Button';
import { classNames } from '@/lib/utils';
import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'about' | 'security' | 'support' | 'privacyTerms';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, type }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Transition mount/unmount logic
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setAnimate(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 250); // Matches CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Focus trap and accessibility
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Auto focus inside dialog
      const timer = setTimeout(() => {
        if (dialogRef.current) {
          const focusable = dialogRef.current.querySelector('button, input, textarea') as HTMLElement;
          if (focusable) focusable.focus();
        }
      }, 50);
      
      // Lock page body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Handle keyboard events (ESC and TAB focus trap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!dialogRef.current) return;
        const focusableElements = dialogRef.current.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
        );
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // SVGs for clean iconography
  const closeIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const documentIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );

  const checkCircleIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );

  const shieldIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );

  const keyIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
    </svg>
  );

  const lockIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  const trashIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  const mailIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );

  const paperplaneIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'var(--space-1-5)' }}>
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );

  const clockIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  const renderContent = () => {
    switch (type) {
      case 'about':
        return (
          <>
            <div className={styles.header}>
              <div className={styles.titleContainer}>
                <div className={classNames(styles.iconCircle, styles.iconCircleBlue)}>D</div>
                <h3 className={styles.titleText}>About DARP</h3>
              </div>
              <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
                {closeIcon}
              </button>
            </div>
            <div className={styles.content}>
              <p className={styles.introductionText}>
                <strong>DARP (Discover • Assess • Recover • Prevent)</strong> is an autonomous AI-powered Financial Recovery Platform engineered to help enterprises and SMBs uncover lost capital hidden within complex accounting ledgers, ERP filings, and tax registers.
              </p>
              
              <div className={styles.grid2x2}>
                <div className={styles.darpCard}>
                  <h4 className={styles.darpCardTitle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Discover
                  </h4>
                  <p className={styles.darpCardDesc}>Uncover vendor overpayments & unbilled receivables.</p>
                </div>

                <div className={styles.darpCard}>
                  <h4 className={styles.darpCardTitle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                      <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                    </svg>
                    Assess
                  </h4>
                  <p className={styles.darpCardDesc}>Analyze GSTR-2B mismatches and bank statements.</p>
                </div>

                <div className={styles.darpCard}>
                  <h4 className={styles.darpCardTitle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 4v6h-6"></path>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                    Recover
                  </h4>
                  <p className={styles.darpCardDesc}>Streamline recovery actions & credit note claims.</p>
                </div>

                <div className={styles.darpCard}>
                  <h4 className={styles.darpCardTitle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Prevent
                  </h4>
                  <p className={styles.darpCardDesc}>Establish guardrails against future duplicate leaks.</p>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="primary" size="md" onClick={onClose}>
                Got it
              </Button>
            </div>
          </>
        );

      case 'security':
        return (
          <>
            <div className={styles.header}>
              <div className={styles.titleContainer}>
                <div className={classNames(styles.iconCircle, styles.iconCircleGreen)}>
                  {shieldIcon}
                </div>
                <h3 className={styles.titleText}>Enterprise Security & Privacy</h3>
              </div>
              <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
                {closeIcon}
              </button>
            </div>
            <div className={styles.content}>
              <p className={styles.introductionText}>
                DARP places financial security and confidentiality at the core of our platform. Every document uploaded undergoes client-side encryption prior to processing.
              </p>

              <div className={styles.listCards}>
                <div className={styles.darpCard}>
                  <h4 className={styles.darpCardTitle}>
                    {lockIcon}
                    256-Bit AES TLS 1.3 Encryption
                  </h4>
                  <p className={styles.darpCardDesc}>All documents are encrypted in transit and at rest using industry-leading cryptographic standards.</p>
                </div>

                <div className={styles.darpCard}>
                  <h4 className={styles.darpCardTitle}>
                    {keyIcon}
                    Zero Third-Party Training
                  </h4>
                  <p className={styles.darpCardDesc}>Your financial ledgers are NEVER used to train public language models or shared with external parties.</p>
                </div>

                <div className={styles.darpCard}>
                  <h4 className={styles.darpCardTitle}>
                    {trashIcon}
                    Automated Data Purge Options
                  </h4>
                  <p className={styles.darpCardDesc}>Documents are processed statelessly with automatic purge policies once recovery assessment concludes.</p>
                </div>
              </div>
            </div>
            <div className={styles.securityFooter}>
              <div className={styles.socBadge}>
                {checkCircleIcon}
                SOC2 Type II Certified Pipeline
              </div>
              <Button variant="primary" size="md" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        );

      case 'support':
        return (
          <>
            <div className={styles.header}>
              <div className={styles.titleContainer}>
                <div className={classNames(styles.iconCircle, styles.iconCircleBlue)}>
                  {mailIcon}
                </div>
                <h3 className={styles.titleText}>Contact DARP Support</h3>
              </div>
              <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
                {closeIcon}
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className={styles.content}>
              <div className={styles.formGroup}>
                <label htmlFor="support-email" className={styles.formLabel}>Business Email</label>
                <input 
                  type="email" 
                  id="support-email" 
                  className={styles.formInput} 
                  placeholder="name@company.com" 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="support-message" className={styles.formLabel}>How can we assist you?</label>
                <textarea 
                  id="support-message" 
                  className={classNames(styles.formInput, styles.formTextarea)} 
                  placeholder="Tell us about your recovery needs or custom ledger format..." 
                  required
                />
              </div>

              <div className={styles.supportFooter}>
                <div className={styles.supportResponseTime}>
                  {clockIcon}
                  Typical response time &lt; 2 hours
                </div>
                <div className={styles.formActions}>
                  <Button type="button" variant="outline" size="md" onClick={onClose}>
                    Close
                  </Button>
                  <Button type="submit" variant="primary" size="md">
                    Send Message
                    {paperplaneIcon}
                  </Button>
                </div>
              </div>
            </form>
          </>
        );
      
      case 'privacyTerms':
        return (
          <>
            <div className={styles.header}>
              <div className={styles.titleContainer}>
                <div className={classNames(styles.iconCircle, styles.iconCircleBlue)}>
                  {documentIcon}
                </div>
                <h3 className={styles.titleText}>Privacy & Terms</h3>
              </div>
              <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
                {closeIcon}
              </button>
            </div>
            <div className={classNames(styles.content, styles.privacyContent)}>
              <div className={styles.legalSection}>
                <h4 className={styles.legalSectionTitle}>Privacy & Data Handling</h4>
                <p className={styles.legalSectionText}>
                  DARP processes financial information only for the purpose of providing the requested financial recovery assessment and related platform functionality. Uploaded information should be handled securely and only within the scope required to deliver the experience.
                </p>
              </div>

              <div className={styles.legalSection}>
                <h4 className={styles.legalSectionTitle}>Terms of Use</h4>
                <p className={styles.legalSectionText}>
                  DARP insights and recovery estimates are intended to support business decision-making and should be reviewed before financial, accounting, tax, or operational actions are taken. Use of the platform constitutes acceptance of the applicable service terms and usage conditions.
                </p>
              </div>

              <div className={styles.legalSection}>
                <h4 className={styles.legalSectionTitle}>Data Security</h4>
                <p className={styles.legalSectionText}>
                  DARP is designed around secure processing, controlled data access, encryption, and responsible handling of uploaded financial information.
                </p>
              </div>

              <div className={styles.legalSection}>
                <h4 className={styles.legalSectionTitle}>Important Notice</h4>
                <p className={styles.legalSectionText}>
                  Assessment results, identified opportunities, and estimated recovery values may vary depending on the completeness and accuracy of the information provided.
                </p>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="primary" size="md" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className={classNames(styles.overlay, animate && styles.overlayOpen)} 
      onClick={handleBackdropClick}
    >
      <div 
        ref={dialogRef}
        className={classNames(styles.dialog, animate && styles.dialogOpen)}
        role="dialog"
        aria-modal="true"
      >
        {renderContent()}
      </div>
    </div>
  );
};
