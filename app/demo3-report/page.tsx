'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui';
import styles from './page.module.css';

interface TransactionDetail {
  invoiceNo: string;
  poNo: string;
  vendor: string;
  invoiceDate: string;
  paymentDate: string;
  recoveryValue: string;
  gstInfo: string;
  confidenceScore: string;
  aiExplanation: string;
  recommendedAction: string;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  potentialRecovery: string;
  matchedBankEntries: number;
  confidence: string;
  details: TransactionDetail;
}

interface VendorOpportunity {
  id: string;
  name: string;
  potentialRecovery: string;
  invoiceCount: number;
  invoices: Invoice[];
}

interface RecoveryCategory {
  id: string;
  name: string;
  recoverableValue: string;
  confidence: string;
  vendors: VendorOpportunity[];
}

const mockRecoveryCategories: RecoveryCategory[] = [
  {
    id: 'duplicate-payments',
    name: 'Duplicate Vendor Payments',
    recoverableValue: '₹4,20,000',
    confidence: '98%',
    vendors: [
      {
        id: 'dup-abc',
        name: 'ABC Pvt Ltd',
        potentialRecovery: '₹1,60,000',
        invoiceCount: 3,
        invoices: [
          {
            id: 'inv-20341',
            invoiceNo: 'INV-20341',
            potentialRecovery: '₹60,000',
            matchedBankEntries: 3,
            confidence: '99%',
            details: {
              invoiceNo: 'INV-20341',
              poNo: 'PO-99482',
              vendor: 'ABC Pvt Ltd',
              invoiceDate: '12-Jan-2026',
              paymentDate: '28-Jan-2026',
              recoveryValue: '₹60,000',
              gstInfo: 'GSTIN-27AAAAA1111A1Z1 (Matched)',
              confidenceScore: '99%',
              aiExplanation: 'Three separate bank transactions reconciled against the same single invoice number within a 14-day window. Second and third payments show duplicate transfer references.',
              recommendedAction: 'Issue double-payment reversal request to ABC Pvt Ltd. Reference bank transfer sequences TXN-998822 and TXN-998825.'
            }
          },
          {
            id: 'inv-20342',
            invoiceNo: 'INV-20342',
            potentialRecovery: '₹50,000',
            matchedBankEntries: 2,
            confidence: '98%',
            details: {
              invoiceNo: 'INV-20342',
              poNo: 'PO-99482',
              vendor: 'ABC Pvt Ltd',
              invoiceDate: '15-Jan-2026',
              paymentDate: '30-Jan-2026',
              recoveryValue: '₹50,000',
              gstInfo: 'GSTIN-27AAAAA1111A1Z1 (Matched)',
              confidenceScore: '98%',
              aiExplanation: 'Two identical payments processed on subsequent ledger cycles without corresponding purchase orders for the second cycle.',
              recommendedAction: 'Submit reconciliation claim to vendor billing desk with proof of payment matching PO-99482.'
            }
          },
          {
            id: 'inv-20343',
            invoiceNo: 'INV-20343',
            potentialRecovery: '₹50,000',
            matchedBankEntries: 2,
            confidence: '97%',
            details: {
              invoiceNo: 'INV-20343',
              poNo: 'PO-99485',
              vendor: 'ABC Pvt Ltd',
              invoiceDate: '18-Jan-2026',
              paymentDate: '02-Feb-2026',
              recoveryValue: '₹50,000',
              gstInfo: 'GSTIN-27AAAAA1111A1Z1 (Matched)',
              confidenceScore: '97%',
              aiExplanation: 'Overpayment matching error. Payment reference shows full invoice amount settled twice across two different credit cards.',
              recommendedAction: 'Process corporate card charge reconciliation file and contact ABC Pvt Ltd accounts receivable desk.'
            }
          }
        ]
      },
      {
        id: 'dup-xyz',
        name: 'XYZ Solutions',
        potentialRecovery: '₹2,60,000',
        invoiceCount: 2,
        invoices: [
          {
            id: 'inv-88401',
            invoiceNo: 'INV-88401',
            potentialRecovery: '₹1,30,000',
            matchedBankEntries: 2,
            confidence: '98%',
            details: {
              invoiceNo: 'INV-88401',
              poNo: 'PO-33410',
              vendor: 'XYZ Solutions',
              invoiceDate: '05-Jan-2026',
              paymentDate: '20-Jan-2026',
              recoveryValue: '₹1,30,000',
              gstInfo: 'GSTIN-27BBBBB2222B2Z2 (Matched)',
              confidenceScore: '98%',
              aiExplanation: 'Duplicate electronic wire transfer issued via secondary banking portal due to approval state synchronization lag.',
              recommendedAction: 'Initiate wire recall check with Bank partner and submit transaction receipts to XYZ Solutions support.'
            }
          },
          {
            id: 'inv-88402',
            invoiceNo: 'INV-88402',
            potentialRecovery: '₹1,30,000',
            matchedBankEntries: 2,
            confidence: '98%',
            details: {
              invoiceNo: 'INV-88402',
              poNo: 'PO-33410',
              vendor: 'XYZ Solutions',
              invoiceDate: '08-Jan-2026',
              paymentDate: '23-Jan-2026',
              recoveryValue: '₹1,30,000',
              gstInfo: 'GSTIN-27BBBBB2222B2Z2 (Matched)',
              confidenceScore: '98%',
              aiExplanation: 'Direct ledger debit duplicate. Ledger entry states settlement of hardware contract, but payment logs show two duplicate credits on consecutive business days.',
              recommendedAction: 'Reconcile ledger entry contract lines and submit statement of accounts to XYZ billing.'
            }
          }
        ]
      }
    ]
  }
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

// Custom hook to support streaming typewriter effect
function useTypewriter(text: string, speed: number = 32, onComplete?: () => void) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
}

interface StreamingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const StreamingText: React.FC<StreamingTextProps> = ({ text, speed = 32, onComplete }) => {
  const displayed = useTypewriter(text, speed, onComplete);
  return <span>{displayed}</span>;
};

function ReportWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') === 'individual' ? 'individual' : 'teams';

  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>('duplicate-payments');
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);
  const [startedRecoveries, setStartedRecoveries] = useState<Set<string>>(new Set());
  
  // Interactive Timeline Modal State
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [timelineContext, setTimelineContext] = useState<{
    type: 'category' | 'vendor' | 'invoice';
    name: string;
    key: string;
  } | null>(null);
  const [timelineEventsByContext, setTimelineEventsByContext] = useState<Record<string, {
    date: string;
    title: string;
    description?: string;
  }[]>>({});

  // Feature Gating Modal State
  const [isFeatureGatingModalOpen, setIsFeatureGatingModalOpen] = useState(false);
  const [featureGatingContext, setFeatureGatingContext] = useState<string>('');
  
  // Assign Owner Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignmentContext, setAssignmentContext] = useState<{
    itemName: string;
    owner: string;
    targetDate: string;
    comments: string;
  } | null>(null);

  // AI Drawer states
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: 'Welcome to the Executive Recovery Report Workspace AI Assistant! I can help you summarize this report, explain duplicate vendor payments, find the highest value opportunities, or review affected vendors. How can I help you today?'
    }
  ]);
  const [isAiStreaming, setIsAiStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiStreaming, streamingText]);

  // Contextual mock answers for Demo 3
  const getContextualAnswer = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('summarize') || q.includes('summary')) {
      return `Here is a summary of the Executive Recovery Report:
• **Total Recoverable Value**: ₹31,40,000 detected with 98.6% average confidence.
• **Primary Leakage Category**: Duplicate Vendor Payments (₹4,20,000 detected across ABC Pvt Ltd and XYZ Solutions).
• **Key Recommendation**: Recover ₹1,60,000 immediately from ABC Pvt Ltd and verify additional ledger debit duplicates from XYZ Solutions (₹2,60,000).`;
    }
    if (q.includes('duplicate') || q.includes('vendor')) {
      return `Duplicate Vendor Payments total **₹4,20,000** and represent key leakage points:
1. **ABC Pvt Ltd**: ₹1,60,000 across 3 duplicate invoice payments (including INV-20341, INV-20342, and INV-20343). Multiple payments were mapped to single PO boundaries.
2. **XYZ Solutions**: ₹2,60,000 across 2 duplicate wire transfers (INV-88401 and INV-88402) caused by banking sync lag.`;
    }
    if (q.includes('highest') || q.includes('value') || q.includes('opportunity')) {
      return `The highest recovery opportunity detected is in **Duplicate Vendor Payments** for a total of **₹4,20,000**.
Within this, **XYZ Solutions** represents the highest individual vendor leak of **₹2,60,000** across two duplicates of ₹1,30,000 each. Following closely is **ABC Pvt Ltd** with **₹1,60,000** across three duplicates.`;
    }
    if (q.includes('affected') || q.includes('vendors') || q.includes('companies')) {
      return `The affected vendors identified under duplicate payments are:
• **XYZ Solutions**: 2 invoices totaling ₹2,60,000.
• **ABC Pvt Ltd**: 3 invoices totaling ₹1,60,000.
We recommend starting the recovery workflow for both vendors to reclaim this leakage.`;
    }
    return `That's an interesting question about the recovery report. Reconciled audit records show total leakage of ₹31,40,000. Reclaiming this includes executing the duplicate payments reversals (₹4,20,000) and verifying active ledger logs. Would you like me to summarize the duplicate payment transactions?`;
  };

  const handleSendMessage = (messageContent: string) => {
    if (!messageContent.trim() || isAiStreaming) return;
    
    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: messageContent
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiStreaming(true);

    // Simulate thinking delay
    setTimeout(() => {
      const mockResponse = getContextualAnswer(messageContent);
      setStreamingText(mockResponse);
    }, 400);
  };

  const handleStreamComplete = () => {
    setChatMessages(prev => [
      ...prev,
      {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: streamingText
      }
    ]);
    setStreamingText('');
    setIsAiStreaming(false);
  };

  const handleStartRecoveryClick = (e: React.MouseEvent, type: 'category' | 'vendor' | 'invoice', key: string) => {
    e.stopPropagation();
    setStartedRecoveries(prev => {
      const next = new Set(prev);
      next.add(`${type}-${key}`);
      return next;
    });
  };

  // Timeline handlers
  const handleOpenTimeline = (e: React.MouseEvent, type: 'category' | 'vendor' | 'invoice', name: string) => {
    e.stopPropagation();
    const key = `${type}-${name}`;
    setTimelineContext({ type, name, key });
    setIsTimelineModalOpen(true);
  };

  const getDefaultTimeline = (type: string, name: string) => {
    return [
      {
        date: 'Just now',
        title: 'Recovery Workflow Initiated',
        description: `Recovery tracker created for ${type} level target: ${name}.`
      },
      {
        date: 'Scheduled',
        title: 'Communication Queue Scheduled',
        description: 'Auto-generation of double payment statement reports scheduled.'
      }
    ];
  };

  const handleSendReminder = () => {
    if (!timelineContext) return;
    const key = timelineContext.key;
    const currentEvents = timelineEventsByContext[key] || getDefaultTimeline(timelineContext.type, timelineContext.name);
    
    const newEvent = {
      date: 'Just now',
      title: 'Reminder Communication Sent',
      description: 'Urgent compliance alert email pushed directly to vendor finance accounts desk.'
    };
    
    // Insert after "Workflow Initiated" but before "Scheduled" followups
    const updated = [currentEvents[0], newEvent, ...currentEvents.slice(1)];
    
    setTimelineEventsByContext(prev => ({
      ...prev,
      [key]: updated
    }));

    alert("Reminder communication sent successfully.");
  };

  // Owner Assignment Handlers
  const openAssignModal = (itemName: string) => {
    if (plan === 'individual') {
      setFeatureGatingContext(itemName);
      setIsFeatureGatingModalOpen(true);
    } else {
      setAssignmentContext({
        itemName,
        owner: 'Logaprasanth N (Finance Lead)',
        targetDate: '2026-08-15',
        comments: `Please validate duplicate payment and initiate recovery for ${itemName}.`
      });
      setIsAssignModalOpen(true);
    }
  };

  const handleUpgradeToTeamsInReport = () => {
    setIsFeatureGatingModalOpen(false);
    
    // Upgrade URL plan parameter dynamically without reload!
    router.replace(`/demo3-report?plan=teams`);
    
    alert("Plan upgraded to Teams successfully! Unlocking owner assignment...");
    
    // Reopen assignment modal as teams
    setTimeout(() => {
      setAssignmentContext({
        itemName: featureGatingContext,
        owner: 'Logaprasanth N (Finance Lead)',
        targetDate: '2026-08-15',
        comments: `Please validate duplicate payment and initiate recovery for ${featureGatingContext}.`
      });
      setIsAssignModalOpen(true);
    }, 400);
  };

  return (
    <div className={styles.wrapper}>
      {/* TOP HEADER */}
      <header className={styles.header}>
        <Container className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <div className={styles.brandBlock} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
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
            </div>
            <div className={styles.planBadge} style={{ backgroundColor: plan === 'teams' ? 'var(--color-success-bg)' : 'var(--color-secondary)', color: plan === 'teams' ? 'var(--color-success)' : 'var(--color-text-secondary)', borderColor: plan === 'teams' ? 'var(--color-success-border)' : 'var(--color-border)' }}>
              {plan === 'teams' ? 'Teams Plan Active' : 'Individual Plan Active'}
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <button className={styles.navLinkBtn} onClick={() => router.push('/demo3-workspace')}>
              ← Back to Assessment
            </button>
            <button className={styles.navLinkBtn} onClick={() => router.push('/')}>
              Back to Launcher
            </button>
          </div>
        </Container>
      </header>

      {/* MAIN LAYOUT */}
      <main className={styles.main}>
        <Container className={styles.workspaceContainer}>
          <div className={styles.reportPanel} aria-label="Executive Recovery Report Workspace">
            <div className={styles.reportHeader}>
              <h2 className={styles.reportTitle}>Executive Recovery Report</h2>
              <p className={styles.reportSubtitle}>AI-generated from reconciled financial documents</p>
            </div>

            <div className={styles.reportMetricCard}>
              <div className={styles.reportMetricTitle}>Total Recoverable Value</div>
              <div className={styles.reportMetricValue}>₹31,40,000</div>
              <p className={styles.reportText} style={{ fontSize: '12px', opacity: 0.8, margin: 'var(--space-1) 0 0 0' }}>
                Cross-document verification score: 98.6% Confidence
              </p>
            </div>

            <div className={styles.reportSection}>
              <h3 className={styles.reportSectionTitle}>Recovery Opportunities</h3>
              <div className={styles.opportunitiesList}>
                {mockRecoveryCategories.map((cat) => {
                  const isCatExpanded = expandedCategoryId === cat.id;

                  return (
                    <div 
                      key={cat.id} 
                      className={`${styles.opportunityAccordionItem} ${isCatExpanded ? styles.activeAccordionItem : ''}`}
                      onClick={() => {
                        setExpandedCategoryId(isCatExpanded ? null : cat.id);
                        setExpandedVendorId(null);
                        setExpandedInvoiceId(null);
                      }}
                    >
                      {/* Level 1: Category Header Row */}
                      <div className={styles.accordionHeaderRow}>
                        <div className={styles.headerLeftZone}>
                          <svg 
                            className={`${styles.chevronIcon} ${isCatExpanded ? styles.rotatedChevron : ''}`} 
                            viewBox="0 0 24 24" 
                            width="16" 
                            height="16" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          <span className={styles.opportunityName}>{cat.name}</span>
                        </div>
                        <div className={styles.opportunityDetails}>
                          <div className={styles.opportunityDetailsTopRow}>
                            {startedRecoveries.has(`category-${cat.name}`) ? (
                              <div className={styles.recoveryStatusContainer}>
                                <span className={styles.recoveryStartedBadge}>
                                  ✓ Recovery Started
                                </span>
                                <button 
                                  className={styles.viewTimelineBtn}
                                  type="button"
                                  onClick={(e) => handleOpenTimeline(e, 'category', cat.name)}
                                >
                                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.buttonIcon}>
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                  View
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className={styles.startRecoveryBtn}
                                onClick={(e) => handleStartRecoveryClick(e, 'category', cat.name)}
                              >
                                <svg 
                                  viewBox="0 0 24 24" 
                                  width="12" 
                                  height="12" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2.5" 
                                  className={styles.buttonIcon} 
                                  aria-hidden="true"
                                >
                                  <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                                Start Recovery
                              </button>
                            )}
                            <span className={styles.opportunityVal}>{cat.recoverableValue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Level 2: Vendor List Expansion */}
                      {isCatExpanded && (
                        <div className={styles.categoryExpansion} onClick={(e) => e.stopPropagation()}>
                          <h4 className={styles.expansionSubheading}>Affected Vendors</h4>
                          <div className={styles.vendorsList}>
                            {cat.vendors.map((vendor) => {
                              const isVendorExpanded = expandedVendorId === vendor.id;

                              return (
                                <div 
                                  key={vendor.id} 
                                  className={`${styles.vendorCard} ${isVendorExpanded ? styles.activeVendorCard : ''}`}
                                  onClick={() => {
                                    setExpandedVendorId(isVendorExpanded ? null : vendor.id);
                                    setExpandedInvoiceId(null);
                                  }}
                                >
                                  <div className={styles.vendorHeaderRow}>
                                    <div className={styles.vendorLeftZone}>
                                      <svg 
                                        className={`${styles.chevronIcon} ${isVendorExpanded ? styles.rotatedChevron : ''}`} 
                                        viewBox="0 0 24 24" 
                                        width="14" 
                                        height="14" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2.5"
                                      >
                                        <polyline points="9 18 15 12 9 6" />
                                      </svg>
                                      <span className={styles.vendorNameText}>{vendor.name}</span>
                                    </div>
                                    <div className={styles.vendorRightZone}>
                                      {startedRecoveries.has(`vendor-${vendor.name}`) ? (
                                        <div className={styles.recoveryStatusContainer}>
                                          <span className={styles.recoveryStartedBadge}>
                                            ✓ Recovery Started
                                          </span>
                                          <button 
                                            className={styles.viewTimelineBtn}
                                            type="button"
                                            onClick={(e) => handleOpenTimeline(e, 'vendor', vendor.name)}
                                          >
                                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.buttonIcon}>
                                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                              <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            View
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          className={styles.startRecoveryBtn}
                                          onClick={(e) => handleStartRecoveryClick(e, 'vendor', vendor.name)}
                                        >
                                          <svg 
                                            viewBox="0 0 24 24" 
                                            width="12" 
                                            height="12" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2.5" 
                                            className={styles.buttonIcon} 
                                            aria-hidden="true"
                                          >
                                            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                          </svg>
                                          Start Recovery
                                        </button>
                                      )}
                                      <span className={styles.vendorValText}>{vendor.potentialRecovery}</span>
                                      <span className={styles.vendorMetaText}>{vendor.invoiceCount} invoices</span>
                                    </div>
                                  </div>

                                  {/* Level 3: Invoice List Expansion */}
                                  {isVendorExpanded && (
                                    <div className={styles.vendorExpansion} onClick={(e) => e.stopPropagation()}>
                                      <h5 className={styles.expansionSubheading}>Invoices</h5>
                                      <div className={styles.invoicesList}>
                                        {vendor.invoices.map((inv) => {
                                          const isInvSelected = expandedInvoiceId === inv.id;

                                          return (
                                            <div key={inv.id} className={styles.invoiceItemWrapper}>
                                              <div 
                                                className={`${styles.invoiceCard} ${isInvSelected ? styles.activeInvoiceCard : ''}`}
                                                onClick={() => setExpandedInvoiceId(isInvSelected ? null : inv.id)}
                                              >
                                                <div className={styles.invoiceLeftZone}>
                                                  <svg 
                                                    className={`${styles.chevronIcon} ${isInvSelected ? styles.rotatedChevron : ''}`} 
                                                    viewBox="0 0 24 24" 
                                                    width="12" 
                                                    height="12" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    strokeWidth="2.5"
                                                  >
                                                    <polyline points="9 18 15 12 9 6" />
                                                  </svg>
                                                  <span className={styles.invoiceNoText}>{inv.invoiceNo}</span>
                                                </div>
                                                <div className={styles.invoiceRightZone}>
                                                  <span className={styles.invoiceValText}>{inv.potentialRecovery}</span>
                                                </div>
                                              </div>

                                              {/* Level 4: Transaction Detail Context Card */}
                                              {isInvSelected && (
                                                <div className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
                                                  <h5 className={styles.detailCardHeader}>Transaction Details — {inv.invoiceNo}</h5>
                                                  <div className={styles.detailGrid}>
                                                    <div className={styles.detailField}>
                                                      <span className={styles.fieldLabel}>Invoice Number</span>
                                                      <span className={styles.fieldValue}>{inv.details.invoiceNo}</span>
                                                    </div>
                                                    <div className={styles.detailField}>
                                                      <span className={styles.fieldLabel}>PO Number</span>
                                                      <span className={styles.fieldValue}>{inv.details.poNo}</span>
                                                    </div>
                                                    <div className={styles.detailField}>
                                                      <span className={styles.fieldLabel}>Vendor</span>
                                                      <span className={styles.fieldValue}>{inv.details.vendor}</span>
                                                    </div>
                                                    <div className={styles.detailField}>
                                                      <span className={styles.fieldLabel}>Invoice Date</span>
                                                      <span className={styles.fieldValue}>{inv.details.invoiceDate}</span>
                                                    </div>
                                                    <div className={styles.detailField}>
                                                      <span className={styles.fieldLabel}>Payment Date</span>
                                                      <span className={styles.fieldValue}>{inv.details.paymentDate}</span>
                                                    </div>
                                                    <div className={styles.detailField}>
                                                      <span className={styles.fieldLabel}>Recovery Value</span>
                                                      <span className={styles.fieldValue} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                                        {inv.details.recoveryValue}
                                                      </span>
                                                    </div>
                                                    <div className={styles.detailField}>
                                                      <span className={styles.fieldLabel}>GST Information</span>
                                                      <span className={styles.fieldValue}>{inv.details.gstInfo}</span>
                                                    </div>
                                                  </div>
                                                  <div className={styles.detailExplanationBlock}>
                                                    <div className={styles.explanationTitle}>AI Explanation</div>
                                                    <p className={styles.explanationText}>{inv.details.aiExplanation}</p>
                                                  </div>
                                                  <div className={styles.detailExplanationBlock}>
                                                    <div className={styles.explanationTitle}>Recommended Action</div>
                                                    <p className={styles.explanationText}>{inv.details.recommendedAction}</p>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                                                      {startedRecoveries.has(`invoice-${inv.id}`) ? (
                                                        <div className={styles.recoveryStatusContainer}>
                                                          <span className={styles.recoveryStartedBadge}>
                                                            ✓ Recovery Started
                                                          </span>
                                                          <button 
                                                            className={styles.viewTimelineBtn}
                                                            type="button"
                                                            onClick={(e) => handleOpenTimeline(e, 'invoice', inv.invoiceNo)}
                                                          >
                                                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.buttonIcon}>
                                                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                              <circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                            View
                                                          </button>
                                                        </div>
                                                      ) : (
                                                        <button
                                                          type="button"
                                                          className={styles.startRecoveryBtn}
                                                          onClick={(e) => handleStartRecoveryClick(e, 'invoice', inv.id)}
                                                        >
                                                          <svg 
                                                            viewBox="0 0 24 24" 
                                                            width="12" 
                                                            height="12" 
                                                            fill="none" 
                                                            stroke="currentColor" 
                                                            strokeWidth="2.5" 
                                                            className={styles.buttonIcon} 
                                                            aria-hidden="true"
                                                          >
                                                            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                                          </svg>
                                                          Start Recovery
                                                        </button>
                                                      )}
                                                    </div>
                                                  </div>
                                                  
                                                  {/* Action buttons inside Detail Card */}
                                                  <div className={styles.drillActions}>
                                                    <button 
                                                      className={styles.drillPrimaryBtn} 
                                                      type="button"
                                                      onClick={() => alert(`Downloading PDF for ${inv.invoiceNo}...`)}
                                                    >
                                                      📥 Download PDF
                                                    </button>
                                                    <button 
                                                      className={styles.drillSecondaryBtn} 
                                                      type="button"
                                                      onClick={() => openAssignModal(inv.invoiceNo)}
                                                    >
                                                      👤 Assign Recovery Owner
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>

                                      {/* Action buttons inside Vendor Level */}
                                      {!expandedInvoiceId && (
                                        <div className={styles.drillActions}>
                                          <button 
                                            className={styles.drillPrimaryBtn} 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); alert(`Downloading PDF report for vendor ${vendor.name}...`); }}
                                          >
                                            📥 Download PDF
                                          </button>
                                          <button 
                                            className={styles.drillSecondaryBtn} 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); openAssignModal(vendor.name); }}
                                          >
                                            👤 Assign Recovery Owner
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Action buttons inside Category Level */}
                          {!expandedVendorId && (
                            <div className={styles.drillActions}>
                              <button 
                                className={styles.drillPrimaryBtn} 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); alert(`Downloading PDF report for ${cat.name}...`); }}
                              >
                                📥 Download PDF
                              </button>
                              <button 
                                className={styles.drillSecondaryBtn} 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); openAssignModal(cat.name); }}
                              >
                                👤 Assign Recovery Owner
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.exportSection}>
              <button className={styles.exportBtn} type="button" onClick={() => alert('Downloading report...')}>
                📥 Download Full PDF (Mock)
              </button>
              <button className={styles.exportBtn} type="button" onClick={() => alert('Exporting deck...')}>
                📊 Export Presentation Deck (Mock)
              </button>
              <button className={styles.exportBtn} type="button" onClick={() => alert('Assessment link copied to clipboard!')}>
                🔗 Share Assessment Link
              </button>
            </div>
          </div>
        </Container>
      </main>

      {/* FLOATING ACTION BUTTON */}
      <button 
        className={styles.floatingAiBtn}
        onClick={() => setIsAiDrawerOpen(prev => !prev)}
        aria-label="Open AI Assistant Drawer"
        title="DARP AI Copilot"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* SLIDE OUT DRAWER */}
      <div className={`${styles.drawerOverlay} ${isAiDrawerOpen ? styles.drawerOpen : ''}`} onClick={() => setIsAiDrawerOpen(false)}>
        <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.drawerHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className={styles.drawerSparkleIcon}>✦</span>
              <h3 className={styles.drawerTitle}>DARP AI Assistant</h3>
            </div>
            <button 
              className={styles.closeDrawerBtn}
              onClick={() => setIsAiDrawerOpen(false)}
              aria-label="Close Drawer"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className={styles.drawerBody}>
            {/* Suggested Prompts Grid */}
            <div className={styles.suggestedPromptsSection}>
              <h4 className={styles.suggestedHeader}>Suggested Questions</h4>
              <div className={styles.suggestedGrid}>
                <button 
                  className={styles.suggestedBtn}
                  onClick={() => handleSendMessage("Summarize the executive report.")}
                  disabled={isAiStreaming}
                >
                  Summarize the executive report.
                </button>
                <button 
                  className={styles.suggestedBtn}
                  onClick={() => handleSendMessage("Explain duplicate vendor payments.")}
                  disabled={isAiStreaming}
                >
                  Explain duplicate vendor payments.
                </button>
                <button 
                  className={styles.suggestedBtn}
                  onClick={() => handleSendMessage("Show the highest recovery opportunity.")}
                  disabled={isAiStreaming}
                >
                  Show the highest recovery opportunity.
                </button>
                <button 
                  className={styles.suggestedBtn}
                  onClick={() => handleSendMessage("Explain the affected vendors.")}
                  disabled={isAiStreaming}
                >
                  Explain the affected vendors.
                </button>
              </div>
            </div>

            {/* Chat Conversation Logs */}
            <div className={styles.chatArea}>
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`${styles.chatBubble} ${msg.role === 'user' ? styles.userBubble : styles.aiBubble}`}>
                  {msg.content}
                </div>
              ))}
              {isAiStreaming && (
                <div className={`${styles.chatBubble} ${styles.aiBubble} ${styles.streamingBubble}`}>
                  {streamingText ? (
                    <StreamingText text={streamingText} onComplete={handleStreamComplete} />
                  ) : (
                    <span className={styles.thinkingDots}>Thinking<span>.</span><span>.</span><span>.</span></span>
                  )}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Drawer Chat Input */}
          <form 
            className={styles.drawerInputArea}
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(chatInput);
            }}
          >
            <input 
              type="text"
              className={styles.chatInput}
              placeholder="Ask anything about the report..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isAiStreaming}
            />
            <button 
              type="submit"
              className={styles.sendChatBtn}
              disabled={isAiStreaming || !chatInput.trim()}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Recovery Communication Timeline Modal */}
      {isTimelineModalOpen && timelineContext && (
        <div className={styles.modalOverlay} onClick={() => setIsTimelineModalOpen(false)}>
          <div className={styles.modalCard} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h3 className={styles.modalTitle} style={{ textAlign: 'left' }}>Recovery Communication Timeline</h3>
              <button 
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}
                onClick={() => setIsTimelineModalOpen(false)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className={styles.timelineContextMeta}>
              <span className={styles.contextLabel}>{timelineContext.type} recovery status</span>
              <span className={styles.contextName}>{timelineContext.name}</span>
            </div>
            
            <div className={styles.timelineList}>
              {(timelineEventsByContext[timelineContext.key] || getDefaultTimeline(timelineContext.type, timelineContext.name)).map((evt, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineDotContainer}>
                    <div className={`${styles.timelineDot} ${evt.date === 'Scheduled' ? styles.timelineDotScheduled : styles.timelineDotActive}`} />
                    {idx < (timelineEventsByContext[timelineContext.key] || getDefaultTimeline(timelineContext.type, timelineContext.name)).length - 1 && (
                      <div className={styles.timelineLine} />
                    )}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeaderRow}>
                      <h4 className={styles.timelineEventTitle}>{evt.title}</h4>
                      <span className={styles.timelineEventDate}>{evt.date}</span>
                    </div>
                    {evt.description && (
                      <p className={styles.timelineEventDesc}>
                        {evt.description.split('\n').map((line, lIdx) => (
                          <span key={lIdx} style={{ display: 'block' }}>{line}</span>
                        ))}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.modalActions}>
              <button 
                type="button"
                className={styles.modalPrimaryBtn} 
                onClick={handleSendReminder}
              >
                Send Reminder
              </button>
              <button 
                type="button"
                className={styles.modalSecondaryBtn} 
                onClick={() => setIsTimelineModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Gating Modal for Individual Plan */}
      {isFeatureGatingModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsFeatureGatingModalOpen(false)}>
          <div className={styles.modalCard} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h3 className={styles.modalTitle} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                🔒 Feature Restricted
              </h3>
              <button 
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}
                onClick={() => setIsFeatureGatingModalOpen(false)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className={styles.modalSubtitle} style={{ fontWeight: '600', color: 'var(--color-warning-text)', textAlign: 'left', marginBottom: 'var(--space-1)' }}>
              Assign Recovery Owner is available with Teams Plan
            </p>

            <p className={styles.modalSubtitle} style={{ fontSize: 'var(--font-size-caption)', textAlign: 'left', lineHeight: 'var(--line-height-normal)' }}>
              Collaborate with your finance team by assigning recovery opportunities, tracking ownership, and managing recovery progress together.
            </p>
            <p className={styles.modalSubtitle} style={{ fontSize: 'var(--font-size-caption)', textAlign: 'left', lineHeight: 'var(--line-height-normal)', fontWeight: 'bold' }}>
              Upgrade to Teams Plan to unlock this feature.
            </p>

            <div className={styles.modalActions}>
              <button 
                type="button" 
                className={styles.modalPrimaryBtn}
                onClick={handleUpgradeToTeamsInReport}
              >
                Upgrade to Teams Plan
              </button>
              <button 
                type="button" 
                className={styles.modalSecondaryBtn}
                onClick={() => setIsFeatureGatingModalOpen(false)}
              >
                Continue with Individual Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Owner Modal */}
      {isAssignModalOpen && assignmentContext && (
        <div className={styles.modalOverlay} onClick={() => setIsAssignModalOpen(false)}>
          <div className={styles.modalCard} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h3 className={styles.modalTitle} style={{ textAlign: 'left' }}>Assign Recovery Owner</h3>
              <button 
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}
                onClick={() => setIsAssignModalOpen(false)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <p className={styles.modalSubtitle} style={{ fontSize: 'var(--font-size-caption)', textAlign: 'left', marginBottom: 'var(--space-4)' }}>
              Assign a team member to lead the recovery of duplicate payments.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase', textAlign: 'left' }}>Item Mapped</label>
                <input 
                  type="text" 
                  readOnly 
                  value={assignmentContext.itemName}
                  style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-secondary)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase', textAlign: 'left' }}>Owner</label>
                <select 
                  value={assignmentContext.owner}
                  onChange={(e) => setAssignmentContext(prev => prev ? { ...prev, owner: e.target.value } : null)}
                  style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
                >
                  <option value="Logaprasanth N (Finance Lead)">Logaprasanth N (Finance Lead)</option>
                  <option value="Karthik R (Audit Senior)">Karthik R (Audit Senior)</option>
                  <option value="Sneha S (Accounts Receivable)">Sneha S (Accounts Receivable)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase', textAlign: 'left' }}>Target Recovery Date</label>
                <input 
                  type="date"
                  value={assignmentContext.targetDate}
                  onChange={(e) => setAssignmentContext(prev => prev ? { ...prev, targetDate: e.target.value } : null)}
                  style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase', textAlign: 'left' }}>Instructions / Comments</label>
                <textarea 
                  value={assignmentContext.comments}
                  onChange={(e) => setAssignmentContext(prev => prev ? { ...prev, comments: e.target.value } : null)}
                  rows={3}
                  style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', resize: 'vertical' }}
                />
              </div>
            </div>

            <div className={styles.modalActions} style={{ marginTop: 'var(--space-4)' }}>
              <button 
                type="button"
                className={styles.modalPrimaryBtn}
                onClick={() => {
                  alert(`Recovery owner assigned to: ${assignmentContext.owner}`);
                  setIsAssignModalOpen(false);
                }}
              >
                Assign
              </button>
              <button 
                type="button"
                className={styles.modalSecondaryBtn}
                onClick={() => setIsAssignModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Demo3ReportPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--color-background)', color: 'var(--color-text-secondary)' }}>Loading Workspace...</div>}>
      <ReportWorkspaceContent />
    </Suspense>
  );
}
