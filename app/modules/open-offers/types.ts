export type OpenOfferStatus = "OPEN" | "FILLED" | "CANCELLED" | "EXPIRED";

export type OpenOfferApplicationStatus =
  | "PENDING"
  | "SELECTED"
  | "REJECTED"
  | "WITHDRAWN";

export type OpenOfferJobType = {
  id: string;
  name: string;
  durationMinutes: number;
  minimumOfferedAmount?: number;
  mode?: "PRESENTIAL" | "REMOTE" | "HYBRID";
};

export type OpenOfferItem = {
  id: string;
  companyUserId?: string;
  jobType: OpenOfferJobType | null;
  description: string;
  startsAt: string;
  durationMinutes: number;
  jobAddress?: string | null;
  jobFormattedAddress: string | null;
  jobLatitude?: number | null;
  jobLongitude?: number | null;
  offeredAmount: number;
  expiresAt: string;
  status: OpenOfferStatus;
  platformFeeRateSnapshot: number;
  minimumOfferedAmountSnapshot?: number;
  createdAt: string;
  updatedAt?: string;
};

export type OpenOfferApplication = {
  id: string;
  openOfferId?: string;
  creatorUserId?: string;
  status: OpenOfferApplicationStatus;
  appliedAt: string;
  respondedAt: string | null;
};

export type OpenOfferDetailApplication = OpenOfferApplication & {
  creator: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
    rating: number | null;
  };
};

export type OpenOfferDetail = OpenOfferItem & {
  applications: OpenOfferDetailApplication[];
};

export type OpenOfferListResponse = {
  items: OpenOfferItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateOpenOfferPayload = {
  jobTypeId: string;
  description: string;
  startsAt: string;
  durationMinutes: number;
  jobAddress: string;
  offeredAmount: number;
  expiresAt: string;
};

export type SelectOpenOfferCreatorPayload = {
  offerId: string;
  applicationId: string;
};

export type SelectOpenOfferCreatorResult = {
  contractRequestId: string;
  offerId: string;
  creatorId: string;
};

export type OpenOfferListItemViewModel = {
  id: string;
  kind: "open_offer" | "direct_invite";
  visualLabel: "Oferta aberta" | "Convite direto";
  title: string;
  subtitle: string;
  description: string;
  address: string;
  amount: number;
  createdAt: string | null;
  updatedAt: string | null;
  startsAt: string | null;
  durationMinutes: number | null;
  expiresAt: string | null;
  expiresInMs: number | null;
  statusLabel?: string;
  href?: string;
  contractRequestId?: string;
  offerId?: string;
};

export type OpenOfferFinalizedSectionViewModel = {
  contracts: OpenOfferListItemViewModel[];
  offersWithoutHire: OpenOfferListItemViewModel[];
};

export type OpenOfferJobTypeOption = {
  id: string;
  name: string;
  durationMinutes: number;
  minimumOfferedAmount: number;
  mode: "PRESENTIAL" | "REMOTE" | "HYBRID";
};
