import React from 'react';
import { classNames } from '@/lib/utils';
import styles from './RequiredDocumentChecklist.module.css';

export interface RequiredDocumentChecklistProps {
  assessmentType: string;
  uploadedFileNames?: string[];
}

export const RequiredDocumentChecklist: React.FC<RequiredDocumentChecklistProps> = ({
  assessmentType,
  uploadedFileNames = [],
}) => {
  const getDocumentLists = () => {
    switch (assessmentType) {
      case 'revenue':
        return {
          required: [
            'Accounts Receivable Ledger',
            'Customer Invoice Register',
            'Customer Master List',
            'Cash Receipts Journal',
          ],
          optional: ['Delivery Dispatch Notes'],
        };
      case 'full':
        return {
          required: [
            'AP Invoice Register',
            'AR Sales Register',
            'Vendor/Customer Masters',
            'Payment/Receipt Ledgers',
            'GSTR-2B Tax Filings',
          ],
          optional: ['Goods Receipt Notes'],
        };
      case 'cost':
      default:
        return {
          required: [
            'AP Invoice Register',
            'Supplier Master Database',
            'Purchase Orders List',
            'Payment Transaction Log',
          ],
          optional: ['Goods Receipt Notes'],
        };
    }
  };

  const { required, optional } = getDocumentLists();

  // Simple filename-to-document keyword mapping
  const isCollected = (docName: string, fileNames: string[]): boolean => {
    const docLower = docName.toLowerCase();
    return fileNames.some((fileName) => {
      const fileLower = fileName.toLowerCase();

      // AP Invoice Register / Customer Invoice Register / AR Sales Register
      if (docLower.includes('invoice') || docLower.includes('sales register')) {
        return (
          fileLower.includes('invoice') ||
          fileLower.includes('sales') ||
          fileLower.includes('register') ||
          fileLower.includes('ap') ||
          fileLower.includes('ar')
        );
      }

      // Supplier Master Database / Customer Master List / Vendor/Customer Masters
      if (docLower.includes('master') || docLower.includes('vendor/customer')) {
        return (
          fileLower.includes('master') ||
          fileLower.includes('vendor') ||
          fileLower.includes('customer') ||
          fileLower.includes('supplier')
        );
      }

      // Purchase Orders List
      if (docLower.includes('purchase') || docLower.includes('po')) {
        return (
          fileLower.includes('purchase') ||
          fileLower.includes('order') ||
          fileLower.includes('po')
        );
      }

      // Payment Transaction Log / Cash Receipts Journal / Payment/Receipt Ledgers
      if (
        docLower.includes('payment') ||
        docLower.includes('receipt') ||
        docLower.includes('ledger') ||
        docLower.includes('journal')
      ) {
        return (
          fileLower.includes('payment') ||
          fileLower.includes('receipt') ||
          fileLower.includes('ledger') ||
          fileLower.includes('journal') ||
          fileLower.includes('cash') ||
          fileLower.includes('transaction')
        );
      }

      // Goods Receipt Notes / Delivery Dispatch Notes
      if (
        docLower.includes('goods') ||
        docLower.includes('dispatch') ||
        docLower.includes('delivery')
      ) {
        return (
          fileLower.includes('goods') ||
          fileLower.includes('receipt') ||
          fileLower.includes('grn') ||
          fileLower.includes('dispatch') ||
          fileLower.includes('delivery')
        );
      }

      // GSTR-2B Tax Filings
      if (docLower.includes('tax') || docLower.includes('gstr')) {
        return (
          fileLower.includes('tax') ||
          fileLower.includes('gst') ||
          fileLower.includes('gstr')
        );
      }

      return false;
    });
  };

  const renderItem = (name: string, isOptional: boolean) => {
    const collected = isCollected(name, uploadedFileNames);

    return (
      <div key={name} className={classNames(styles.item, collected && styles.itemCollected)}>
        {collected ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.checkboxIconChecked} aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="var(--color-primary-subtle)" />
            <polyline points="9 11 12 14 20 6" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.checkboxIcon} aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        )}
        <div className={styles.itemContent}>
          <span className={styles.itemName}>
            {name} {isOptional && <span className={styles.optionalTag}>(Optional)</span>}
          </span>
          <span className={classNames(styles.statusBadge, collected ? styles.badgeCollected : styles.badgePending)}>
            {collected ? 'Collected' : 'Pending'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Required Financial Sheets</h4>
        <div className={styles.list}>{required.map((name) => renderItem(name, false))}</div>
      </div>
      {optional.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Optional Supplementary Sheets</h4>
          <div className={styles.list}>{optional.map((name) => renderItem(name, true))}</div>
        </div>
      )}
    </div>
  );
};
