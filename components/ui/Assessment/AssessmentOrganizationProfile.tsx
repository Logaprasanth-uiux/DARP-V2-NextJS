import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { classNames } from '@/lib/utils';
import styles from './AssessmentOrganizationProfile.module.css';

export interface ProfileData {
  companyName: string;
  taxReg: string;
  country: string;
  financialYear: string;
  currency: string;
}

export interface AssessmentOrganizationProfileProps {
  selectedId: string | null;
  onConfirm: (data: ProfileData) => void;
}

export const AssessmentOrganizationProfile: React.FC<AssessmentOrganizationProfileProps> = ({
  selectedId,
  onConfirm,
}) => {
  const [profile, setProfile] = useState<ProfileData>({
    companyName: 'Acme Corporation Ltd',
    taxReg: '27AAACA1234A1Z5',
    country: 'India',
    financialYear: 'FY 2025-26',
    currency: 'INR (₹)',
  });

  const [editingField, setEditingField] = useState<keyof ProfileData | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const isLocked = selectedId !== null;

  const handleEditClick = (field: keyof ProfileData) => {
    if (isLocked) return;
    setEditingField(field);
    setEditValue(profile[field]);
  };

  const handleSave = (field: keyof ProfileData) => {
    setProfile((prev) => ({
      ...prev,
      [field]: editValue.trim(),
    }));
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: keyof ProfileData) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(field);
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const fields: { key: keyof ProfileData; label: string }[] = [
    { key: 'companyName', label: 'Company Name' },
    { key: 'taxReg', label: 'GST / Tax Registration Number' },
    { key: 'country', label: 'Country' },
    { key: 'financialYear', label: 'Financial Year' },
    { key: 'currency', label: 'Currency' },
  ];

  return (
    <div className={styles.profileCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Extracted Organization Information</h3>
        <p className={styles.cardDesc}>
          The following information has been extracted from your uploaded financial documents. Please verify that it is correct before continuing.
        </p>
      </div>

      <div className={styles.fieldsGrid}>
        {fields.map(({ key, label }) => {
          const isEditing = editingField === key;
          const displayValue = profile[key];

          return (
            <div key={key} className={classNames(styles.row, isEditing && styles.rowEditing)}>
              <div className={styles.rowLabelGroup}>
                <span className={styles.fieldLabel}>{label}</span>
              </div>
              
              <div className={styles.rowValueGroup}>
                {isEditing ? (
                  <div className={styles.editInputWrapper}>
                    <input
                      type="text"
                      className={styles.editInput}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, key)}
                      autoFocus
                    />
                    <div className={styles.editActions}>
                      <button
                        type="button"
                        className={styles.saveBtn}
                        onClick={() => handleSave(key)}
                        aria-label={`Save ${label}`}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={handleCancel}
                        aria-label={`Cancel editing ${label}`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.staticValueWrapper}>
                    <span className={styles.fieldValue}>{displayValue}</span>
                    {!isLocked && (
                      <button
                        type="button"
                        className={styles.editLinkBtn}
                        onClick={() => handleEditClick(key)}
                        aria-label={`Edit ${label}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.editIcon} aria-hidden="true">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isLocked ? (
        <div className={styles.actionsRow}>
          <Button
            variant="primary"
            size="md"
            onClick={() => onConfirm(profile)}
            disabled={editingField !== null}
          >
            Confirm Organization Information
          </Button>
        </div>
      ) : (
        <div className={styles.profileConfirmedBanner}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.bannerIcon} aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div className={styles.bannerTextGroup}>
            <span className={styles.bannerTitle}>Organization Profile Confirmed</span>
            <span className={styles.bannerSub}>Details locked and saved into the assessment workspace.</span>
          </div>
        </div>
      )}
    </div>
  );
};
