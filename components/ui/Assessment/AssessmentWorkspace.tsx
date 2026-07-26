'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Button, Link } from '@/components/ui';
import { AssessmentConversation, ConversationItem } from './AssessmentConversation';
import { AssessmentOptionCard } from './AssessmentOptionCard';
import styles from './AssessmentWorkspace.module.css';

export const AssessmentWorkspace: React.FC = () => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Maintain selected option ID and data-driven chat state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [items, setItems] = useState<ConversationItem[]>([]);

  // Selection list definition
  const options = [
    { id: 'revenue', title: 'Revenue Recovery' },
    { id: 'cost', title: 'Cost Recovery' },
    { id: 'full', title: 'Full Financial Recovery' },
    { id: 'help', title: 'Not Sure (Help Me Decide)' },
  ];

  // Handle conversation auto-scroll only when a new item is added to the tail of the timeline
  const lastItemId = items[items.length - 1]?.id;
  const prevLastItemIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (lastItemId && lastItemId !== prevLastItemIdRef.current) {
      setTimeout(() => {
        if (lastItemId.startsWith('ai-summary-card')) {
          const element = document.getElementById(lastItemId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    }
    prevLastItemIdRef.current = lastItemId;
  }, [lastItemId]);

  const handleExit = () => {
    router.push('/');
  };

  const handleSelectOption = (optionId: string) => {
    // 1. Check if handling file upload completion lock
    if (optionId === 'upload-complete') {
      const updatedItems = items.map((item) => {
        if (item.type === 'upload') {
          return {
            ...item,
            metadata: {
              ...item.metadata,
              selectedId: 'completed',
            },
          };
        }
        return item;
      });

      // AI Begins Validation message
      const aiValidationMsg: ConversationItem = {
        id: `ai-val-start-${Date.now()}`,
        role: 'assistant',
        type: 'text',
        content: `Thank you. Your financial documents have been received.

I'm now validating your uploaded documents and extracting key business information required to begin the assessment.`,
      };

      // Validation progress bar timeline item
      const validationProgressMsg: ConversationItem = {
        id: `ai-val-progress-${Date.now()}`,
        role: 'assistant',
        type: 'progress',
      };

      setItems([...updatedItems, aiValidationMsg, validationProgressMsg]);
      return;
    }

    // 2. Check if validation progress completed successfully
    if (optionId === 'progress-complete') {
      // Filter out the validation progress item to keep history clean
      const updatedItems = items.filter((item) => item.type !== 'progress');

      // AI Validation Complete message
      const aiValidationCompleteMsg: ConversationItem = {
        id: `ai-val-complete-${Date.now()}`,
        role: 'assistant',
        type: 'text',
        content: `Validation completed successfully.

I've identified your uploaded financial documents and extracted your organization profile.`,
      };

      // Extracted Profile Card timeline item
      const profileCardMsg: ConversationItem = {
        id: `ai-profile-card-${Date.now()}`,
        role: 'assistant',
        type: 'profile',
        metadata: {
          selectedId: null,
        },
      };

      setItems([...updatedItems, aiValidationCompleteMsg, profileCardMsg]);
      return;
    }

    // 3. Check if user confirmed the profile card information
    if (optionId === 'profile-confirm') {
      // Lock the profile card
      const updatedItems = items.map((item) => {
        if (item.type === 'profile') {
          return {
            ...item,
            metadata: {
              ...item.metadata,
              selectedId: 'completed',
            },
          };
        }
        return item;
      });

      // User confirmation message
      const userConfirmMsg: ConversationItem = {
        id: `user-profile-confirm-${Date.now()}`,
        role: 'user',
        type: 'text',
        content: 'Confirm Organization Information',
      };

      // AI message starting analysis
      const aiStartAnalysisMsg: ConversationItem = {
        id: `ai-start-analysis-${Date.now()}`,
        role: 'assistant',
        type: 'text',
        content: `Thank you. Your organization profile has been confirmed.

I'm now analyzing your financial records to identify recovery opportunities, financial leakages, and optimization opportunities.`,
      };

      // Analysis progress timeline item
      const analysisProgressMsg: ConversationItem = {
        id: `ai-analysis-progress-${Date.now()}`,
        role: 'assistant',
        type: 'analysis-progress',
      };

      setItems([...updatedItems, userConfirmMsg, aiStartAnalysisMsg, analysisProgressMsg]);
      return;
    }

    // 4. Check if financial assessment progress completed successfully
    if (optionId === 'analysis-complete') {
      // Filter out the analysis progress item to keep history clean
      const updatedItems = items.filter((item) => item.type !== 'analysis-progress');

      // Summary dashboard timeline item
      const summaryCardMsg: ConversationItem = {
        id: `ai-summary-card-${Date.now()}`,
        role: 'assistant',
        type: 'summary-card',
      };

      setItems([...updatedItems, summaryCardMsg]);
      return;
    }

    // 2. Interactive Discovery Questionnaire (Help Me Decide) Flow
    if (optionId === 'help') {
      setSelectedOptionId('help');

      const userMsg: ConversationItem = {
        id: `user-choice-${Date.now()}`,
        role: 'user',
        type: 'text',
        content: 'Not Sure (Help Me Decide)',
      };

      const introMsg: ConversationItem = {
        id: `ai-intro-${Date.now()}`,
        role: 'assistant',
        type: 'text',
        content: `Excellent choice. Let's start with a few quick questions to identify the best assessment for your business.`,
      };

      const q1Msg: ConversationItem = {
        id: 'q1-selection',
        role: 'assistant',
        type: 'selection',
        content: 'What is your primary objective today?',
        metadata: {
          options: [
            { id: 'q1-cost', title: 'Recover supplier overpayments and reduce costs' },
            { id: 'q1-revenue', title: 'Identify missed or lost revenue' },
            { id: 'q1-full', title: 'Perform a complete financial recovery review' },
          ],
          selectedId: null,
        },
      };

      setItems([userMsg, introMsg, q1Msg]);
      return;
    }

    // Handle Question 1 Answer Selection
    if (optionId.startsWith('q1-')) {
      const q1Options = [
        { id: 'q1-cost', title: 'Recover supplier overpayments and reduce costs' },
        { id: 'q1-revenue', title: 'Identify missed or lost revenue' },
        { id: 'q1-full', title: 'Perform a complete financial recovery review' },
      ];
      const selected = q1Options.find((opt) => opt.id === optionId);
      const chosenTitle = selected ? selected.title : optionId;

      const updatedItems = items.map((item) => {
        if (item.id === 'q1-selection') {
          return {
            ...item,
            metadata: { ...item.metadata, selectedId: optionId },
          };
        }
        return item;
      });

      const userMsg: ConversationItem = {
        id: `user-q1-${Date.now()}`,
        role: 'user',
        type: 'text',
        content: chosenTitle,
      };

      const q2Msg: ConversationItem = {
        id: 'q2-selection',
        role: 'assistant',
        type: 'selection',
        content: 'Which financial records do you currently have available?',
        metadata: {
          options: [
            { id: 'q2-ap', title: 'Accounts Payable (AP)' },
            { id: 'q2-ar', title: 'Accounts Receivable (AR)' },
            { id: 'q2-both', title: 'Both AP and AR' },
            { id: 'q2-unsure', title: "I'm not sure" },
          ],
          selectedId: null,
        },
      };

      setItems([...updatedItems, userMsg, q2Msg]);
      return;
    }

    // Handle Question 2 Answer Selection
    if (optionId.startsWith('q2-')) {
      const q2Options = [
        { id: 'q2-ap', title: 'Accounts Payable (AP)' },
        { id: 'q2-ar', title: 'Accounts Receivable (AR)' },
        { id: 'q2-both', title: 'Both AP and AR' },
        { id: 'q2-unsure', title: "I'm not sure" },
      ];
      const selected = q2Options.find((opt) => opt.id === optionId);
      const chosenTitle = selected ? selected.title : optionId;

      const updatedItems = items.map((item) => {
        if (item.id === 'q2-selection') {
          return {
            ...item,
            metadata: { ...item.metadata, selectedId: optionId },
          };
        }
        return item;
      });

      const userMsg: ConversationItem = {
        id: `user-q2-${Date.now()}`,
        role: 'user',
        type: 'text',
        content: chosenTitle,
      };

      const q3Msg: ConversationItem = {
        id: 'q3-selection',
        role: 'assistant',
        type: 'selection',
        content: 'Which statement best describes your current situation?',
        metadata: {
          options: [
            { id: 'q3-known', title: 'I already know where the issues are' },
            { id: 'q3-suspect', title: 'I suspect there are financial recovery opportunities but need help identifying them' },
            { id: 'q3-comprehensive', title: 'I want a comprehensive AI review of my financial data' },
          ],
          selectedId: null,
        },
      };

      setItems([...updatedItems, userMsg, q3Msg]);
      return;
    }

    // Handle Question 3 Answer Selection
    if (optionId.startsWith('q3-')) {
      const q3Options = [
        { id: 'q3-known', title: 'I already know where the issues are' },
        { id: 'q3-suspect', title: 'I suspect there are financial recovery opportunities but need help identifying them' },
        { id: 'q3-comprehensive', title: 'I want a comprehensive AI review of my financial data' },
      ];
      const selected = q3Options.find((opt) => opt.id === optionId);
      const chosenTitle = selected ? selected.title : optionId;

      const updatedItems = items.map((item) => {
        if (item.id === 'q3-selection') {
          return {
            ...item,
            metadata: { ...item.metadata, selectedId: optionId },
          };
        }
        return item;
      });

      const userMsg: ConversationItem = {
        id: `user-q3-${Date.now()}`,
        role: 'user',
        type: 'text',
        content: chosenTitle,
      };

      // Retrieve responses to form recommended category
      let q1Ans = '';
      let q2Ans = '';
      updatedItems.forEach((item) => {
        if (item.id === 'q1-selection') q1Ans = item.metadata.selectedId || '';
        if (item.id === 'q2-selection') q2Ans = item.metadata.selectedId || '';
      });

      let recommended = 'cost'; // Default fallback
      if (q1Ans === 'q1-revenue' || q2Ans === 'q2-ar') {
        recommended = 'revenue';
      } else if (q1Ans === 'q1-full' || q2Ans === 'q2-both' || optionId === 'q3-comprehensive') {
        recommended = 'full';
      }

      let recommendationContent = '';
      if (recommended === 'cost') {
        recommendationContent = `Based on your responses, I recommend starting with a **Cost Recovery Assessment**.

Your objectives and available financial data indicate that this assessment is the best starting point for identifying supplier overpayments, duplicate payments, pricing discrepancies, and other cost recovery opportunities.`;
      } else if (recommended === 'revenue') {
        recommendationContent = `Based on your responses, I recommend starting with a **Revenue Recovery Assessment**.

Your objectives and available financial data indicate that this assessment is the best starting point for identifying billing leakages, forgotten customer credits, unbilled deliveries, and customer over-discounts.`;
      } else {
        recommendationContent = `Based on your responses, I recommend starting with a **Full Financial Recovery Assessment**.

Your objectives and available financial data indicate that a comprehensive review of both accounts payable and receivable is the best starting point for identifying duplicate transactions, pricing deviations, tax matching mismatches, and credit recovery opportunities.`;
      }

      const recMsg: ConversationItem = {
        id: `ai-rec-${Date.now()}`,
        role: 'assistant',
        type: 'text',
        content: recommendationContent,
      };

      const continueMsg: ConversationItem = {
        id: 'recommend-continue-selection',
        role: 'assistant',
        type: 'selection',
        metadata: {
          options: [
            { id: `rec-continue:${recommended}`, title: 'Continue with Recommended Assessment' },
          ],
          selectedId: null,
        },
      };

      setItems([...updatedItems, userMsg, recMsg, continueMsg]);
      return;
    }

    // Handle Recommendation Accept Flow
    if (optionId.startsWith('rec-continue:')) {
      const recommendedType = optionId.split(':')[1];

      const updatedItems = items.map((item) => {
        if (item.id === 'recommend-continue-selection') {
          return {
            ...item,
            metadata: { ...item.metadata, selectedId: optionId },
          };
        }
        return item;
      });

      const userMsg: ConversationItem = {
        id: `user-rec-continue-${Date.now()}`,
        role: 'user',
        type: 'text',
        content: 'Continue with Recommended Assessment',
      };

      let followUpContent = '';
      if (recommendedType === 'cost') {
        followUpContent = `Excellent choice.

For a Cost Recovery Assessment, we require your core accounts payable and supplier transaction records. These files will allow me to review your organization's financial transactions to pinpoint duplicate payments, supplier overpayments, pricing discrepancies, and tax recovery opportunities.

Once you upload the files, I will automatically validate them to ensure they contain all necessary fields before beginning the recovery audit.`;
      } else if (recommendedType === 'revenue') {
        followUpContent = `Excellent choice.

For a Revenue Recovery Assessment, we require your customer billing ledgers and sales registers. These files will allow me to review your customer-facing transactions to detect duplicate invoices, unbilled deliveries, unclaimed credits, and gross margin leakages.

Once you upload the files, I will automatically validate them to ensure they contain all necessary fields before beginning the recovery audit.`;
      } else {
        followUpContent = `Excellent choice.

For a Full Financial Recovery Assessment, we require a comprehensive set of vendor payables, sales ledgers, and tax compliance registers. These files will allow me to review both cost and revenue sides of your organization's financial transactions to identify duplicate billing, pricing variances, and uncollected credits.

Once you upload the files, I will automatically validate them to ensure they contain all necessary fields before beginning the recovery audit.`;
      }

      const aiMessage: ConversationItem = {
        id: `ai-response-${Date.now()}`,
        role: 'assistant',
        type: 'text',
        content: followUpContent,
      };

      const uploadMessage: ConversationItem = {
        id: `ai-upload-${Date.now()}`,
        role: 'assistant',
        type: 'upload',
        metadata: {
          assessmentType: recommendedType,
          selectedId: null,
        },
      };

      setItems([...updatedItems, userMsg, aiMessage, uploadMessage]);
      return;
    }

    // 3. Standard Selection flow (Cost / Revenue / Full)
    if (selectedOptionId !== null) return;
    setSelectedOptionId(optionId);

    const selectedOption = options.find((opt) => opt.id === optionId);
    const optionTitle = selectedOption ? selectedOption.title : optionId;

    const userMessage: ConversationItem = {
      id: `user-choice-${Date.now()}`,
      role: 'user',
      type: 'text',
      content: optionTitle,
    };

    let followUpContent = '';
    if (optionId === 'cost') {
      followUpContent = `Excellent choice.

For a Cost Recovery Assessment, we require your core accounts payable and supplier transaction records. These files will allow me to review your organization's financial transactions to pinpoint duplicate payments, supplier overpayments, pricing discrepancies, and tax recovery opportunities.

Once you upload the files, I will automatically validate them to ensure they contain all necessary fields before beginning the recovery audit.`;
    } else if (optionId === 'revenue') {
      followUpContent = `Excellent choice.

For a Revenue Recovery Assessment, we require your customer billing ledgers and sales registers. These files will allow me to review your customer-facing transactions to detect duplicate invoices, unbilled deliveries, unclaimed credits, and gross margin leakages.

Once you upload the files, I will automatically validate them to ensure they contain all necessary fields before beginning the recovery audit.`;
    } else {
      // full
      followUpContent = `Excellent choice.

For a Full Financial Recovery Assessment, we require a comprehensive set of vendor payables, sales ledgers, and tax compliance registers. These files will allow me to review both cost and revenue sides of your organization's financial transactions to identify duplicate billing, pricing variances, and uncollected credits.

Once you upload the files, I will automatically validate them to ensure they contain all necessary fields before beginning the recovery audit.`;
    }

    const aiMessage: ConversationItem = {
      id: `ai-response-${Date.now()}`,
      role: 'assistant',
      type: 'text',
      content: followUpContent,
    };

    const uploadMessage: ConversationItem = {
      id: `ai-upload-${Date.now()}`,
      role: 'assistant',
      type: 'upload',
      metadata: {
        assessmentType: optionId,
        selectedId: null,
      },
    };

    setItems([userMessage, aiMessage, uploadMessage]);
  };

  return (
    <div className={styles.workspaceWrapper}>
      {/* HEADER */}
      <header className={styles.header}>
        <Container className={styles.headerContainer}>
          <div className={styles.brandBlock}>
            <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 815.71 212.04" className={styles.brandLogoSvg} aria-label="DARP Logo">
              <defs>
                <style>
                  {`
                    .cls-1 { fill: #35bc48; }
                    .cls-2 { fill: #0f172a; }
                  `}
                </style>
              </defs>
              <g id="Layer_1-2" data-name="Layer 1">
                <g>
                  <path className="cls-2" d="M392.79,64.63c-6.07-11.61-14.76-20.55-26.06-26.79-11.31-6.25-24.81-9.37-40.52-9.37h-55.79v155.97h55.27c15.84,0,29.45-3.12,40.83-9.37,11.37-6.24,20.11-15.19,26.22-26.85,6.11-11.65,9.16-25.61,9.16-41.87s-3.04-30.1-9.11-41.72ZM364.06,134.77c-3.39,7.37-8.41,12.77-15.08,16.23-6.66,3.45-14.91,5.18-24.75,5.18h-20.94V56.73h21.04c9.77,0,17.99,1.73,24.65,5.18,6.67,3.46,11.69,8.85,15.08,16.18,3.38,7.32,5.07,16.75,5.07,28.26s-1.69,21.06-5.07,28.42Z"/>
                  <path className="cls-2" d="M499.15,28.47h-42.5l-53.81,155.97h35.28l11.57-35.59h56.42l11.57,35.59h35.17l-53.7-155.97ZM458.07,123.1l19.2-59.04h1.26l19.2,59.04h-39.66Z"/>
                  <path className="cls-2" d="M654.35,123.91c.49-.21.98-.43,1.46-.65,8.48-3.95,14.95-9.65,19.41-17.12,4.47-7.47,6.7-16.36,6.7-26.69s-2.21-19.32-6.64-26.96c-4.44-7.64-10.82-13.55-19.16-17.74-8.34-4.19-18.41-6.28-30.2-6.28h-61.45v155.97h32.87v-55.27h24.11l29.59,55.27h36.43l-33.12-60.53ZM597.34,55.48h22.3c6.35,0,11.62.92,15.81,2.77,4.18,1.85,7.31,4.54,9.36,8.06,2.06,3.52,3.09,7.9,3.09,13.14s-1.03,9.45-3.09,12.87c-2.05,3.42-5.16,6.01-9.31,7.75-4.16,1.74-9.41,2.62-15.76,2.62h-22.4v-47.21Z"/>
                  <path className="cls-2" d="M809.06,53.9c-4.43-7.95-10.82-14.18-19.16-18.68-8.34-4.5-18.4-6.75-30.2-6.75h-61.45v155.97h32.87v-50.56h27.75c12,0,22.24-2.21,30.72-6.65,8.48-4.43,14.95-10.58,19.42-18.47,4.46-7.89,6.7-16.99,6.7-27.32s-2.22-19.58-6.65-27.54ZM778.6,94.94c-2.06,3.91-5.17,6.98-9.32,9.21-4.15,2.24-9.4,3.35-15.75,3.35h-22.41v-52.02h22.3c6.35,0,11.62,1.08,15.81,3.24s7.31,5.18,9.37,9.06c2.06,3.87,3.09,8.42,3.09,13.66s-1.03,9.59-3.09,13.5Z"/>
                </g>
                <rect className="cls-2" x="2.44" y="24.82" width="88.2" height="43.42" transform="translate(46.53 112.34) rotate(-135)"/>
                <rect className="cls-2" x="121.41" y="143.8" width="88.2" height="43.42" transform="translate(165.51 399.57) rotate(-135)"/>
                <rect className="cls-2" x="3.39" y="143.8" width="88.2" height="43.42" transform="translate(198.11 248.95) rotate(135)"/>
                <rect className="cls-1" x="122.37" y="24.82" width="88.2" height="43.42" transform="translate(317.08 -38.27) rotate(135)"/>
              </g>
            </svg>
            <span className={styles.brandSubtext}>Discover • Assess • Recover • Prevent</span>
          </div>
          <Button variant="outline" size="md" onClick={handleExit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true" style={{ marginRight: '6px' }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Exit Workspace
          </Button>
        </Container>
      </header>

      {/* CHAT AREA */}
      <main className={styles.chatArea}>
        <Container className={styles.chatContainer}>
          {/* Workspace Introduction Header */}
          <div className={styles.introBlock}>
            <h1 className={styles.introTitle}>Financial Recovery Assessment</h1>
            <p className={styles.introDesc}>
              Configure your AI-powered financial recovery assessment through a guided conversation.
            </p>
          </div>

          {/* Centered Workspace Panel Wrap */}
          <div className={styles.workspacePanel}>
            {/* Inner Workspace Header */}
            <div className={styles.panelHeader}>
              <div className={styles.panelHeaderTitleGroup}>
                <h2 className={styles.panelHeaderTitle}>DARP AI Assistant</h2>
                <span className={styles.panelHeaderSubtitle}>Enterprise Financial Assessment</span>
              </div>
              <div className={styles.panelHeaderRightGroup}>
                <span className={styles.panelHeaderSession}>Assessment Session</span>
                <span className={styles.panelHeaderMeta}>Started Today</span>
              </div>
            </div>

            <hr className={styles.panelHeaderDivider} />

            {/* Centered Welcome State Block - Permanent Introduction */}
            <div className={styles.welcomeSection}>
              <div className={styles.welcomeAvatar} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" y1="16" x2="8" y2="16.01" />
                  <line x1="16" y1="16" x2="16" y2="16.01" />
                </svg>
              </div>
              
              <h2 className={styles.welcomeHeading}>Welcome to DARP</h2>
              <div className={styles.welcomeSubheading}>Your AI Financial Recovery Assistant</div>
              
              <p className={styles.welcomeDesc}>
                I'll guide you through a short assessment to identify financial recovery opportunities for your organization.
              </p>
              <p className={styles.welcomePrompt}>
                Let's begin by selecting what you'd like to assess today.
              </p>

              {/* Centered Compact Option Actions */}
              <div className={styles.welcomeActions}>
                {options.map((opt) => (
                  <AssessmentOptionCard
                    key={opt.id}
                    id={opt.id}
                    title={opt.title}
                    selected={selectedOptionId === opt.id}
                    disabled={selectedOptionId !== null}
                    onClick={() => handleSelectOption(opt.id)}
                  />
                ))}
              </div>
            </div>

            {/* Conversation Timeline Stream - Renders below Welcome section once a selection is made */}
            {selectedOptionId !== null && (
              <div className={styles.conversationStream}>
                <hr className={styles.welcomeDivider} />
                <div className={styles.conversationWrapper}>
                  <AssessmentConversation
                    items={items}
                    onSelectOption={handleSelectOption}
                  />
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </div>
        </Container>
      </main>

      {/* MINIMAL ENTERPRISE FOOTER */}
      <footer className={styles.footer}>
        <Container className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <span>DARP Enterprise v2</span>
            <span>(v2.0.0)</span>
          </div>
          <div className={styles.footerRight}>
            <Link href="#privacy" underline="hover">Privacy</Link>
            <span>•</span>
            <Link href="#terms" underline="hover">Terms</Link>
            <span>•</span>
            <Link href="#support" underline="hover">Support</Link>
          </div>
        </Container>
      </footer>
    </div>
  );
};
