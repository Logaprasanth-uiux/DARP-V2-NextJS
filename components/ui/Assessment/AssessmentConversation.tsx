import React from 'react';
import { AssessmentChatMessage } from './AssessmentChatMessage';
import { AssessmentOptionCard } from './AssessmentOptionCard';
import styles from './AssessmentConversation.module.css';

export interface ConversationItem {
  id: string;
  role: 'assistant' | 'user' | 'system';
  type: 'text' | 'selection' | 'upload' | 'summary' | 'progress' | 'results';
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
            <AssessmentChatMessage key={item.id} role={item.role}>
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

        return null;
      })}
    </div>
  );
};
