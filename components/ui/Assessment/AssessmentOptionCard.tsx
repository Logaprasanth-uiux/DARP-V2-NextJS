import React from 'react';
import { classNames } from '@/lib/utils';
import styles from './AssessmentOptionCard.module.css';

export interface AssessmentOptionCardProps {
  id: string;
  title: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const AssessmentOptionCard: React.FC<AssessmentOptionCardProps> = ({
  title,
  selected,
  disabled,
  onClick,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-selected={selected}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={classNames(
        styles.pill,
        selected && styles.selected,
        disabled && styles.disabled
      )}
    >
      {title}
    </button>
  );
};
