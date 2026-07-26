import React, { useState, useEffect, useRef } from 'react';
import { classNames } from '@/lib/utils';
import styles from './AssessmentAnalysisProgress.module.css';

export interface AssessmentAnalysisProgressProps {
  onComplete: () => void;
}

export const AssessmentAnalysisProgress: React.FC<AssessmentAnalysisProgressProps> = ({
  onComplete,
}) => {
  const stages = [
    'Building financial assessment model',
    'Reviewing Accounts Payable transactions',
    'Identifying financial recovery opportunities',
    'Estimating recoverable financial impact',
    'Preparing executive assessment summary',
  ];

  const [currentStage, setCurrentStage] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const delay = 700; // milliseconds per stage transition

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, delay);

    return () => clearInterval(interval);
  }, [stages.length]);

  useEffect(() => {
    if (currentStage === stages.length) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        const completeTimer = setTimeout(() => {
          onCompleteRef.current();
        }, 400);
        return () => clearTimeout(completeTimer);
      }, 400);
      return () => clearTimeout(fadeTimer);
    }
  }, [currentStage, stages.length]);

  return (
    <div className={classNames(styles.progressPanel, isFadingOut && styles.fadeOut)}>
      <div className={styles.panelHeader}>
        <div className={styles.loadingPulse} aria-hidden="true" />
        <h3 className={styles.panelTitle}>Analyzing Financial Records</h3>
      </div>
      
      <div className={styles.stagesList}>
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentStage;
          const isActive = idx === currentStage;

          return (
            <div
              key={stage}
              className={classNames(
                styles.stageRow,
                isActive && styles.stageRowActive,
                isCompleted && styles.stageRowCompleted
              )}
            >
              <div className={styles.statusCol}>
                {isCompleted ? (
                  <div className={styles.checkWrapper}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.checkIcon} aria-label="Completed">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : isActive ? (
                  <div className={styles.activeSpinner} aria-label="Processing">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.spinnerIcon}>
                      <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                    </svg>
                  </div>
                ) : (
                  <div className={styles.pendingDot} aria-hidden="true" />
                )}
              </div>
              <span className={styles.stageText}>{stage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
