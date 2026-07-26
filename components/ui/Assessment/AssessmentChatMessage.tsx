import React from 'react';
import { classNames } from '@/lib/utils';
import styles from './AssessmentChatMessage.module.css';

export interface AssessmentChatMessageProps {
  role: 'assistant' | 'user' | 'system';
  children: React.ReactNode;
}

export const AssessmentChatMessage: React.FC<AssessmentChatMessageProps> = ({
  role,
  children,
}) => {
  const isAssistant = role === 'assistant';
  const isUser = role === 'user';

  if (role === 'system') {
    return (
      <div className={styles.systemContainer}>
        {children}
      </div>
    );
  }

  // Symmetrical vector avatars for AI and User
  const renderAvatar = () => {
    if (isAssistant) {
      return (
        <div className={styles.avatarAi} aria-hidden="true" title="DARP AI Assistant">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className={styles.avatarIcon}>
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8" y2="16.01" />
            <line x1="16" y1="16" x2="16" y2="16.01" />
          </svg>
        </div>
      );
    }
    if (isUser) {
      return (
        <div className={styles.avatarUser} aria-hidden="true" title="User">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className={styles.avatarIcon}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={classNames(
      styles.messageRow,
      isAssistant ? styles.assistantRow : styles.userRow
    )}>
      {isAssistant && renderAvatar()}
      <div className={classNames(
        styles.bubble,
        isAssistant ? styles.assistantBubble : styles.userBubble
      )}>
        {children}
      </div>
      {isUser && renderAvatar()}
    </div>
  );
};
