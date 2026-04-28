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

export type PixKeyType = 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';

export type SettlementStatus = 'HELD' | 'APPLIED' | 'CONVERTED_TO_CREDIT';

export type InitiatePaymentResponse = {
  paymentId: string;
  preferenceId: string;
  publicKey: string;
  serviceGrossAmountCents: number;
  platformFeeAmountCents: number;
  creatorNetServiceAmountCents: number;
  transportFeeAmountCents: number;
  creatorPayoutAmountCents: number;
  companyTotalAmountCents: number;
  currency: string;
  /** Crédito de saldo aplicado (em centavos). */
  creditAppliedCents: number;
  /** Valor efetivamente cobrado no gateway (companyTotal - credit). */
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
  serviceGrossAmountCents: number;
  platformFeeAmountCents: number;
  creatorNetServiceAmountCents: number;
  transportFeeAmountCents: number;
  creatorPayoutAmountCents: number;
  companyTotalAmountCents: number;
  creditAppliedCents: number;
  currency: string;
  status: PaymentStatus;
  payoutStatus: PayoutStatus;
  settlementStatus: SettlementStatus | null;
  gatewayName: string;
  paymentMethod: string | null;
  installments: number | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  paymentType: 'card' | 'pix' | 'credit' | null;
  /** Código EMV copia-e-cola do PIX. */
  pixCopyPaste: string | null;
  /** QR code como base64 PNG. */
  pixQrCodeBase64: string | null;
  /** ISO string de expiração do QR PIX. */
  pixExpiresAt: string | null;
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
    creatorNetServiceAmountCents: number;
    transportFeeAmountCents: number;
    contractRequestId: string;
    gatewayName: string;
  };
};

export type CreatorPayoutSettings = {
  isConfigured: boolean;
  pixKeyType: PixKeyType | null;
  pixKey: string | null;
  pixKeyMasked: string | null;
  holderName: string | null;
  holderDocument: string | null;
};

export type UpdateCreatorPayoutSettingsInput = {
  pixKeyType: PixKeyType;
  pixKey: string;
  holderName?: string | null;
  holderDocument?: string | null;
};
