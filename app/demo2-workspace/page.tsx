'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  isUpdated?: boolean;
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
            confidence: '98%',
            details: {
              invoiceNo: 'INV-20341',
              poNo: 'PO-2026-089',
              vendor: 'ABC Pvt Ltd',
              invoiceDate: '2026-04-12',
              paymentDate: '2026-04-15',
              recoveryValue: '₹60,000',
              gstInfo: '18% GST (₹10,800)',
              confidenceScore: '98%',
              aiExplanation: 'The vendor ledger reports three distinct payments of ₹60,000 against a single invoice entry on 2026-04-15. Bank statements confirm three matching debits with identical transaction reference IDs.',
              recommendedAction: 'Issue a formal recovery debit note to ABC Pvt Ltd and initiate payment reconciliation.'
            }
          },
          {
            id: 'inv-20377',
            invoiceNo: 'INV-20377',
            potentialRecovery: '₹50,000',
            matchedBankEntries: 2,
            confidence: '97%',
            details: {
              invoiceNo: 'INV-20377',
              poNo: 'PO-2026-112',
              vendor: 'ABC Pvt Ltd',
              invoiceDate: '2026-04-28',
              paymentDate: '2026-05-02',
              recoveryValue: '₹50,000',
              gstInfo: '18% GST (₹9,000)',
              confidenceScore: '97%',
              aiExplanation: 'Two bank debits matching INV-20377 were processed across ledger databases due to manual data-entry mismatch.',
              recommendedAction: 'Request credit adjustment or direct refund from the vendor accounting team.'
            }
          },
          {
            id: 'inv-20410',
            invoiceNo: 'INV-20410',
            potentialRecovery: '₹50,000',
            matchedBankEntries: 2,
            confidence: '96%',
            details: {
              invoiceNo: 'INV-20410',
              poNo: 'PO-2026-145',
              vendor: 'ABC Pvt Ltd',
              invoiceDate: '2026-05-10',
              paymentDate: '2026-05-12',
              recoveryValue: '₹50,000',
              gstInfo: '18% GST (₹9,000)',
              confidenceScore: '96%',
              aiExplanation: 'A duplicate invoice balance was settled twice during manual record sync cycles.',
              recommendedAction: 'Offset next monthly vendor payable cycle by ₹50,000.'
            }
          }
        ]
      },
      {
        id: 'dup-xyz',
        name: 'XYZ Industries',
        potentialRecovery: '₹1,40,000',
        invoiceCount: 2,
        invoices: [
          {
            id: 'inv-88201',
            invoiceNo: 'INV-88201',
            potentialRecovery: '₹90,000',
            matchedBankEntries: 2,
            confidence: '95%',
            details: {
              invoiceNo: 'INV-88201',
              poNo: 'PO-2026-440',
              vendor: 'XYZ Industries',
              invoiceDate: '2026-03-20',
              paymentDate: '2026-03-24',
              recoveryValue: '₹90,000',
              gstInfo: '12% GST (₹10,800)',
              confidenceScore: '95%',
              aiExplanation: 'Double ledger posting resulted in two identical payouts being released to XYZ Industries.',
              recommendedAction: 'Submit statement audit reports to the vendor account executive.'
            }
          },
          {
            id: 'inv-88299',
            invoiceNo: 'INV-88299',
            potentialRecovery: '₹50,000',
            matchedBankEntries: 2,
            confidence: '96%',
            details: {
              invoiceNo: 'INV-88299',
              poNo: 'PO-2026-499',
              vendor: 'XYZ Industries',
              invoiceDate: '2026-04-05',
              paymentDate: '2026-04-09',
              recoveryValue: '₹50,000',
              gstInfo: '12% GST (₹6,000)',
              confidenceScore: '96%',
              aiExplanation: 'Re-entry of transaction ledger generated matching payments across two separate banks.',
              recommendedAction: 'Reconcile ledger entry variance and request bank refund.'
            }
          }
        ]
      },
      {
        id: 'dup-delta',
        name: 'Delta Manufacturing',
        potentialRecovery: '₹1,20,000',
        invoiceCount: 2,
        invoices: [
          {
            id: 'inv-30911',
            invoiceNo: 'INV-30911',
            potentialRecovery: '₹70,000',
            matchedBankEntries: 2,
            confidence: '94%',
            details: {
              invoiceNo: 'INV-30911',
              poNo: 'PO-2026-801',
              vendor: 'Delta Manufacturing',
              invoiceDate: '2026-05-18',
              paymentDate: '2026-05-20',
              recoveryValue: '₹70,000',
              gstInfo: '18% GST (₹12,600)',
              confidenceScore: '94%',
              aiExplanation: 'Multiple automated system sync batches generated duplicate validation entries.',
              recommendedAction: 'Inform Delta accounting desk of overpayment and request credit balance.'
            }
          },
          {
            id: 'inv-30950',
            invoiceNo: 'INV-30950',
            potentialRecovery: '₹50,000',
            matchedBankEntries: 2,
            confidence: '95%',
            details: {
              invoiceNo: 'INV-30950',
              poNo: 'PO-2026-840',
              vendor: 'Delta Manufacturing',
              invoiceDate: '2026-05-25',
              paymentDate: '2026-05-28',
              recoveryValue: '₹50,000',
              gstInfo: '18% GST (₹9,000)',
              confidenceScore: '95%',
              aiExplanation: 'Double payout detected on raw material purchase invoice record.',
              recommendedAction: 'Process recovery claim forms with verified payment logs.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'customer-recoveries',
    name: 'Outstanding Customer Recoveries',
    recoverableValue: '₹5,80,000',
    confidence: '94%',
    vendors: [
      {
        id: 'cust-global',
        name: 'Global Traders',
        potentialRecovery: '₹3,20,000',
        invoiceCount: 2,
        invoices: [
          {
            id: 'inv-cust-101',
            invoiceNo: 'INV-C-101',
            potentialRecovery: '₹1,80,000',
            matchedBankEntries: 0,
            confidence: '94%',
            details: {
              invoiceNo: 'INV-C-101',
              poNo: 'PO-GT-880',
              vendor: 'Global Traders',
              invoiceDate: '2026-02-10',
              paymentDate: 'Pending',
              recoveryValue: '₹1,80,000',
              gstInfo: '18% GST (₹32,400)',
              confidenceScore: '94%',
              aiExplanation: 'Unapplied bank deposits left this ledger balance open. Customers report payment, but bank reconciliation shows no matching inbound transaction reference.',
              recommendedAction: 'Reach out to customer accounts contact to verify transaction trace reference ID.'
            }
          },
          {
            id: 'inv-cust-102',
            invoiceNo: 'INV-C-102',
            potentialRecovery: '₹1,40,000',
            matchedBankEntries: 0,
            confidence: '93%',
            details: {
              invoiceNo: 'INV-C-102',
              poNo: 'PO-GT-895',
              vendor: 'Global Traders',
              invoiceDate: '2026-03-05',
              paymentDate: 'Pending',
              recoveryValue: '₹1,40,000',
              gstInfo: '18% GST (₹25,200)',
              confidenceScore: '93%',
              aiExplanation: 'Sales ledger records this invoice as outstanding; no bank matching reference trace detected.',
              recommendedAction: 'Follow up on unpaid invoice collections immediately.'
            }
          }
        ]
      },
      {
        id: 'cust-technova',
        name: 'TechNova Pvt Ltd',
        potentialRecovery: '₹2,60,000',
        invoiceCount: 2,
        invoices: [
          {
            id: 'inv-cust-201',
            invoiceNo: 'INV-C-201',
            potentialRecovery: '₹1,50,000',
            matchedBankEntries: 0,
            confidence: '95%',
            details: {
              invoiceNo: 'INV-C-201',
              poNo: 'PO-TN-410',
              vendor: 'TechNova Pvt Ltd',
              invoiceDate: '2026-03-12',
              paymentDate: 'Pending',
              recoveryValue: '₹1,50,000',
              gstInfo: '18% GST (₹27,000)',
              confidenceScore: '95%',
              aiExplanation: 'Invoice billed but ledger entries list no matching credit entries from TechNova bank portals.',
              recommendedAction: 'Submit ledger discrepancy reports to client accounts payable representative.'
            }
          },
          {
            id: 'inv-cust-202',
            invoiceNo: 'INV-C-202',
            potentialRecovery: '₹1,10,000',
            matchedBankEntries: 0,
            confidence: '92%',
            details: {
              invoiceNo: 'INV-C-202',
              poNo: 'PO-TN-432',
              vendor: 'TechNova Pvt Ltd',
              invoiceDate: '2026-04-18',
              paymentDate: 'Pending',
              recoveryValue: '₹1,10,000',
              gstInfo: '18% GST (₹19,800)',
              confidenceScore: '92%',
              aiExplanation: 'System reconciliation logs outstanding balances exceeding 90 days past payment terms.',
              recommendedAction: 'Issue past-due notifications and request status update.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'tax-variances',
    name: 'Tax Compliance Variances',
    recoverableValue: '₹8,50,000',
    confidence: '95%',
    vendors: [
      {
        id: 'tax-direct',
        name: 'Internal Compliance Audits',
        potentialRecovery: '₹8,50,000',
        invoiceCount: 1,
        invoices: [
          {
            id: 'gst-compliance-fy26',
            invoiceNo: 'GST-FY26-REC',
            potentialRecovery: '₹8,50,000',
            matchedBankEntries: 1,
            confidence: '95%',
            details: {
              invoiceNo: 'GST-FY26-REC',
              poNo: 'TAX-AUDIT-FY26',
              vendor: 'Direct Tax Audit',
              invoiceDate: '2026-06-30',
              paymentDate: 'Completed',
              recoveryValue: '₹8,50,000',
              gstInfo: 'Unclaimed GST Input Tax Credit',
              confidenceScore: '95%',
              aiExplanation: 'A gap between raw GSTR-2B logs and vendor AP ledgers has left ₹8,50,000 in unclaimed input tax credits. Reconciling transaction registers reveals active filings that were omitted from monthly filings.',
              recommendedAction: 'Amend upcoming GSTR filing returns to claim historical Input Tax Credits (ITC).'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'pricing-variances',
    name: 'Pricing Variance Opportunities',
    recoverableValue: '₹2,40,000',
    confidence: '88%',
    vendors: [
      {
        id: 'pv-omega',
        name: 'Omega Supplies',
        potentialRecovery: '₹2,40,000',
        invoiceCount: 1,
        invoices: [
          {
            id: 'inv-omega-901',
            invoiceNo: 'INV-OMEGA-901',
            potentialRecovery: '₹2,40,000',
            matchedBankEntries: 1,
            confidence: '88%',
            details: {
              invoiceNo: 'INV-OMEGA-901',
              poNo: 'PO-OMEGA-771',
              vendor: 'Omega Supplies',
              invoiceDate: '2026-05-02',
              paymentDate: '2026-05-05',
              recoveryValue: '₹2,40,000',
              gstInfo: '18% GST (₹43,200)',
              confidenceScore: '88%',
              aiExplanation: 'The vendor invoiced raw material purchases at a unit price of ₹250 instead of the contracted rate of ₹200. This pricing variance accounts for a leak of ₹2,40,000 across 4,800 units.',
              recommendedAction: 'Issue billing exception alert and recover overbilled pricing variance credit note.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'billing-exceptions',
    name: 'Contract Billing Exceptions',
    recoverableValue: '₹1,80,000',
    confidence: '92%',
    vendors: [
      {
        id: 'be-apex',
        name: 'Apex Logistics',
        potentialRecovery: '₹1,80,000',
        invoiceCount: 1,
        invoices: [
          {
            id: 'inv-apex-412',
            invoiceNo: 'INV-APEX-412',
            potentialRecovery: '₹1,80,000',
            matchedBankEntries: 1,
            confidence: '92%',
            details: {
              invoiceNo: 'INV-APEX-412',
              poNo: 'PO-APEX-998',
              vendor: 'Apex Logistics',
              invoiceDate: '2026-04-20',
              paymentDate: '2026-04-25',
              recoveryValue: '₹1,80,000',
              gstInfo: '18% GST (₹32,400)',
              confidenceScore: '92%',
              aiExplanation: 'Apex Logistics billed additional freight surcharges not covered in the master service contract.',
              recommendedAction: 'Dispute overbilled freight charge entries with client account representatives.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'early-discount',
    name: 'Early Payment Discount Recovery',
    recoverableValue: '₹1,30,000',
    confidence: '96%',
    vendors: [
      {
        id: 'ed-matrix',
        name: 'Matrix Tech Solutions',
        potentialRecovery: '₹1,30,000',
        invoiceCount: 1,
        invoices: [
          {
            id: 'inv-matrix-703',
            invoiceNo: 'INV-MATRIX-703',
            potentialRecovery: '₹1,30,000',
            matchedBankEntries: 1,
            confidence: '96%',
            details: {
              invoiceNo: 'INV-MATRIX-703',
              poNo: 'PO-MATRIX-302',
              vendor: 'Matrix Tech Solutions',
              invoiceDate: '2026-04-02',
              paymentDate: '2026-04-08',
              recoveryValue: '₹1,30,000',
              gstInfo: '18% GST (₹23,400)',
              confidenceScore: '96%',
              aiExplanation: 'The invoice was settled within the 10-day early discount window, but the discount of 2% (₹1,30,000) was not deducted from the processed payment.',
              recommendedAction: 'Submit a debit note for early payment rebate adjustment on next billing cycles.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'cross-border',
    name: 'Cross-border Billing Audit',
    recoverableValue: '₹4,30,000',
    confidence: '91%',
    vendors: [
      {
        id: 'cb-quantum',
        name: 'Quantum Services Inc',
        potentialRecovery: '₹4,30,000',
        invoiceCount: 1,
        invoices: [
          {
            id: 'inv-quantum-500',
            invoiceNo: 'INV-QUANTUM-500',
            potentialRecovery: '₹4,30,000',
            matchedBankEntries: 1,
            confidence: '91%',
            details: {
              invoiceNo: 'INV-QUANTUM-500',
              poNo: 'PO-QUANT-012',
              vendor: 'Quantum Services Inc',
              invoiceDate: '2026-05-01',
              paymentDate: '2026-05-04',
              recoveryValue: '₹4,30,000',
              gstInfo: 'Integrated GST (Import of Service)',
              confidenceScore: '91%',
              aiExplanation: 'Invoice was billed in USD but processed locally with double currency conversion fee overrides.',
              recommendedAction: 'Claim bank processing correction and billing adjustments.'
            }
          }
        ]
      }
    ]
  }
];

function AnimatedCounter({ targetValue, startValue, start }: { targetValue: number; startValue: number; start: boolean }) {
  const [displayVal, setDisplayVal] = useState(startValue);
  const animatedRef = useRef(false);

  useEffect(() => {
    let active = true;
    if (!start || animatedRef.current) return;
    animatedRef.current = true;

    const duration = 1800; // 1.8 seconds
    const startTimestamp = performance.now();
    let frameId: number;

    const update = (now: number) => {
      if (!active) return;
      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = Math.floor(startValue + easeProgress * (targetValue - startValue));
      setDisplayVal(currentValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(update);
      } else {
        setDisplayVal(targetValue);
      }
    };

    frameId = requestAnimationFrame(update);
    return () => {
      active = false;
      cancelAnimationFrame(frameId);
    };
  }, [targetValue, startValue, start]);

  // Indian formatting function
  const formatIndianCurrency = (value: number) => {
    const str = value.toString();
    if (str.length <= 3) return str;
    const lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    const formattedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return `${formattedOthers},${lastThree}`;
  };

  return <span>₹{formatIndianCurrency(displayVal)}</span>;
}

function StreamingText({ content, onComplete }: { content: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedText(content);
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    let currentIndex = 0;
    const charsPerSecond = 32; // Speed increased to ~32 characters per second (30-35 cps range)
    const delay = 1000 / charsPerSecond;

    if (!content) return;

    const timer = setInterval(() => {
      currentIndex += 1;
      setDisplayedText(content.substring(0, currentIndex));
      
      if (currentIndex >= content.length) {
        clearInterval(timer);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, delay);

    return () => clearInterval(timer);
  }, [content]);

  return (
    <>
      {displayedText.split('\n\n').map((para, i) => (
        <p key={i} className={styles.aiTextParagraph}>{para}</p>
      ))}
    </>
  );
}

function AnimatedAiBubble({ 
  id,
  content, 
  completedMessageIds,
  onComplete 
}: { 
  id: string;
  content: string; 
  completedMessageIds: Set<string>;
  onComplete?: () => void; 
}) {
  const isAlreadyCompleted = completedMessageIds.has(id);
  const [phase, setPhase] = useState<'hidden' | 'streaming' | 'complete'>(
    isAlreadyCompleted ? 'complete' : 'hidden'
  );

  useEffect(() => {
    if (isAlreadyCompleted) {
      setPhase('complete');
      return;
    }

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('complete');
      completedMessageIds.add(id);
      return;
    }

    // Thinking delay: Wait 300 ms (250-400 ms) before bubble appears
    const showTimer = setTimeout(() => {
      setPhase('streaming');
    }, 300);

    return () => clearTimeout(showTimer);
  }, [id, isAlreadyCompleted, completedMessageIds]);

  if (phase === 'hidden') {
    return null; // Return null so no empty container is visible during thinking delay
  }

  if (phase === 'streaming') {
    return (
      <div className={`${styles.aiBubble} ${styles.aiBubbleFadeIn}`}>
        <StreamingText 
          content={content} 
          onComplete={() => {
            completedMessageIds.add(id);
            setPhase('complete');
            if (onComplete) onComplete();
          }} 
        />
      </div>
    );
  }

  return (
    <div className={styles.aiBubble}>
      {content.split('\n\n').map((para, i) => (
        <p key={i} className={styles.aiTextParagraph}>{para}</p>
      ))}
    </div>
  );
}

type ScrollStage = 'none' | 'ai_acknowledgement' | 'processing' | 'executive_assessment';

export default function Demo2WorkspacePage() {
  const router = useRouter();
  const [completedMessageIds, setCompletedMessageIds] = useState<Set<string>>(new Set());
  const markMessageCompleted = (id: string) => {
    setCompletedMessageIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };
  const [isTransitioned, setIsTransitioned] = useState(false);
  const reconcile1ProcessingTriggeredRef = useRef(false);
  const reconcile2ProcessingTriggeredRef = useRef(false);
  const [promptValue, setPromptValue] = useState("");
  const [conversation, setConversation] = useState<MessageBlock[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const assessmentCardRef = useRef<HTMLDivElement>(null);
  const [reconcile1Started, setReconcile1Started] = useState(false);
  const [reconcile2Started, setReconcile2Started] = useState(false);
  const [scrolledCards, setScrolledCards] = useState<Record<string, boolean>>({});
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrolledMsgIdRef = useRef<string | null>(null);
  const [scrollStage, setScrollStage] = useState<ScrollStage>('none');
  type PaymentStep = 'none' | 'upgrade_modal' | 'payment_methods' | 'payment_loading';
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('none');
  const [reportUnlocked, setReportUnlocked] = useState(false);
  const [activeReportId, setActiveReportId] = useState<string>('current-assessment');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentAssessmentTitle, setCurrentAssessmentTitle] = useState("New Assessment");
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  // Assign Owner Modal & Toast States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignModalData, setAssignModalData] = useState<{
    contextName: string;
    owner: string;
    priority: string;
    targetDate: string;
    comments: string;
  }>({
    contextName: '',
    owner: 'Sarah Williams',
    priority: 'High',
    targetDate: '2026-08-15',
    comments: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [mounted, setMounted] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<{
    text: string;
    subtext: string;
    rect: DOMRect | null;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (chatScrollRef.current && conversation.length > 0) {
      const lastMsg = conversation[conversation.length - 1];
      const isUserMessage = lastMsg?.role === 'user';
      
      if (isUserMessage) {
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current);
        }
        chatScrollRef.current.scrollTo({
          top: chatScrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    } else if (chatScrollRef.current && conversation.length === 0) {
      chatScrollRef.current.scrollTop = 0;
    }
  }, [conversation]);

  const openAssignModal = (contextName: string) => {
    setAssignModalData({
      contextName,
      owner: 'Sarah Williams',
      priority: 'High',
      targetDate: '2026-08-15',
      comments: `Please validate duplicate payment and initiate recovery for ${contextName}.`
    });
    setIsAssignModalOpen(true);
  };

  const handleStartRecoveryClick = (e: React.MouseEvent, type: 'category' | 'vendor', name: string) => {
    e.stopPropagation();
    setActiveTooltip(null);
    setToastMessage("Recovery communication initiated successfully.");
    setShowToast(true);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveTooltip({
      text: "Initiate recovery communication.",
      subtext: "Sends a pre-filled follow-up email to the vendor or responsible contact requesting verification and recovery of the identified payment discrepancy.",
      rect,
    });
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssignModalOpen(false);
    setToastMessage(`✓ Recovery opportunity assigned successfully. Assigned to ${assignModalData.owner}.`);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Centralized scroll handler for text blocks or processing indicator
  const scrollToElement = (element: HTMLElement | null, msgId: string, stage: ScrollStage) => {
    if (!element || scrollStage !== stage || lastScrolledMsgIdRef.current === msgId) return;

    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = setTimeout(() => {
      lastScrolledMsgIdRef.current = msgId;
      
      const container = chatScrollRef.current;
      if (!container) {
        setScrollStage('none');
        return;
      }

      // Check distance: if already at the bottom or close to it (within 10px tolerance)
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const currentDiff = Math.abs(elementRect.bottom - containerRect.bottom);

      if (currentDiff < 10) {
        setTimeout(() => {
          setScrollStage('none');
        }, 180);
        return;
      }

      element.scrollIntoView({ behavior: 'smooth', block: 'end' });

      let scrollTimeout: NodeJS.Timeout;
      const onScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          container.removeEventListener('scroll', onScroll);
          setTimeout(() => {
            setScrollStage('none');
          }, 180);
        }, 100);
      };

      container.addEventListener('scroll', onScroll);

      // Fallback timer
      const fallbackTimeout = setTimeout(() => {
        container.removeEventListener('scroll', onScroll);
        setScrollStage('none');
      }, 1200);

      const originalOnScroll = onScroll;
      const wrappedOnScroll = () => {
        clearTimeout(fallbackTimeout);
        originalOnScroll();
      };
      container.removeEventListener('scroll', onScroll);
      container.addEventListener('scroll', wrappedOnScroll);

    }, 150);
  };

  // Centralized scroll handler with resilient scroll settle listeners for assessment
  const scrollToAssessmentTop = (element: HTMLDivElement | null, msgId: string) => {
    if (!element || scrollStage !== 'executive_assessment' || lastScrolledMsgIdRef.current === msgId) return;

    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = setTimeout(() => {
      lastScrolledMsgIdRef.current = msgId;
      
      const container = chatScrollRef.current;
      if (!container) {
        setScrolledCards(prev => ({ ...prev, [msgId]: true }));
        setScrollStage('none');
        return;
      }

      // Check distance: if element is already aligned to the top of the container (within 5px tolerance)
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const currentDiff = Math.abs(elementRect.top - containerRect.top);

      if (currentDiff < 5) {
        // Already at position! Trigger after 180ms buffer
        setTimeout(() => {
          setScrolledCards(prev => ({ ...prev, [msgId]: true }));
          setScrollStage('none');
        }, 180);
        return;
      }

      // Otherwise, trigger smooth scroll and listen to container scroll settle
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      let scrollTimeout: NodeJS.Timeout;
      
      const onScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          container.removeEventListener('scroll', onScroll);
          // Wait 150-200ms buffer after scroll settles
          setTimeout(() => {
            setScrolledCards(prev => ({ ...prev, [msgId]: true }));
            setScrollStage('none');
          }, 180);
        }, 100);
      };

      container.addEventListener('scroll', onScroll);

      // Fallback timer: in case scroll listener fails to fire (e.g. system lags or edge case)
      // after 1200ms we force-settle
      const fallbackTimeout = setTimeout(() => {
        container.removeEventListener('scroll', onScroll);
        setScrolledCards(prev => ({ ...prev, [msgId]: true }));
        setScrollStage('none');
      }, 1200);

      // Clear fallback timeout if scroll listener does fire
      const originalOnScroll = onScroll;
      const wrappedOnScroll = () => {
        clearTimeout(fallbackTimeout);
        originalOnScroll();
      };
      container.removeEventListener('scroll', onScroll);
      container.addEventListener('scroll', wrappedOnScroll);

    }, 300); // 300ms layout settle time
  };

  // Trigger AI response when all documents are validated
  useEffect(() => {
    const coreDocs = ['bank-statements', 'ar-report', 'ap-ledger'];
    const allCoreValidated = coreDocs.every(id => uploadStates[id].status === 'validated');
    
    if (allCoreValidated && isTransitioned && !reconcile1Started) {
      setReconcile1Started(true);

      const aiMsgId = `ai-batch-complete-${Math.random().toString(36).substring(2, 9)}`;

      const aiMsg: MessageBlock = {
        id: aiMsgId,
        role: 'assistant',
        type: 'text',
        content: `Excellent. I now have sufficient information to perform an initial recovery assessment.`
      };

      setScrollStage('ai_acknowledgement');
      setConversation(prevHistory => [...prevHistory, aiMsg]);
    }
  }, [uploadStates, isTransitioned, reconcile1Started]);

  // Trigger second reconciliation when all recommended documents are validated
  useEffect(() => {
    const recommendedDocs = ['gst-returns', 'sales-register', 'customer-ledger'];
    const allRecommendedValidated = recommendedDocs.every(id => uploadStates[id].status === 'validated');
    
    if (allRecommendedValidated && isTransitioned && !reconcile2Started) {
      setReconcile2Started(true);

      const aiMsgId2 = `ai-second-complete-${Math.random().toString(36).substring(2, 9)}`;

      const aiMsg: MessageBlock = {
        id: aiMsgId2,
        role: 'assistant',
        type: 'text',
        content: `Excellent. I have received the additional supporting documents and will now perform a deeper reconciliation across your financial records.`
      };

      setScrollStage('ai_acknowledgement');
      setConversation(prevHistory => [...prevHistory, aiMsg]);
    }
  }, [uploadStates, isTransitioned, reconcile2Started]);

  // Listen for AI message completions to trigger subsequent workflow stages sequentially
  useEffect(() => {
    // 1. Initial Assessment Trigger: wait for aiMsgId to complete streaming
    const matchingKey = Array.from(completedMessageIds).find(id => id.startsWith('ai-batch-complete-'));
    if (matchingKey && !reconcile1ProcessingTriggeredRef.current) {
      reconcile1ProcessingTriggeredRef.current = true;
      
      // Wait a very short moment (around 150-250 ms) after streaming completes
      setTimeout(() => {
        const suffix = matchingKey.split('-').slice(-1)[0];
        const processingMsgId = `ai-processing-${suffix}`;
        const completedTextMsgId = `ai-completed-text-1-${suffix}`;
        const assessmentMsgId = `ai-assessment-card-1-${suffix}`;
        const recommendTextMsgId = `ai-recommend-text-${suffix}`;
        const enterpriseAlertMsgId = `ai-enterprise-alert-${suffix}`;
        const recommendDocsMsgId = `ai-recommend-docs-${suffix}`;

        const processingMsg: MessageBlock = {
          id: processingMsgId,
          role: 'assistant',
          type: 'processing_indicator'
        };

        setScrollStage('processing');
        setConversation(h => {
          const hasProcessing = h.some(msg => msg.id === processingMsgId);
          if (hasProcessing) return h;
          return [...h, processingMsg];
        });

        // Schedule transitioning to Executive Assessment Card after 3.5 seconds
        setTimeout(() => {
          setConversation(h => {
            const withoutProcessing = h.filter(msg => msg.id !== processingMsgId);
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

            setCurrentAssessmentTitle("Revenue Recovery Assessment");

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

              // Schedule Refinement 2: Standalone Enterprise Alert Callout (600ms after text)
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

                // Schedule Refinement 3: Additional Supporting Documents request block (600ms after alert)
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

            setScrollStage('executive_assessment');
            return [...withoutProcessing, completedTextMsg, assessmentMsg];
          });
        }, 3500);

      }, 200); // Delay before starting next step: 200ms (150-250ms)
    }

    // 2. Second Assessment Trigger: wait for aiMsgId2 to complete streaming
    const matchingKey2 = Array.from(completedMessageIds).find(id => id.startsWith('ai-second-complete-'));
    if (matchingKey2 && !reconcile2ProcessingTriggeredRef.current) {
      reconcile2ProcessingTriggeredRef.current = true;

      // Wait a very short moment (around 150-250 ms) after streaming completes
      setTimeout(() => {
        const suffix2 = matchingKey2.split('-').slice(-1)[0];
        const processingMsgId2 = `ai-processing-2-${suffix2}`;
        const completedTextMsgId2 = `ai-completed-text-2-${suffix2}`;
        const assessmentMsgId2 = `ai-assessment-card-2-${suffix2}`;

        const processingMsg: MessageBlock = {
          id: processingMsgId2,
          role: 'assistant',
          type: 'processing_indicator'
        };

        setScrollStage('processing');
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

            setScrollStage('executive_assessment');
            return [...withoutProcessing, completedTextMsg, assessmentMsg];
          });
        }, 3500);

      }, 200); // Delay before starting next step: 200ms (150-250ms)
    }
  }, [completedMessageIds]);



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
      setConversation([userMsg]);

      setTimeout(() => {
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

        setConversation(prev => [...prev, aiMsg, docReqMsg]);
      }, 800);
    } else {
      setConversation((prev) => [...prev, userMsg]);
      setPromptValue("");

      if (reportUnlocked) {
        const lower = queryText.toLowerCase();
        let responseContent = "";
        if (lower.includes("recommendation") || lower.includes("prioritize") || lower.includes("action")) {
          responseContent = "Based on the Executive Recovery Report, we recommend prioritizing these top items:\n\n1. **Consolidate vendor records weekly**: This will mitigate Duplicate Vendor Payments (₹4,20,000 opportunity).\n2. **Automate AR alerts**: This targets the Outstanding Customer Recoveries (₹5,80,000 opportunity) where sync latency causes leakage.\n3. **Resolve GST reconciliation variances**: This captures input tax credits (₹3,10,000 opportunity).";
        } else if (lower.includes("recoverable") || lower.includes("why") || lower.includes("amount") || lower.includes("value")) {
          responseContent = "The ₹31,40,000 recoverable value is derived from cross-document reconciliation of bank statements, AP ledgers, sales registers, and GST filings. Leakage was validated in duplicate payments (₹4,20,000) and outstanding recoveries (₹5,80,000).";
        } else if (lower.includes("transaction") || lower.includes("invoice") || lower.includes("detail")) {
          responseContent = "The report identifies 42 pricing variances and 17 duplicate payments. Under the Recovery Opportunity Breakdown, you can review the specific transactions matching Duplicate Vendor Payments (₹4,20,000) and pricing variance opportunities (₹2,40,000).";
        } else if (lower.includes("confidence") || lower.includes("score")) {
          responseContent = "The recovery assessment holds a 98.6% AI Confidence score. This is backed by comprehensive cross-document reconciliation and double-entry validation across 8 identified opportunity categories.";
        } else if (lower.includes("summarize") || lower.includes("cfo") || lower.includes("leadership")) {
          responseContent = "Here is a summary for leadership: DARP successfully reconciled ₹31,40,000 in verified recoverable value with 98.6% confidence. The leakage stems primarily from system sync latency in Accounts Receivable and duplicate vendor payments. Addressing these yields immediate cash flow recovery.";
        } else {
          responseContent = "The Executive Recovery Report has been compiled successfully. I am ready to answer any questions or summarize findings regarding the recovery opportunities, recommendations, or root cause analysis.";
        }

        const replyId = `ai-reply-${Math.random().toString(36).substring(2, 9)}`;
        const loaderId = `ai-reply-loader-${Math.random().toString(36).substring(2, 9)}`;

        setScrollStage('processing');
        setConversation(prev => [...prev, {
          id: loaderId,
          role: 'assistant',
          type: 'processing_indicator'
        }]);

        setTimeout(() => {
          setConversation(prev => {
            const filtered = prev.filter(m => m.id !== loaderId);
            setScrollStage('ai_acknowledgement');
            return [...filtered, {
              id: replyId,
              role: 'assistant',
              type: 'text',
              content: responseContent
            }];
          });
        }, 1200);
      }
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

          {/* Center: Dynamic Assessment Context Header */}
          <div className={styles.headerCenter}>
            <div className={styles.workspaceHeaderTitleContainer}>
              <span className={styles.workspaceHeaderTitle}>{currentAssessmentTitle}</span>
            </div>
          </div>

          {/* Right: Authenticated User Profile & Back to Home Action */}
          <div className={styles.navAction}>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>JA</div>
              <span className={styles.userName}>John Anderson</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleBackToHome} className={styles.backButton}>
              ← Back to Home
            </Button>
          </div>
        </Container>
      </header>

      {/* WORKSPACE AREA */}
      <main className={styles.workspaceArea}>
        <Container className={`${styles.workspaceContainer} ${reportUnlocked ? styles.splitLayoutContainer : ''}`}>
          
          {/* Main workspace container that transitions layout */}
          <div className={`${styles.workspaceMain} ${isTransitioned ? styles.transitioned : ''} ${reportUnlocked ? styles.leftSplitWorkspace : ''}`}>
            
            {/* Scrollable Conversation Container */}
            {isTransitioned && (
              <div className={styles.conversationContainer} ref={chatScrollRef} aria-live="polite">
                <div className={styles.conversationContentWidth}>
                   {conversation.map((msg, index) => {
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

                      const isPrecedingTextPending = (() => {
                        for (let i = index - 1; i >= 0; i--) {
                          const prevMsg = conversation[i];
                          if (prevMsg.type === 'text') {
                            return !completedMessageIds.has(prevMsg.id);
                          }
                        }
                        return false;
                      })();

                      if (msg.type === 'text') {
                        return (
                          <div 
                            key={msg.id} 
                            ref={el => scrollToElement(el, msg.id, 'ai_acknowledgement')}
                            className={styles.aiMessageRow}
                          >
                            <div className={styles.aiAvatar} title="DARP AI Assistant">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <rect x="3" y="11" width="18" height="10" rx="2" />
                                <circle cx="12" cy="5" r="2" />
                                <path d="M12 7v4" />
                                <line x1="8" y1="16" x2="8" y2="16.01" />
                                <line x1="16" y1="16" x2="16" y2="16.01" />
                              </svg>
                            </div>
                            <AnimatedAiBubble 
                              id={msg.id}
                              content={msg.content ?? ''} 
                              completedMessageIds={completedMessageIds}
                              onComplete={() => markMessageCompleted(msg.id)}
                            />
                          </div>
                        );
                      } else if (msg.type === 'document_request') {
                        if (isPrecedingTextPending) return null;
                        return (
                          <div key={msg.id} className={`${styles.aiMessageRowCentered} ${styles.actionContainerFadeIn}`}>
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
                          <div 
                            key={msg.id} 
                            ref={el => scrollToElement(el, msg.id, 'processing')}
                            className={styles.aiMessageRow}
                          >
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
                        if (isPrecedingTextPending) return null;
                        const isCard2 = msg.isUpdated === true;
                        return (
                          <div 
                            key={msg.id} 
                            ref={el => scrollToAssessmentTop(el, msg.id)} 
                            className={`${styles.aiMessageRowCentered} ${styles.actionContainerFadeIn}`}
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
                                  {isCard2 ? (
                                    <AnimatedCounter targetValue={3140000} startValue={785000} start={!!scrolledCards[msg.id]} />
                                  ) : (
                                    <AnimatedCounter targetValue={1860000} startValue={465000} start={!!scrolledCards[msg.id]} />
                                  )}
                                </span>
                                <p className={styles.metricLabel}>
                                  {isCard2 
                                    ? 'Cross-document reconciliation has increased assessment confidence and uncovered additional verified recovery opportunities worth an estimated ₹31,40,000.'
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
                                      Projected Annual Exposure: <strong>₹52,00,000</strong>
                                      <br />
                                      If current financial patterns continue, the projected annual revenue exposure could exceed ₹52,00,000.
                                    </>
                                  ) : (
                                    <>
                                      Revenue leakage has been identified across the last six months. If similar financial patterns continue, your annual exposure could exceed <strong>₹38,00,000</strong>.
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
                                  <div className={reportUnlocked ? styles.opportunityTableWrapper : styles.blurredOpportunityTableWrapper}>
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
                                          <td>₹4,20,000</td>
                                          <td>98%</td>
                                          <td><span className={styles.badgeSuccess}>High Opportunity</span></td>
                                        </tr>
                                        <tr>
                                          <td>Outstanding Customer Recoveries</td>
                                          <td>₹5,80,000</td>
                                          <td>94%</td>
                                          <td><span className={styles.badgeSuccess}>High Opportunity</span></td>
                                        </tr>
                                        <tr>
                                          <td>Unclaimed Tax Credits</td>
                                          <td>₹3,10,000</td>
                                          <td>90%</td>
                                          <td><span className={styles.badgeWarning}>Medium Opportunity</span></td>
                                        </tr>
                                        <tr>
                                          <td>Pricing Variance Opportunities</td>
                                          <td>₹2,40,000</td>
                                          <td>88%</td>
                                          <td><span className={styles.badgeWarning}>Medium Opportunity</span></td>
                                        </tr>
                                        <tr>
                                          <td>Contract Billing Exceptions</td>
                                          <td>₹1,80,000</td>
                                          <td>92%</td>
                                          <td><span className={styles.badgeWarning}>Medium Opportunity</span></td>
                                        </tr>
                                        <tr>
                                          <td>Early Payment Discount Recovery</td>
                                          <td>₹1,30,000</td>
                                          <td>96%</td>
                                          <td><span className={styles.badgeSuccess}>High Opportunity</span></td>
                                        </tr>
                                        {isCard2 && (
                                          <>
                                            <tr>
                                              <td>Tax Compliance Variances</td>
                                              <td>₹8,50,000</td>
                                              <td>95%</td>
                                              <td><span className={styles.badgeSuccess}>High Opportunity</span></td>
                                            </tr>
                                            <tr>
                                              <td>Cross-border Billing Audit</td>
                                              <td>₹4,30,000</td>
                                              <td>91%</td>
                                              <td><span className={styles.badgeWarning}>Medium Opportunity</span></td>
                                            </tr>
                                          </>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                  
                                  {/* Premium Lock Overlay Panel */}
                                  {!reportUnlocked && (
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
                                      
                                      <button 
                                        className={styles.continueCTA} 
                                        type="button"
                                        onClick={() => setPaymentStep('upgrade_modal')}
                                      >
                                        {isCard2 ? '🔒 Unlock Executive Recovery Report' : '🔒 Unlock Full Recovery Report'}
                                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                          <line x1="5" y1="12" x2="19" y2="12" />
                                          <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      } else if (msg.type === 'enterprise_alert') {
                        if (isPrecedingTextPending) return null;
                        return (
                          <div key={msg.id} className={`${styles.aiMessageRowCentered} ${styles.actionContainerFadeIn}`}>
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
                        if (isPrecedingTextPending) return null;
                        return (
                          <div key={msg.id} className={`${styles.aiMessageRowCentered} ${styles.actionContainerFadeIn}`}>
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
            {/* Sticky Assessment History FAB */}
            {isTransitioned && (
              <div className={styles.fabWrapper}>
                <button 
                  className={styles.historyFab} 
                  onClick={() => setIsHistoryOpen(true)}
                  type="button"
                  aria-label="Assessment History"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'scaleX(-1)' }}>
                    <path d="M12 8v4l3 3" />
                    <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
                  </svg>
                </button>
                <span className={styles.historyFabTooltip}>Assessment History</span>
              </div>
            )}
          </div>

          {/* Right Side: Reusable Executive Recovery Report Panel */}
          {reportUnlocked && activeReportId === 'current-assessment' && (
            <div className={styles.reportPanel} aria-label="Executive Recovery Report Workspace">
              <div className={styles.reportHeader}>
                <h3 className={styles.reportTitle}>Executive Recovery Report</h3>
                <p className={styles.reportSubtitle}>AI-generated from reconciled financial documents</p>
              </div>

              <div className={styles.reportMetricCard}>
                <div className={styles.reportMetricTitle}>Total Recoverable Value</div>
                <div className={styles.reportMetricValue}>₹31,40,000</div>
                <p className={styles.reportText} style={{ fontSize: '11px', opacity: 0.8 }}>
                  Cross-document verification score: 98.6% Confidence
                </p>
              </div>

              <div className={styles.reportSection}>
                <h4 className={styles.reportSectionTitle}>Recovery Opportunities</h4>
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
                              <button
                                type="button"
                                className={styles.startRecoveryBtn}
                                onClick={(e) => handleStartRecoveryClick(e, 'category', cat.name)}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
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
                              <span className={styles.opportunityVal}>{cat.recoverableValue}</span>
                            </div>
                          </div>
                        </div>

                        {/* Level 2: Vendor List Expansion */}
                        {isCatExpanded && (
                          <div className={styles.categoryExpansion} onClick={(e) => e.stopPropagation()}>
                            <h5 className={styles.expansionSubheading}>Affected Vendors</h5>
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
                                        <button
                                          type="button"
                                          className={styles.startRecoveryBtn}
                                          onClick={(e) => handleStartRecoveryClick(e, 'vendor', vendor.name)}
                                          onMouseEnter={handleMouseEnter}
                                          onMouseLeave={handleMouseLeave}
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
                                        <span className={styles.vendorValText}>{vendor.potentialRecovery}</span>
                                        <span className={styles.vendorMetaText}>{vendor.invoiceCount} invoices</span>
                                      </div>
                                    </div>

                                    {/* Level 3: Invoice List Expansion */}
                                    {isVendorExpanded && (
                                      <div className={styles.vendorExpansion} onClick={(e) => e.stopPropagation()}>
                                        <h6 className={styles.expansionSubheading}>Invoices</h6>
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
                                                        <button
                                                          type="button"
                                                          className={styles.startRecoveryBtn}
                                                          onClick={(e) => handleStartRecoveryClick(e, 'vendor', inv.details.vendor)}
                                                          onMouseEnter={handleMouseEnter}
                                                          onMouseLeave={handleMouseLeave}
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
                <button className={styles.exportBtn} type="button">
                  📥 Download Full PDF (Mock)
                </button>
                <button className={styles.exportBtn} type="button">
                  📊 Export Presentation Deck (Mock)
                </button>
                <button className={styles.exportBtn} type="button">
                  🔗 Share Assessment Link
                </button>
              </div>
            </div>
          )}

        </Container>
      </main>

      {/* Premium Upgrade Modal */}
      {paymentStep !== 'none' && (
        <div className={styles.modalOverlay}>
          {paymentStep === 'upgrade_modal' && (
            <div className={styles.modalCard}>
              <h3 className={styles.modalTitle}>Unlock Executive Recovery Report</h3>
              <p className={styles.modalSubtitle}>Upgrade to access your complete AI-generated Executive Recovery Report.</p>
              
              <div className={styles.planCard}>
                <div className={styles.planHeader}>
                  <span className={styles.planName}>Enterprise Recovery Report</span>
                  <span className={styles.planSubtitle}>One-time Assessment</span>
                </div>
                <div className={styles.planPrice}>₹4,999</div>
              </div>

              <div className={styles.featuresSection}>
                <h4 className={styles.featuresTitle}>Included Features:</h4>
                <ul className={styles.featuresList}>
                  <li className={styles.featureItem}>Executive Summary</li>
                  <li className={styles.featureItem}>Complete Recovery Opportunities</li>
                  <li className={styles.featureItem}>AI Recommendations</li>
                  <li className={styles.featureItem}>Root Cause Analysis</li>
                  <li className={styles.featureItem}>Financial Impact Report</li>
                  <li className={styles.featureItem}>Executive Presentation</li>
                  <li className={styles.featureItem}>PDF Export (Mock)</li>
                </ul>
              </div>

              <div className={styles.modalActions}>
                <button 
                  className={styles.modalPrimaryBtn}
                  onClick={() => setPaymentStep('payment_methods')}
                >
                  Proceed to Payment
                </button>
                <button 
                  className={styles.modalSecondaryBtn}
                  onClick={() => setPaymentStep('none')}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {paymentStep === 'payment_methods' && (
            <div className={styles.modalCard}>
              <h3 className={styles.modalTitle}>Mock Payment</h3>
              
              <div className={styles.paymentSummary}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Assessment Name</span>
                  <span className={styles.summaryValue}>Enterprise Recovery Report</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Price</span>
                  <span className={styles.summaryValue}>₹4,999</span>
                </div>
              </div>

              <h4 className={styles.methodsTitle}>Select Payment Method:</h4>
              <div className={styles.paymentMethods}>
                <div className={`${styles.paymentMethod} ${styles.activeMethod}`}>
                  <input type="radio" id="card" name="payment_method" defaultChecked />
                  <label htmlFor="card">Credit / Debit Card</label>
                </div>
                <div className={styles.paymentMethod}>
                  <input type="radio" id="upi" name="payment_method" />
                  <label htmlFor="upi">UPI</label>
                </div>
                <div className={styles.paymentMethod}>
                  <input type="radio" id="netbanking" name="payment_method" />
                  <label htmlFor="netbanking">Net Banking</label>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button 
                  className={styles.modalPrimaryBtn}
                  onClick={() => {
                    setPaymentStep('payment_loading');
                    setTimeout(() => {
                      setPaymentStep('none');
                      setReportUnlocked(true);
                    }, 2000);
                  }}
                >
                  Complete Payment
                </button>
                <button 
                  className={styles.modalSecondaryBtn}
                  onClick={() => setPaymentStep('upgrade_modal')}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {paymentStep === 'payment_loading' && (
            <div className={`${styles.modalCard} ${styles.loadingModal}`}>
              <div className={styles.successCheckCircle}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className={styles.successTitle}>✅ Payment Successful</h3>
              <p className={styles.successSubtitle}>Preparing your Executive Recovery Report...</p>
              <div className={styles.premiumProgressLine}>
                <div className={styles.premiumProgressActive} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Assessment History Slide-over Drawer */}
      {isHistoryOpen && (
        <>
          {/* Backdrop */}
          <div className={styles.drawerBackdrop} onClick={() => setIsHistoryOpen(false)} />
          
          {/* Drawer Panel */}
          <div className={styles.drawerPanel} aria-label="Assessment History Drawer">
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle}>🕘 Assessment History</h3>
              <button 
                className={styles.drawerCloseBtn} 
                onClick={() => setIsHistoryOpen(false)}
                type="button"
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>
            
            <div className={styles.drawerContent}>
              <div className={styles.historyList}>
                {/* Item 1 */}
                <div 
                  className={`${styles.historyCard} ${styles.activeHistoryCard}`} 
                  onClick={() => {
                    setCurrentAssessmentTitle("Revenue Recovery Assessment");
                    setIsHistoryOpen(false);
                  }}
                >
                  <div className={styles.historyCardHeader}>
                    <span className={styles.historyCardName}>Revenue Recovery Assessment</span>
                    <span className={`${styles.historyBadge} ${styles.badgeActive}`}>Active</span>
                  </div>
                  <div className={styles.historyCardMeta}>
                    <span className={styles.historyCardDate}>Aug 3, 2026</span>
                    <span className={styles.historyCardAmount}>₹31,40,000</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div 
                  className={styles.historyCard} 
                  onClick={() => {
                    setCurrentAssessmentTitle("GST Compliance Assessment");
                    setIsHistoryOpen(false);
                  }}
                >
                  <div className={styles.historyCardHeader}>
                    <span className={styles.historyCardName}>GST Validation Assessment</span>
                    <span className={`${styles.historyBadge} ${styles.badgeCompleted}`}>Completed</span>
                  </div>
                  <div className={styles.historyCardMeta}>
                    <span className={styles.historyCardDate}>Jul 15, 2026</span>
                    <span className={styles.historyCardAmount}>₹12,50,000</span>
                  </div>
                </div>

                {/* Item 3 */}
                <div 
                  className={styles.historyCard} 
                  onClick={() => {
                    setCurrentAssessmentTitle("Customer Recovery Assessment");
                    setIsHistoryOpen(false);
                  }}
                >
                  <div className={styles.historyCardHeader}>
                    <span className={styles.historyCardName}>Customer Recovery Review</span>
                    <span className={`${styles.historyBadge} ${styles.badgeCompleted}`}>Completed</span>
                  </div>
                  <div className={styles.historyCardMeta}>
                    <span className={styles.historyCardDate}>Jun 28, 2026</span>
                    <span className={styles.historyCardAmount}>₹8,20,000</span>
                  </div>
                </div>

                {/* Item 4 */}
                <div 
                  className={styles.historyCard} 
                  onClick={() => {
                    setCurrentAssessmentTitle("Vendor Audit Assessment");
                    setIsHistoryOpen(false);
                  }}
                >
                  <div className={styles.historyCardHeader}>
                    <span className={styles.historyCardName}>Vendor Audit Report</span>
                    <span className={`${styles.historyBadge} ${styles.badgeCompleted}`}>Completed</span>
                  </div>
                  <div className={styles.historyCardMeta}>
                    <span className={styles.historyCardDate}>May 12, 2026</span>
                    <span className={styles.historyCardAmount}>₹15,40,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Assign Recovery Owner Modal */}
      {isAssignModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard} role="dialog" aria-modal="true">
            <h3 className={styles.modalTitle}>Assign Recovery Owner</h3>
            <p className={styles.modalSubtitle} style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
              Context: {assignModalData.contextName}
            </p>
            
            <form onSubmit={handleAssignSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Recovery Owner</label>
                <select 
                  className={styles.formSelect}
                  value={assignModalData.owner}
                  onChange={(e) => setAssignModalData({ ...assignModalData, owner: e.target.value })}
                >
                  <option value="John Anderson">John Anderson</option>
                  <option value="Sarah Williams">Sarah Williams</option>
                  <option value="Michael Chen">Michael Chen</option>
                  <option value="Priya Raman">Priya Raman</option>
                  <option value="David Johnson">David Johnson</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Priority</label>
                <select 
                  className={styles.formSelect}
                  value={assignModalData.priority}
                  onChange={(e) => setAssignModalData({ ...assignModalData, priority: e.target.value })}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target Completion</label>
                <input 
                  type="date" 
                  className={styles.formInput}
                  value={assignModalData.targetDate}
                  onChange={(e) => setAssignModalData({ ...assignModalData, targetDate: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Comments</label>
                <textarea 
                  className={styles.formTextarea}
                  rows={3}
                  value={assignModalData.comments}
                  onChange={(e) => setAssignModalData({ ...assignModalData, comments: e.target.value })}
                  placeholder="Please validate duplicate payment and initiate recovery."
                />
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.modalPrimaryBtn}>
                  Assign Recovery
                </button>
                <button 
                  type="button" 
                  className={styles.modalSecondaryBtn}
                  onClick={() => setIsAssignModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightweight Success Toast */}
      {showToast && (
        <div className={styles.successToast} role="alert">
          <span className={styles.toastCheck}>✓</span>
          <div className={styles.toastContent}>
            {toastMessage}
          </div>
        </div>
      )}

      {/* Floating portal tooltip to prevent clipping */}
      {mounted && activeTooltip && createPortal(
        <div 
          className={styles.portalTooltip}
          style={{
            position: 'fixed',
            left: `${(activeTooltip.rect?.left ?? 0) + (activeTooltip.rect?.width ?? 0) / 2}px`,
            top: `${(activeTooltip.rect?.top ?? 0) - 8}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 99999,
            pointerEvents: 'none',
          }}
        >
          <strong>{activeTooltip.text}</strong>
          <p className={styles.tooltipSubtext}>{activeTooltip.subtext}</p>
          <div className={styles.portalTooltipArrow} />
        </div>,
        document.body
      )}
    </div>
  );
}
