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
  locationAddress: string;
  locationLat: number;
  locationLng: number;
  distanceKm: number;
  transportFee: number;
  creatorBasePrice: number;
  platformFee: number;
  totalPrice: number;
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
  locationAddress: string;
  termsAccepted: boolean;
};
