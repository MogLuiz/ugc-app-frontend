export type ContractRequestStatus =
  | "PENDING_ACCEPTANCE"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export type PaymentStatus = "PENDING" | "PAID";

export type ContractRequestItem = {
  id: string;
  companyId: string;
  creatorId: string;
  jobTypeId: string;
  mode: "PRESENTIAL" | "REMOTE" | "HYBRID";
  description: string;
  status: ContractRequestStatus;
  paymentStatus: PaymentStatus;
  currency: string;
  termsAcceptedAt: string;
  startsAt: string;
  durationMinutes: number;
  jobAddress: string;
  jobFormattedAddress: string | null;
  jobLatitude: number;
  jobLongitude: number;
  creatorDistance: {
    km: number | null;
    formatted: string | null;
    isWithinServiceRadius: boolean | null;
    effectiveServiceRadiusKm: number | null;
  };
  transport: {
    price: number;
    formatted: string;
    isMinimumApplied: boolean;
  };
  transportFee: number;
  creatorBasePrice: number;
  platformFee: number;
  totalPrice: number;
  totalAmount: number;
  transportPricePerKmUsed: number;
  transportMinimumFeeUsed: number;
  creatorNameSnapshot: string;
  creatorAvatarUrlSnapshot: string | null;
  rejectionReason: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ContractRequestPayload = {
  creatorId: string;
  jobTypeId: string;
  description: string;
  startsAt: string;
  durationMinutes: number;
  jobAddress: string;
  termsAccepted: boolean;
};
