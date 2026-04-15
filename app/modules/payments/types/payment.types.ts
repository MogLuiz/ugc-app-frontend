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
