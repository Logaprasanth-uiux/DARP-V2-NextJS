import React, { useRef, useState } from 'react';
import { classNames } from '@/lib/utils';
import styles from './AssessmentUploadZone.module.css';

export interface AssessmentUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const AssessmentUploadZone: React.FC<AssessmentUploadZoneProps> = ({
  onFilesSelected,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleBrowseClick();
    }
  };

  return (
    <div
      className={classNames(
        styles.dropZone,
        isDragActive && styles.dragActive,
        disabled && styles.disabled
      )}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      aria-label="Upload financial documents. Drag and drop files here, or select browse to choose."
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".csv, .xlsx, .xls, .pdf"
        className={styles.hiddenInput}
        onChange={handleFileChange}
        disabled={disabled}
      />
      <div className={styles.iconWrapper}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.uploadIcon} aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <div className={styles.textWrapper}>
        <p className={styles.mainText}>
          Drag and drop multiple files here, or{' '}
          <button
            type="button"
            className={styles.browseButton}
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
            disabled={disabled}
          >
            Select Financial Documents
          </button>
        </p>
        <p className={styles.subText}>Excel, CSV, or PDF files are supported</p>
      </div>
    </div>
  );
};
