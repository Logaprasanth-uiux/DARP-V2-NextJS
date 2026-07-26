import React from 'react';
import styles from './UploadedFileList.module.css';

export interface UploadedFileListProps {
  files: File[];
  onRemoveFile?: (index: number) => void;
  disabled?: boolean;
}

export const UploadedFileList: React.FC<UploadedFileListProps> = ({
  files,
  onRemoveFile,
  disabled = false,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Uploaded Files</h4>
      <div className={styles.list}>
        {files.map((file, idx) => {
          const extension = file.name.split('.').pop()?.toUpperCase() || 'FILE';

          return (
            <div key={`${file.name}-${idx}`} className={styles.fileRow}>
              <div className={styles.fileLeft}>
                {/* Document Icon */}
                <div className={styles.docIconWrapper}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.docIcon} aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileMeta}>
                    {extension} • {formatFileSize(file.size)}
                  </span>
                </div>
              </div>

              <div className={styles.fileRight}>
                <div className={styles.statusLabel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.checkIcon} aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className={styles.statusText}>Uploaded</span>
                </div>
                {!disabled && onRemoveFile && (
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => onRemoveFile(idx)}
                    aria-label={`Remove file ${file.name}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
