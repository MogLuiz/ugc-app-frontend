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
  applicationsToReviewCount?: number;
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
  applicationsToReviewCount?: number;
};

// ─── Company Hub view model ───────────────────────────────────────────────────

export type HubDisplayStatus =
  | "OPEN"
  | "PENDING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type HubItemKind = "open_offer" | "direct_invite" | "contract";

export type HubPrimaryAction = "review_applications" | "view_details";

/**
 * View model do hub da empresa — não é DTO de domínio genérico.
 * Campos como title/address já chegam com fallbacks de UI aplicados pelo backend.
 * creatorId/Name/AvatarUrl são null para kind='open_offer' (sem creator único).
 */
export type CompanyHubItem = {
  id: string;
  kind: HubItemKind;
  title: string;
  description: string | null;
  address: string;
  amount: number | null;
  startsAt: string | null;
  durationMinutes: number | null;
  legacyStatus: string;
  displayStatus: HubDisplayStatus;
  expiresAt: string | null;
  effectiveExpiresAt: string | null;
  /** Prazo de 72h para confirmar ou contestar. Presente apenas em AWAITING_COMPLETION_CONFIRMATION. */
  contestDeadlineAt: string | null;
  /** True quando a empresa ainda não confirmou e o prazo está ativo. */
  actionRequiredByCompany: boolean;
  primaryAction: HubPrimaryAction;
  applicationsToReviewCount: number;
  creatorId: string | null;
  creatorName: string | null;
  creatorAvatarUrl: string | null;
  offerId: string | null;
  contractRequestId: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type CompanyOffersHubResponse = {
  pending: {
    openOffers: CompanyHubItem[];
    directInvites: CompanyHubItem[];
  };
  inProgress: CompanyHubItem[];
  finalized: {
    completed: CompanyHubItem[];
    cancelled: CompanyHubItem[];
    expiredWithoutHire: CompanyHubItem[];
  };
};

export type OpenOfferJobTypeOption = {
  id: string;
  name: string;
  durationMinutes: number;
  minimumOfferedAmount: number;
  mode: "PRESENTIAL" | "REMOTE" | "HYBRID";
};
