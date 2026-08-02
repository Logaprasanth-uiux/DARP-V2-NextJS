'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Container,
} from '@/components/ui';
import styles from './page.module.css';

// Predefined welcome messages for future rotation capability
const welcomeMessage = {
  headline: "How can DARP help recover your revenue today?",
  description: "Describe your financial recovery challenge and our AI will identify opportunities, risks, and recommended actions."
};

interface MessageBlock {
  id: string;
  role: 'user' | 'assistant';
  type: 'text' | 'document_request' | 'processing_indicator' | 'executive_assessment' | 'recommended_documents' | 'enterprise_alert';
  content?: string;
  documents?: {
    id: string;
    name: string;
    description: string;
    optional?: boolean;
  }[];
}

interface DocumentUploadState {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'uploading' | 'uploaded' | 'validating' | 'validated';
  progress: number;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  confidenceScore?: number;
  error?: string;
}

export default function Demo2WorkspacePage() {
  const router = useRouter();
  const [isTransitioned, setIsTransitioned] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [conversation, setConversation] = useState<MessageBlock[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const assessmentCardRef = useRef<HTMLDivElement>(null);
  const [reconcile1Started, setReconcile1Started] = useState(false);
  const [reconcile2Started, setReconcile2Started] = useState(false);

  const [uploadStates, setUploadStates] = useState<Record<string, DocumentUploadState>>({
    'bank-statements': {
      id: 'bank-statements',
      name: 'Bank Statements',
      description: 'Last 6 months',
      status: 'idle',
      progress: 0
    },
    'ar-report': {
      id: 'ar-report',
      name: 'Accounts Receivable Report',
      description: 'Customer receivables',
      status: 'idle',
      progress: 0
    },
    'ap-ledger': {
      id: 'ap-ledger',
      name: 'Accounts Payable Ledger',
      description: 'Vendor payables',
      status: 'idle',
      progress: 0
    },
    'gst-returns': {
      id: 'gst-returns',
      name: 'GST / Tax Returns',
      description: 'Latest GST filings',
      status: 'idle',
      progress: 0
    },
    'sales-register': {
      id: 'sales-register',
      name: 'Sales Register',
      description: 'Sales transaction records',
      status: 'idle',
      progress: 0
    },
    'customer-ledger': {
      id: 'customer-ledger',
      name: 'Customer Ledger',
      description: 'Customer outstanding balances',
      status: 'idle',
      progress: 0
    }
  });

  // Auto scroll to the bottom when the conversation changes
  useEffect(() => {
    if (chatScrollRef.current) {
      if (conversation.length > 3) {
        setTimeout(() => {
          if (chatScrollRef.current) {
            chatScrollRef.current.scrollTo({
              top: chatScrollRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        chatScrollRef.current.scrollTop = 0;
        // Reinforce scroll position after transition animation completes
        const timer = setTimeout(() => {
          if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = 0;
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [conversation]);

  // Trigger AI response when all documents are validated
  useEffect(() => {
    const coreDocs = ['bank-statements', 'ar-report', 'ap-ledger'];
    const allCoreValidated = coreDocs.every(id => uploadStates[id].status === 'validated');
    
    if (allCoreValidated && isTransitioned && !reconcile1Started) {
      setReconcile1Started(true);

      const aiMsgId = `ai-batch-complete-${Math.random().toString(36).substring(2, 9)}`;
      const processingMsgId = `ai-processing-${Math.random().toString(36).substring(2, 9)}`;
      const completedTextMsgId = `ai-completed-text-1-${Math.random().toString(36).substring(2, 9)}`;
      const assessmentMsgId = `ai-assessment-card-1-${Math.random().toString(36).substring(2, 9)}`;
      const recommendTextMsgId = `ai-recommend-text-${Math.random().toString(36).substring(2, 9)}`;
      const enterpriseAlertMsgId = `ai-enterprise-alert-${Math.random().toString(36).substring(2, 9)}`;
      const recommendDocsMsgId = `ai-recommend-docs-${Math.random().toString(36).substring(2, 9)}`;

      const aiMsg: MessageBlock = {
        id: aiMsgId,
        role: 'assistant',
        type: 'text',
        content: `Excellent. I now have sufficient information to perform an initial recovery assessment.`
      };

      const processingMsg: MessageBlock = {
        id: processingMsgId,
        role: 'assistant',
        type: 'processing_indicator'
      };

      setConversation(prevHistory => [...prevHistory, aiMsg]);

      // Schedule secondary processing message
      setTimeout(() => {
        setConversation(h => {
          const hasProcessing = h.some(msg => msg.id === processingMsgId);
          if (hasProcessing) return h;
          return [...h, processingMsg];
        });

        // Schedule transitioning to Executive Assessment Card after 3.5 seconds
        setTimeout(() => {
          setConversation(h => {
            // Replace the processing indicator with a finished text block, and append the assessment card
            const withoutProcessing = h.filter(msg => msg.id !== processingMsgId);
            
            // If already appended, skip
            const hasAssessment = h.some(msg => msg.id === assessmentMsgId);
            if (hasAssessment) return h;

            const completedTextMsg: MessageBlock = {
              id: completedTextMsgId,
              role: 'assistant',
              type: 'text',
              content: `✓ Analysis completed successfully.`
            };

            const assessmentMsg: MessageBlock = {
              id: assessmentMsgId,
              role: 'assistant',
              type: 'executive_assessment'
            };

            // Schedule Refinement 1: AI Recommendation After Assessment (800ms after card)
            setTimeout(() => {
              setConversation(prev => {
                const hasRecommendText = prev.some(msg => msg.id === recommendTextMsgId);
                if (hasRecommendText) return prev;

                const recommendTextMsg: MessageBlock = {
                  id: recommendTextMsgId,
                  role: 'assistant',
                  type: 'text',
                  content: `Based on the initial assessment, I identified additional recovery opportunities that require further financial validation.`
                };

                return [...prev, recommendTextMsg];
              });

              // Schedule Refinement 2: Standalone Enterprise Alert Callout (600ms after text, i.e. 1400ms after card)
              setTimeout(() => {
                setConversation(prev => {
                  const hasEnterpriseAlert = prev.some(msg => msg.id === enterpriseAlertMsgId);
                  if (hasEnterpriseAlert) return prev;

                  const enterpriseAlertMsg: MessageBlock = {
                    id: enterpriseAlertMsgId,
                    role: 'assistant',
                    type: 'enterprise_alert'
                  };

                  return [...prev, enterpriseAlertMsg];
                });

                // Schedule Refinement 3: Additional Supporting Documents request block (600ms after alert, i.e. 2000ms after card)
                setTimeout(() => {
                  setConversation(prev => {
                    const hasRecommendDocs = prev.some(msg => msg.id === recommendDocsMsgId);
                    if (hasRecommendDocs) return prev;

                    const recommendDocsMsg: MessageBlock = {
                      id: recommendDocsMsgId,
                      role: 'assistant',
                      type: 'recommended_documents',
                      documents: [
                        { id: 'gst-returns', name: 'GST / Tax Returns', description: 'Latest GST filings' },
                        { id: 'sales-register', name: 'Sales Register', description: 'Sales transaction records' },
                        { id: 'customer-ledger', name: 'Customer Ledger', description: 'Customer outstanding balances' }
                      ]
                    };

                    return [...prev, recommendDocsMsg];
                  });
                }, 600);

              }, 600);

            }, 800);

            return [...withoutProcessing, completedTextMsg, assessmentMsg];
          });
        }, 3500);

      }, 600);
    }
  }, [uploadStates, isTransitioned, reconcile1Started]);

  // Trigger second reconciliation when all recommended documents are validated
  useEffect(() => {
    const recommendedDocs = ['gst-returns', 'sales-register', 'customer-ledger'];
    const allRecommendedValidated = recommendedDocs.every(id => uploadStates[id].status === 'validated');
    
    if (allRecommendedValidated && isTransitioned && !reconcile2Started) {
      setReconcile2Started(true);

      const aiMsgId2 = `ai-second-complete-${Math.random().toString(36).substring(2, 9)}`;
      const processingMsgId2 = `ai-processing-2-${Math.random().toString(36).substring(2, 9)}`;
      const completedTextMsgId2 = `ai-completed-text-2-${Math.random().toString(36).substring(2, 9)}`;
      const assessmentMsgId2 = `ai-assessment-card-2-${Math.random().toString(36).substring(2, 9)}`;

      const aiMsg: MessageBlock = {
        id: aiMsgId2,
        role: 'assistant',
        type: 'text',
        content: `Excellent. I have received the additional supporting documents and will now perform a deeper reconciliation across your financial records.`
      };

      const processingMsg: MessageBlock = {
        id: processingMsgId2,
        role: 'assistant',
        type: 'processing_indicator'
      };

      setConversation(prevHistory => [...prevHistory, aiMsg]);

      // Schedule secondary processing message
      setTimeout(() => {
        setConversation(h => {
          const hasProcessing = h.some(msg => msg.id === processingMsgId2);
          if (hasProcessing) return h;
          return [...h, processingMsg];
        });

        // Schedule transition to Completed text after 3.5 seconds
        setTimeout(() => {
          setConversation(h => {
            const withoutProcessing = h.filter(msg => msg.id !== processingMsgId2);
            
            const hasAssessment2 = h.some(msg => msg.id === assessmentMsgId2);
            if (hasAssessment2) return h;

            const completedTextMsg: MessageBlock = {
              id: completedTextMsgId2,
              role: 'assistant',
              type: 'text',
              content: `✓ Analysis completed successfully.`
            };

            const assessmentMsg: MessageBlock = {
              id: assessmentMsgId2,
              role: 'assistant',
              type: 'executive_assessment',
              isUpdated: true
            };

            return [...withoutProcessing, completedTextMsg, assessmentMsg];
          });
        }, 3500);

      }, 600);
    }
  }, [uploadStates, isTransitioned, reconcile2Started]);

  // Scroll to the top of the executive assessment card on render
  useEffect(() => {
    const hasAssessment = conversation.some(msg => msg.type === 'executive_assessment');
    if (hasAssessment && assessmentCardRef.current) {
      setTimeout(() => {
        if (assessmentCardRef.current) {
          assessmentCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [conversation]);

  const handleUploadClick = (docId: string) => {
    // Check if any other document is uploading/validating, or if this document is already uploaded/processing
    const isAnyDocProcessing = Object.values(uploadStates).some(
      u => u.status === 'uploading' || u.status === 'validating'
    );
    if (isAnyDocProcessing || uploadStates[docId].status !== 'idle') return;

    // Transition to Uploading State
    setUploadStates(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        status: 'uploading',
        progress: 0
      }
    }));

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress >= 100) {
        clearInterval(progressInterval);

        // Map mock filenames
        let fileName = 'document.pdf';
        if (docId === 'bank-statements') fileName = 'Bank_Statement_Jan-Jun_2026.pdf';
        else if (docId === 'ar-report') fileName = 'Accounts_Receivable_Report_Q2.xlsx';
        else if (docId === 'ap-ledger') fileName = 'Accounts_Payable_Ledger_v1.csv';
        else if (docId === 'gst-returns') fileName = 'GST_Returns_FY26.xlsx';
        else if (docId === 'sales-register') fileName = 'Sales_Register_Q1-Q2.csv';
        else if (docId === 'customer-ledger') fileName = 'Customer_Ledger_Balances.xlsx';

        // Move to Uploaded state
        setUploadStates(prev => ({
          ...prev,
          [docId]: {
            ...prev[docId],
            status: 'uploaded',
            progress: 100,
            fileName,
            uploadedAt: new Date().toISOString()
          }
        }));

        // Move to Validating state after 600ms
        setTimeout(() => {
          setUploadStates(prev => ({
            ...prev,
            [docId]: {
              ...prev[docId],
              status: 'validating'
            }
          }));

          // Move to Validated state after 1500ms
          setTimeout(() => {
            setUploadStates(prev => ({
              ...prev,
              [docId]: {
                ...prev[docId],
                status: 'validated',
                confidenceScore: 0.98
              }
            }));
          }, 1500);

        }, 600);

      } else {
        setUploadStates(prev => ({
          ...prev,
          [docId]: {
            ...prev[docId],
            progress: currentProgress
          }
        }));
      }
    }, 150);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromptValue(e.target.value);
  };

  const triggerConversation = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: MessageBlock = {
      id: `user-${Date.now()}`,
      role: 'user',
      type: 'text',
      content: queryText,
    };

    if (!isTransitioned) {
      setIsTransitioned(true);
      setPromptValue("");

      const aiMsg: MessageBlock = {
        id: `ai-text-${Date.now()}`,
        role: 'assistant',
        type: 'text',
        content: `Thank you for sharing your recovery challenge.

To perform an initial assessment, please upload the following financial documents.`,
      };

      const docReqMsg: MessageBlock = {
        id: `ai-doc-req-${Date.now()}`,
        role: 'assistant',
        type: 'document_request',
        documents: [
          { id: 'bank-statements', name: 'Bank Statements', description: 'Last 6 months' },
          { id: 'ar-report', name: 'Accounts Receivable Report', description: 'Customer receivables' },
          { id: 'ap-ledger', name: 'Accounts Payable Ledger', description: 'Vendor payables' },
        ]
      };

      setConversation([userMsg, aiMsg, docReqMsg]);
    } else {
      setConversation((prev) => [...prev, userMsg]);
      setPromptValue("");
    }
  };

  const handlePromptSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (promptValue.trim()) {
      triggerConversation(promptValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePromptSubmit();
    }
  };

  const handlePillClick = (pillText: string) => {
    let customText = pillText;
    if (pillText === "Revenue Recovery") {
      customText = "We are facing revenue leakage in our company and would like to identify potential recovery opportunities.";
    } else if (pillText === "Cost Recovery") {
      customText = "We would like to analyze our vendor payments to identify cost recovery and optimization opportunities.";
    } else if (pillText === "Tax Recovery") {
      customText = "We want to perform a tax recovery review to identify potential tax overpayments or unclaimed credits.";
    }
    triggerConversation(customText);
  };

  return (
    <div className={`${styles.wrapper} ${isTransitioned ? styles.transitionedWrapper : ''}`}>
      {/* GLOBAL NAVBAR (Persistent DARP Header with Centered User) */}
      <header className={styles.topHeader}>
        <Container className={styles.topHeaderContainer}>
          {/* Left: Brand Logo */}
          <div className={styles.brandBlock} onClick={handleBackToHome} style={{ cursor: 'pointer' }}>
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

          {/* Center: Authenticated User Info */}
          <div className={styles.headerCenter}>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>JA</div>
              <span className={styles.userName}>John Anderson</span>
            </div>
          </div>

          {/* Right: Back to Home Action */}
          <div className={styles.navAction}>
            <Button variant="outline" size="sm" onClick={handleBackToHome} className={styles.backButton}>
              ← Back to Home
            </Button>
          </div>
        </Container>
      </header>

      {/* WORKSPACE AREA */}
      <main className={styles.workspaceArea}>
        <Container className={styles.workspaceContainer}>
          
          {/* Main workspace container that transitions layout */}
          <div className={`${styles.workspaceMain} ${isTransitioned ? styles.transitioned : ''}`}>
            
            {/* Scrollable Conversation Container */}
            {isTransitioned && (
              <div className={styles.conversationContainer} ref={chatScrollRef} aria-live="polite">
                <div className={styles.conversationContentWidth}>
                  {conversation.map((msg) => {
                    const isUser = msg.role === 'user';
                    
                    if (isUser) {
                      return (
                        <div key={msg.id} className={styles.userMessageRow}>
                          <div className={styles.userBubble}>
                            {msg.content}
                          </div>
                          <div className={styles.userAvatar} title="User">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                        </div>
                      );
                    } else {
                      const isAnyDocProcessing = Object.values(uploadStates).some(
                        u => u.status === 'uploading' || u.status === 'validating'
                      );

                      if (msg.type === 'text') {
                        return (
                          <div key={msg.id} className={styles.aiMessageRow}>
                            <div className={styles.aiAvatar} title="DARP AI Assistant">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <rect x="3" y="11" width="18" height="10" rx="2" />
                                <circle cx="12" cy="5" r="2" />
                                <path d="M12 7v4" />
                                <line x1="8" y1="16" x2="8" y2="16.01" />
                                <line x1="16" y1="16" x2="16" y2="16.01" />
                              </svg>
                            </div>
                            <div className={styles.aiBubble}>
                              {msg.content?.split('\n\n').map((para, i) => (
                                <p key={i} className={styles.aiTextParagraph}>{para}</p>
                              ))}
                            </div>
                          </div>
                        );
                      } else if (msg.type === 'document_request') {
                        return (
                          <div key={msg.id} className={styles.aiMessageRowCentered}>
                            <div className={styles.documentRequestCard}>
                              <div className={styles.docRequestHeader}>
                                <h3 className={styles.docRequestTitle}>Documents Required for Initial Assessment</h3>
                                <p className={styles.docRequestDesc}>
                                  Upload the following financial documents to perform an initial recovery assessment.
                                </p>
                              </div>
                              
                              <div className={styles.docRequestList}>
                                {msg.documents?.map((doc) => {
                                  const state = uploadStates[doc.id];
                                  if (!state) return null;

                                  const isDisabled = isAnyDocProcessing || state.status !== 'idle';

                                  return (
                                    <div key={doc.id} className={`${styles.uploadCard} ${state.status !== 'idle' ? styles.activeUploadCard : ''}`}>
                                      <div className={styles.uploadCardContent}>
                                        <span className={styles.docTitle}>
                                          {state.name}
                                          {doc.optional && <span className={styles.optionalText}> (Optional)</span>}
                                        </span>
                                        
                                        {/* Helper descriptions by state */}
                                        {state.status === 'idle' && (
                                          <span className={styles.docDesc}>{state.description}</span>
                                        )}
                                        {state.status === 'uploading' && (
                                          <span className={styles.docDescUploading}>Uploading document...</span>
                                        )}
                                        {state.status === 'uploaded' && (
                                          <span className={styles.docDescUploaded}>{state.fileName}</span>
                                        )}
                                        {state.status === 'validating' && (
                                          <span className={styles.docDescValidating}>{state.fileName}</span>
                                        )}
                                        {state.status === 'validated' && (
                                          <span className={styles.docDescValidated}>{state.fileName}</span>
                                        )}
                                      </div>
                                      
                                      {/* Action configurations by state */}
                                      {state.status === 'idle' && (
                                        <button 
                                          className={`${styles.uploadIconButton} ${isDisabled ? styles.disabledButton : ''}`}
                                          type="button" 
                                          aria-label={`Upload ${state.name}`}
                                          onClick={() => handleUploadClick(doc.id)}
                                          disabled={isDisabled}
                                        >
                                          <svg className={styles.uploadBtnIcon} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                          </svg>
                                        </button>
                                      )}

                                      {state.status === 'uploading' && (
                                        <div className={styles.uploadingActionArea}>
                                          <svg className={styles.spinner} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.15" />
                                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" />
                                          </svg>
                                          <span className={styles.progressText}>{state.progress}%</span>
                                        </div>
                                      )}

                                      {state.status === 'uploaded' && (
                                        <span className={styles.badgeUploaded}>
                                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" className={styles.badgeCheckIcon}>
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                          Uploaded
                                        </span>
                                      )}

                                      {state.status === 'validating' && (
                                        <span className={styles.badgeValidating}>
                                          <span>Validating...</span>
                                          <div className={styles.pulseDots}>
                                            <div className={styles.pulseDot} />
                                            <div className={styles.pulseDot} />
                                            <div className={styles.pulseDot} />
                                          </div>
                                        </span>
                                      )}

                                      {state.status === 'validated' && (
                                        <span className={styles.badgeValidated}>
                                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" className={styles.badgeCheckIcon}>
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                          Ready for Analysis
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      } else if (msg.type === 'processing_indicator') {
                        return (
                          <div key={msg.id} className={styles.aiMessageRow}>
                            <div className={styles.aiAvatar} title="DARP AI Assistant">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <rect x="3" y="11" width="18" height="10" rx="2" />
                                <circle cx="12" cy="5" r="2" />
                                <path d="M12 7v4" />
                                <line x1="8" y1="16" x2="8" y2="16.01" />
                                <line x1="16" y1="16" x2="16" y2="16.01" />
                              </svg>
                            </div>
                            <div className={styles.aiBubble}>
                              <div className={styles.processingBlock}>
                                <div className={styles.processingItem}>
                                  <div className={styles.processingSpinner} />
                                  <span>Analyzing financial records...</span>
                                </div>
                                <div className={styles.processingItem}>
                                  <div className={styles.processingSpinner} />
                                  <span>Identifying recovery opportunities...</span>
                                </div>
                                <div className={styles.processingItem}>
                                  <div className={styles.processingSpinner} />
                                  <span>Calculating potential recoverable value...</span>
                                </div>
                                <div className={styles.processingDots}>
                                  <span>AI Engine Processing</span>
                                  <div className={styles.pulseDots}>
                                    <div className={styles.pulseDot} />
                                    <div className={styles.pulseDot} />
                                    <div className={styles.pulseDot} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      } else if (msg.type === 'executive_assessment') {
                        const isCard2 = msg.isUpdated === true;
                        return (
                          <div 
                            key={msg.id} 
                            ref={isCard2 ? assessmentCardRef : (!conversation.some(m => m.isUpdated) ? assessmentCardRef : null)} 
                            className={styles.aiMessageRowCentered}
                          >
                            <div className={styles.assessmentMainCard}>
                              {/* Header */}
                              <div className={styles.assessmentHeader}>
                                <h3 className={styles.assessmentTitle}>Initial Recovery Assessment</h3>
                                <p className={styles.assessmentSubtitle}>Generated from the uploaded financial documents.</p>
                              </div>
                              
                              {/* Primary Metric Section */}
                              <div className={styles.metricSection}>
                                <span className={styles.primaryMetric}>
                                  {isCard2 ? '₹31.4 Lakhs' : '₹18.6 Lakhs'}
                                </span>
                                <p className={styles.metricLabel}>
                                  {isCard2 
                                    ? 'Cross-document reconciliation has increased assessment confidence and uncovered additional verified recovery opportunities worth an estimated ₹31.4 Lakhs.'
                                    : 'Estimated recoverable value identified from the uploaded financial records.'
                                  }
                                </p>
                              </div>

                              {/* Enterprise Indicators Row for Card 2 */}
                              {isCard2 && (
                                <div className={styles.assessmentIndicatorsRow}>
                                  <div className={styles.indicatorBadge}>
                                    <span className={styles.indicatorLabel}>AI Confidence:</span>
                                    <span className={styles.indicatorValue}>98.6%</span>
                                  </div>
                                  <div className={styles.indicatorBadge}>
                                    <span className={styles.indicatorLabel}>Recovery Opportunities:</span>
                                    <span className={styles.indicatorValue}>8 Identified</span>
                                  </div>
                                  <div className={styles.indicatorBadge}>
                                    <span className={styles.indicatorLabel}>Cross Validation:</span>
                                    <span className={styles.indicatorValue}>Completed</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Business Insight Section */}
                              <div className={styles.insightBox}>
                                <div className={styles.insightHeader}>
                                  <svg className={styles.warningIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                  </svg>
                                  <span className={styles.insightTitle}>Enterprise Insight</span>
                                </div>
                                <div className={styles.insightText}>
                                  {isCard2 ? (
                                    <>
                                      <strong>Cross-document validation confirms additional financial recovery opportunities.</strong>
                                      <br /><br />
                                      Projected Annual Exposure: <strong>₹52 Lakhs</strong>
                                      <br />
                                      If current financial patterns continue, the projected annual revenue exposure could exceed ₹52 Lakhs.
                                    </>
                                  ) : (
                                    <>
                                      Revenue leakage has been identified across the last six months. If similar financial patterns continue, your annual exposure could exceed <strong>₹38 Lakhs</strong>.
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {/* Divider */}
                              <div className={styles.cardDivider} />
                              
                              {/* Locked Opportunity Preview Container */}
                              <div className={styles.lockedPreviewContainer}>
                                <h4 className={styles.previewSectionTitle}>Identified Opportunities (Preview)</h4>
                                
                                <div className={styles.blurredListOuter}>
                                  {/* Blurred structured enterprise table */}
                                  <div className={styles.blurredOpportunityTableWrapper}>
                                    <table className={styles.previewTable}>
                                      <thead>
                                        <tr>
                                          <th>Recovery Opportunity</th>
                                          <th>Estimated Value</th>
                                          <th>Confidence</th>
                                          <th>Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>Duplicate Vendor Payments</td>
                                          <td>₹4.2 Lakhs</td>
                                          <td>98%</td>
                                          <td><span className={styles.badgeSuccess}>High Opportunity</span></td>
                                        </tr>
                                        <tr>
                                          <td>Outstanding Customer Recoveries</td>
                                          <td>₹5.8 Lakhs</td>
                                          <td>94%</td>
                                          <td><span className={styles.badgeSuccess}>High Opportunity</span></td>
                                        </tr>
                                        <tr>
                                          <td>Unclaimed Tax Credits</td>
                                          <td>₹3.1 Lakhs</td>
                                          <td>90%</td>
                                          <td><span className={styles.badgeWarning}>Medium Opportunity</span></td>
                                        </tr>
                                        <tr>
                                          <td>Pricing Variance Opportunities</td>
                                          <td>₹2.4 Lakhs</td>
                                          <td>88%</td>
                                          <td><span className={styles.badgeWarning}>Medium Opportunity</span></td>
                                        </tr>
                                        <tr>
                                          <td>Contract Billing Exceptions</td>
                                          <td>₹1.8 Lakhs</td>
                                          <td>92%</td>
                                          <td><span className={styles.badgeWarning}>Medium Opportunity</span></td>
                                        </tr>
                                        <tr>
                                          <td>Early Payment Discount Recovery</td>
                                          <td>₹1.3 Lakhs</td>
                                          <td>96%</td>
                                          <td><span className={styles.badgeSuccess}>High Opportunity</span></td>
                                        </tr>
                                        {isCard2 && (
                                          <>
                                            <tr>
                                              <td>Tax Compliance Variances</td>
                                              <td>₹8.5 Lakhs</td>
                                              <td>95%</td>
                                              <td><span className={styles.badgeSuccess}>High Opportunity</span></td>
                                            </tr>
                                            <tr>
                                              <td>Cross-border Billing Audit</td>
                                              <td>₹4.3 Lakhs</td>
                                              <td>91%</td>
                                              <td><span className={styles.badgeWarning}>Medium Opportunity</span></td>
                                            </tr>
                                          </>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                  
                                  {/* Premium Lock Overlay Panel */}
                                  <div className={styles.lockOverlayPanel}>
                                    <div className={styles.lockIconCircle}>
                                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                      </svg>
                                    </div>
                                    <h5 className={styles.lockPanelTitle}>
                                      {isCard2 ? 'Executive Recovery Report Ready' : 'Unlock Complete Recovery Report'}
                                    </h5>
                                    <p className={styles.lockPanelDescription}>
                                      {isCard2 
                                        ? 'Unlock the complete executive recovery report to access detailed recovery intelligence and business recommendations.'
                                        : 'Continue the assessment to explore all identified recovery opportunities, AI recommendations, and executive insights.'
                                      }
                                    </p>

                                    {/* Premium lock bullet list for Card 2 */}
                                    {isCard2 && (
                                      <ul className={styles.lockBulletList}>
                                        <li className={styles.lockBulletItem}>Executive Summary</li>
                                        <li className={styles.lockBulletItem}>Detailed Recovery Opportunities</li>
                                        <li className={styles.lockBulletItem}>AI Recommendations</li>
                                        <li className={styles.lockBulletItem}>Root Cause Analysis</li>
                                        <li className={styles.lockBulletItem}>Financial Impact Assessment</li>
                                        <li className={styles.lockBulletItem}>Executive Presentation Deck</li>
                                      </ul>
                                    )}
                                    
                                    <button className={styles.continueCTA} type="button">
                                      {isCard2 ? '🔒 Unlock Executive Recovery Report' : '🔒 Unlock Full Recovery Report'}
                                      <svg className={styles.arrowIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      } else if (msg.type === 'enterprise_alert') {
                        return (
                          <div key={msg.id} className={styles.aiMessageRowCentered}>
                            <div className={styles.recommendAlertBox}>
                              <div className={styles.recommendAlertHeader}>
                                <svg className={styles.warningIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                  <line x1="12" y1="9" x2="12" y2="13" />
                                  <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                <span className={styles.recommendAlertTitle}>Additional Recoverable Value Detected</span>
                              </div>
                              <div className={styles.recommendAlertBody}>
                                <span className={styles.recommendAlertLabel}>Estimated Additional Recovery Potential</span>
                                <h1 className={styles.recommendAlertValue}>₹12–15 Lakhs</h1>
                                <p className={styles.recommendAlertDesc}>
                                  Upload the supporting financial documents below to validate these findings and uncover additional recovery opportunities.
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      } else if (msg.type === 'recommended_documents') {
                        return (
                          <div key={msg.id} className={styles.aiMessageRowCentered}>
                            <div className={styles.documentRequestCard}>
                              <div className={styles.docRequestHeader}>
                                <h3 className={styles.docRequestTitle}>Additional Documents Recommended</h3>
                                <p className={styles.docRequestDesc}>
                                  Upload any of the following supporting documents to improve analysis confidence and discover additional recovery opportunities.
                                </p>
                              </div>
                              
                              <div className={styles.docRequestList}>
                                {msg.documents?.map((doc) => {
                                  const state = uploadStates[doc.id];
                                  if (!state) return null;

                                  const isDisabled = isAnyDocProcessing || state.status !== 'idle';

                                  return (
                                    <div key={doc.id} className={`${styles.uploadCard} ${state.status !== 'idle' ? styles.activeUploadCard : ''}`}>
                                      <div className={styles.uploadCardContent}>
                                        <span className={styles.docTitle}>
                                          {state.name}
                                          {doc.optional && <span className={styles.optionalText}> (Optional)</span>}
                                        </span>
                                        
                                        {/* Helper descriptions by state */}
                                        {state.status === 'idle' && (
                                          <span className={styles.docDesc}>{state.description}</span>
                                        )}
                                        {state.status === 'uploading' && (
                                          <span className={styles.docDescUploading}>Uploading document...</span>
                                        )}
                                        {state.status === 'uploaded' && (
                                          <span className={styles.docDescUploaded}>{state.fileName}</span>
                                        )}
                                        {state.status === 'validating' && (
                                          <span className={styles.docDescValidating}>{state.fileName}</span>
                                        )}
                                        {state.status === 'validated' && (
                                          <span className={styles.docDescValidated}>{state.fileName}</span>
                                        )}
                                      </div>
                                      
                                      {/* Action configurations by state */}
                                      {state.status === 'idle' && (
                                        <button 
                                          className={`${styles.uploadIconButton} ${isDisabled ? styles.disabledButton : ''}`}
                                          type="button" 
                                          aria-label={`Upload ${state.name}`}
                                          onClick={() => handleUploadClick(doc.id)}
                                          disabled={isDisabled}
                                        >
                                          <svg className={styles.uploadBtnIcon} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                          </svg>
                                        </button>
                                      )}

                                      {state.status === 'uploading' && (
                                        <div className={styles.uploadingActionArea}>
                                          <svg className={styles.spinner} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.15" />
                                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" />
                                          </svg>
                                          <span className={styles.progressText}>{state.progress}%</span>
                                        </div>
                                      )}

                                      {state.status === 'uploaded' && (
                                        <span className={styles.badgeUploaded}>
                                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" className={styles.badgeCheckIcon}>
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                          Uploaded
                                        </span>
                                      )}

                                      {state.status === 'validating' && (
                                        <span className={styles.badgeValidating}>
                                          <span>Validating...</span>
                                          <div className={styles.pulseDots}>
                                            <div className={styles.pulseDot} />
                                            <div className={styles.pulseDot} />
                                            <div className={styles.pulseDot} />
                                          </div>
                                        </span>
                                      )}

                                      {state.status === 'validated' && (
                                        <span className={styles.badgeValidated}>
                                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" className={styles.badgeCheckIcon}>
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                          Ready for Analysis
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }
                  })}
                </div>
              </div>
            )}

            {/* WELCOME EXPERIENCE */}
            {!isTransitioned && (
              <div className={styles.welcomeSection}>
                <h1 className={styles.welcomeTitle}>{welcomeMessage.headline}</h1>
                <p className={styles.welcomeSubtitle}>{welcomeMessage.description}</p>
              </div>
            )}

            {/* PROMPT SECTION */}
            <div className={styles.promptSection}>
              <form className={styles.promptForm} onSubmit={handlePromptSubmit}>
                <div className={styles.inputWrapper}>
                  {/* Subtle AI Icon */}
                  <svg className={styles.aiIcon} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z" />
                    <path d="M12 6v12M6 12h12" />
                  </svg>
                  
                  <input
                    type="text"
                    value={promptValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your recovery opportunity..."
                    className={styles.promptInput}
                    aria-label="AI Prompt Input"
                  />
                  
                  {/* Send Button */}
                  <button type="submit" className={styles.sendButton} aria-label="Send prompt">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* SUGGESTION PILLS */}
              <div className={styles.pillsContainer}>
                <button className={styles.pill} onClick={() => handlePillClick("Revenue Recovery")}>
                  Revenue Recovery
                </button>
                <button className={styles.pill} onClick={() => handlePillClick("Cost Recovery")}>
                  Cost Recovery
                </button>
                <button className={styles.pill} onClick={() => handlePillClick("Tax Recovery")}>
                  Tax Recovery
                </button>
              </div>
            </div>

          </div>

        </Container>
      </main>
    </div>
  );
}
