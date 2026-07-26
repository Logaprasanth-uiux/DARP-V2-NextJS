import React, { useState } from 'react';
import { AssessmentUploadZone } from './AssessmentUploadZone';
import { RequiredDocumentChecklist } from './RequiredDocumentChecklist';
import { UploadedFileList } from './UploadedFileList';
import { Button } from '@/components/ui';
import styles from './AssessmentDocumentUpload.module.css';

export interface AssessmentDocumentUploadProps {
  assessmentType: string;
  selectedId: string | null;
  onUploadComplete: (files: File[]) => void;
}

export const AssessmentDocumentUpload: React.FC<AssessmentDocumentUploadProps> = ({
  assessmentType,
  selectedId,
  onUploadComplete,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const isLocked = selectedId !== null;

  const handleFilesSelected = (newFiles: File[]) => {
    if (isLocked) return;
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (idx: number) => {
    if (isLocked) return;
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCompleteUpload = () => {
    if (files.length === 0 || isLocked) return;
    onUploadComplete(files);
  };

  return (
    <div className={styles.workspaceCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Financial Documents</h3>
        <p className={styles.cardDesc}>
          Upload all available documents together. You can drag and drop multiple files or browse your computer.
        </p>
      </div>

      <div className={styles.cardGrid}>
        {/* Left Column: Upload DropZone and List */}
        <div className={styles.leftCol}>
          {!isLocked ? (
            <AssessmentUploadZone
              onFilesSelected={handleFilesSelected}
              disabled={isLocked}
            />
          ) : (
            <div className={styles.uploadSuccessBanner}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.bannerIcon} aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div className={styles.bannerTextGroup}>
                <span className={styles.bannerTitle}>Document Collection Locked</span>
                <span className={styles.bannerSub}>Files have been uploaded and queued for validation.</span>
              </div>
            </div>
          )}

          {files.length > 0 && (
            <UploadedFileList
              files={files}
              onRemoveFile={handleRemoveFile}
              disabled={isLocked}
            />
          )}

          {files.length > 0 && !isLocked && (
            <div className={styles.actionsRow}>
              <Button variant="primary" size="md" onClick={handleCompleteUpload}>
                Complete Document Upload
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Checklists */}
        <div className={styles.rightCol}>
          <RequiredDocumentChecklist
            assessmentType={assessmentType}
            uploadedFileNames={files.map((f) => f.name)}
          />
        </div>
      </div>
    </div>
  );
};
