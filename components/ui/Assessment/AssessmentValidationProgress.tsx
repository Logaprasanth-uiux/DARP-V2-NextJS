import React, { useState, useEffect, useRef } from 'react';
import { classNames } from '@/lib/utils';
import styles from './AssessmentValidationProgress.module.css';

export interface AssessmentValidationProgressProps {
  onComplete: () => void;
}

export const AssessmentValidationProgress: React.FC<AssessmentValidationProgressProps> = ({
  onComplete,
}) => {
  const stages = [
    'Financial documents received',
    'Identifying uploaded document types',
    'Validating required financial documents',
    'Extracting organization information',
    'Preparing assessment profile',
  ];

  const [currentStage, setCurrentStage] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  // Track onComplete using a ref to prevent recreation loops
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let stage = 0;
    const delay = 700; // milliseconds per stage transition

    const interval = setInterval(() => {
      setCompleted((prev) => [...prev, stage]);
      
      if (stage < stages.length - 1) {
        stage++;
        setCurrentStage(stage);
      } else {
        clearInterval(interval);
        // Briefly wait to let the last checkmark render, then call onComplete
        setTimeout(() => {
          onCompleteRef.current();
        }, 400);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [stages.length]); // empty dependency style to execute only once on mount

  return (
    <div className={styles.progressPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.loadingPulse} aria-hidden="true" />
        <h3 className={styles.panelTitle}>Validating Financial Documents</h3>
      </div>
      
      <div className={styles.stagesList}>
        {stages.map((stage, idx) => {
          const isCompleted = completed.includes(idx);
          const isActive = idx === currentStage && !isCompleted;
          const isPending = idx > currentStage;

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
