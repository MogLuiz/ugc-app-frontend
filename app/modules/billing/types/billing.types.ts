export type RefundRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export type RefundRequest = {
  id: string;
  companyUserId: string;
  amountCents: number;
  status: RefundRequestStatus;
  reason: string | null;
  adminNote: string | null;
  createdAt: string;
  processedAt: string | null;
};
