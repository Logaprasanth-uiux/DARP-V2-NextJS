import React from 'react';
import { AssessmentChatMessage } from './AssessmentChatMessage';
import { AssessmentOptionCard } from './AssessmentOptionCard';
import { AssessmentDocumentUpload } from './AssessmentDocumentUpload';
import { AssessmentValidationProgress } from './AssessmentValidationProgress';
import { AssessmentOrganizationProfile } from './AssessmentOrganizationProfile';
import { AssessmentAnalysisProgress } from './AssessmentAnalysisProgress';
import { RecoverySummaryCard } from './RecoverySummaryCard';
import styles from './AssessmentConversation.module.css';

export interface ConversationItem {
  id: string;
  role: 'assistant' | 'user' | 'system';
  type: 'text' | 'selection' | 'upload' | 'summary' | 'progress' | 'results' | 'profile' | 'analysis-progress' | 'summary-card';
  content?: string;
  metadata?: any;
}

interface AssessmentConversationProps {
  items: ConversationItem[];
  onSelectOption: (optionId: string) => void;
}

export const AssessmentConversation: React.FC<AssessmentConversationProps> = ({
  items,
  onSelectOption,
}) => {
  return (
    <div className={styles.conversation}>
      {items.map((item) => {
        if (item.type === 'text') {
          return (
            <AssessmentChatMessage id={item.id} key={item.id} role={item.role}>
              {item.content}
            </AssessmentChatMessage>
          );
        }

        if (item.type === 'selection') {
          const { options, selectedId } = item.metadata || {};
          const isLocked = selectedId !== null;

          return (
            <AssessmentChatMessage key={item.id} role={item.role}>
              {item.content && <p className={styles.selectionPrompt}>{item.content}</p>}
              <div className={styles.optionsFlex}>
                {options.map((opt: any) => (
                  <AssessmentOptionCard
                    key={opt.id}
                    id={opt.id}
                    title={opt.title}
                    selected={selectedId === opt.id}
                    disabled={isLocked}
                    onClick={() => onSelectOption(opt.id)}
                  />
                ))}
              </div>
            </AssessmentChatMessage>
          );
        }

        if (item.type === 'upload') {
          const { assessmentType, selectedId } = item.metadata || {};

          return (
            <AssessmentChatMessage key={item.id} role={item.role}>
              <AssessmentDocumentUpload
                assessmentType={assessmentType}
                selectedId={selectedId}
                onUploadComplete={() => onSelectOption('upload-complete')}
              />
            </AssessmentChatMessage>
          );
        }

        if (item.type === 'progress') {
          return (
            <AssessmentChatMessage key={item.id} role={item.role}>
              <AssessmentValidationProgress
                onComplete={() => onSelectOption('progress-complete')}
              />
            </AssessmentChatMessage>
          );
        }

        if (item.type === 'profile') {
          const { selectedId } = item.metadata || {};

          return (
            <AssessmentChatMessage key={item.id} role={item.role}>
              <AssessmentOrganizationProfile
                selectedId={selectedId}
                onConfirm={() => onSelectOption('profile-confirm')}
              />
            </AssessmentChatMessage>
          );
        }

        if (item.type === 'analysis-progress') {
          return (
            <AssessmentChatMessage key={item.id} role={item.role}>
              <AssessmentAnalysisProgress
                onComplete={() => onSelectOption('analysis-complete')}
              />
            </AssessmentChatMessage>
          );
        }

        if (item.type === 'summary-card') {
          return (
            <AssessmentChatMessage id={item.id} key={item.id} role={item.role}>
              <RecoverySummaryCard />
            </AssessmentChatMessage>
          );
        }

        return null;
      })}
    </div>
  );
};
