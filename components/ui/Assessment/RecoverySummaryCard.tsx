import React from 'react';
import { Button } from '@/components/ui';
import styles from './RecoverySummaryCard.module.css';

export const RecoverySummaryCard: React.FC = () => {
  const blurredOpportunities = [
    {
      category: 'Duplicate Payments',
      title: 'Duplicate AP payment identified for Acme Supplies (Invoice #INV-2026-981)',
      value: '₹ 12,45,800',
    },
    {
      category: 'Contract Variances',
      title: 'Contract price variance detected on PO #PO-98234 (Supplier Apex Corp)',
      value: '₹ 8,12,450',
    },
    {
      category: 'Pricing Issues',
      title: 'Unit rate mismatch on Item Part-0982 from Zen Engineering Ltd',
      value: '₹ 4,75,210',
    },
    {
      category: 'Credit Opportunities',
      title: 'Unclaimed volume rebate credit note for Global Logistical Services',
      value: '₹ 15,20,000',
    },
    {
      category: 'Duplicate Payments',
      title: 'Potential double payment found on GST Invoice #TAX-881 (Sigma Ltd)',
      value: '₹ 6,10,000',
    },
    {
      category: 'Contract Variances',
      title: 'Overcharged tax rate mismatch detected on Delta Distributors',
      value: '₹ 3,92,400',
    },
  ];

  return (
    <div className={styles.summaryCard}>
      <div className={styles.cardHeader}>
        <div className={styles.completedBadge}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.badgeCheckIcon} aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Financial Recovery Assessment Complete
        </div>
      </div>

      <div className={styles.heroSection}>
        <span className={styles.heroLabel}>Total Recoverable Value</span>
        <h2 className={styles.heroValue}>₹ 2,48,75,420</h2>
        <span className={styles.oppCount}>27 Opportunities Identified</span>
        <p className={styles.heroDesc}>
          Estimated immediate recovery value identified by the AI across your uploaded financial records.
        </p>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Suppliers Reviewed</span>
          <span className={styles.metricVal}>146</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Transactions Analyzed</span>
          <span className={styles.metricVal}>18,452</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Confidence Score</span>
          <span className={styles.metricVal}>96%</span>
        </div>
      </div>

      <div className={styles.previewSection}>
        <h3 className={styles.previewTitle}>Recovery Opportunities</h3>
        
        <div className={styles.opportunitiesContainer}>
          <div className={styles.opportunitiesList}>
            {blurredOpportunities.map((opp, idx) => (
              <div key={idx} className={styles.oppRow} aria-hidden="true">
                <div className={styles.oppMain}>
                  <div className={styles.oppCategoryBadge}>{opp.category}</div>
                  <span className={styles.oppTitle}>{opp.title}</span>
                </div>
                <span className={styles.oppValueBlurred}>{opp.value}</span>
              </div>
            ))}
          </div>

          <div className={styles.unlockOverlay}>
            <div className={styles.unlockCard}>
              <div className={styles.unlockCardHeaderIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.lockHeaderIcon} aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h4 className={styles.unlockTitle}>Unlock Your Complete Recovery Report</h4>
              <p className={styles.unlockDesc}>
                View every recovery opportunity, financial insight, and supporting evidence identified by the AI assessment.
              </p>
              <Button variant="primary" size="md" className={styles.unlockBtn}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.unlockBtnIcon} aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
                Unlock
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecoverySummaryCard;
