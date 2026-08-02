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
  type: 'text' | 'document_request';
  content?: string;
  documents?: {
    id: string;
    name: string;
    description: string;
    optional?: boolean;
  }[];
}

export default function Demo2WorkspacePage() {
  const router = useRouter();
  const [isTransitioned, setIsTransitioned] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [conversation, setConversation] = useState<MessageBlock[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

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
                                {msg.documents?.map((doc) => (
                                  <div key={doc.id} className={styles.uploadCard}>
                                    <div className={styles.uploadCardContent}>
                                      <span className={styles.docTitle}>
                                        {doc.name}
                                        {doc.optional && <span className={styles.optionalText}> (Optional)</span>}
                                      </span>
                                      <span className={styles.docDesc}>{doc.description}</span>
                                    </div>
                                    
                                    <button className={styles.uploadIconButton} type="button" aria-label={`Upload ${doc.name}`}>
                                      <svg className={styles.uploadBtnIcon} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
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
