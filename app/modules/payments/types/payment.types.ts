export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'canceled'
  | 'refunded'
  | 'partially_refunded';

export type PayoutStatus =
  | 'not_due'
  | 'pending'
  | 'scheduled'
  | 'paid'
  | 'failed'
  | 'canceled';

export type InitiatePaymentResponse = {
  paymentId: string;
  preferenceId: string;
  publicKey: string;
  grossAmountCents: number;
  platformFeeCents: number;
  creatorBaseAmountCents: number;
  transportFeeCents: number;
  creatorNetAmountCents: number;
  currency: string;
  /** Crédito de saldo aplicado (em centavos). */
  creditAppliedCents: number;
  /** Valor efetivamente cobrado no gateway (gross - credit). */
  remainderCents: number;
  /** true quando 100% coberto por crédito — não exibir Brick. */
  alreadyPaid: boolean;
};

export type CompanyBalance = {
  availableCents: number;
  maxCreditCents: number;
  currency: string;
  transactions: BalanceTransaction[];
};

export type BalanceTransaction = {
  id: string;
  companyUserId: string;
  amountCents: number;
  type: 'CREDIT_FROM_REJECTION' | 'CREDIT_FROM_EXPIRATION' | 'CREDIT_USED' | 'REFUND_PROCESSED';
  referenceType: string;
  referenceId: string;
  note: string | null;
  createdAt: string;
};

export type Payment = {
  id: string;
  contractRequestId: string;
  grossAmountCents: number;
  platformFeeCents: number;
  creatorBaseAmountCents: number;
  transportFeeCents: number;
  creatorNetAmountCents: number;
  currency: string;
  status: PaymentStatus;
  payoutStatus: PayoutStatus;
  gatewayName: string;
  paymentMethod: string | null;
  installments: number | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatorPayout = {
  id: string;
  paymentId: string;
  creatorUserId: string;
  amountCents: number;
  currency: string;
  status: PayoutStatus;
  scheduledFor: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  payment?: {
    grossAmountCents: number;
    platformFeeCents: number;
    contractRequestId: string;
    gatewayName: string;
  };
};
