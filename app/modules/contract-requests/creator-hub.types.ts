export type CreatorHubDisplayStatus =
  | "PENDING_INVITE"
  | "APPLICATION_PENDING"
  | "ACCEPTED"
  | "AWAITING_CONFIRMATION"
  | "IN_DISPUTE"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED"
  | "APPLICATION_NOT_SELECTED"
  | "APPLICATION_WITHDRAWN";

export type CreatorHubItemKind =
  | "direct_invite"
  | "open_offer_application"
  | "contract";

export type CreatorPerspectiveStatus =
  | "INVITE_PENDING"
  | "AVAILABLE_OPPORTUNITY"
  | "UPCOMING_WORK"
  | "CREATOR_CONFIRMATION_REQUIRED"
  | "AWAITING_COMPANY_CONFIRMATION"
  | "AWAITING_AUTO_COMPLETION"
  | "COMPLETION_DISPUTE"
  | "REVIEW_COMPANY_REQUIRED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type CreatorHubAction =
  | "accept_invite"
  | "reject_invite"
  | "confirm_completion"
  | "contest_completion"
  | "review_company"
  | "view_details"
  | "open_chat";

export type CreatorCompletionConfirmation = {
  companyConfirmed: boolean;
  creatorConfirmed: boolean;
  contestDeadlineAt: string | null;
  autoCompletionAt: string | null;
};

export type CreatorHubItem = {
  id: string;
  kind: CreatorHubItemKind;
  displayStatus: CreatorHubDisplayStatus;

  company: {
    id: string;
    name: string;
    logoUrl: string | null;
    rating: number | null;
    reviewCount: number;
  };

  jobTypeName: string;
  title: string;

  totalAmount: number | null;
  currency: string;

  startsAt: string | null;
  finalizedAt: string | null;
  effectiveExpiresAt: string | null;
  expiresSoon: boolean;
  openOfferId: string | null;
  address: string;
  locationDisplay: string | null;

  /** Estado semântico calculado pelo backend; use este campo para decisões de UI. */
  creatorPerspectiveStatus: CreatorPerspectiveStatus;
  primaryAction: CreatorHubAction;
  availableActions: CreatorHubAction[];
  actionRequired: boolean;
  /** Campos de confirmação bilateral. Presente em AWAITING/DISPUTE/COMPLETED; null nos demais. */
  completionConfirmation: CreatorCompletionConfirmation | null;

  canAccept: boolean;
  canReject: boolean;
  canCancel: boolean;
  canConfirmCompletion: boolean;
  canDispute: boolean;

  myReviewPending: boolean | null;
};

export type CreatorHubSummary = {
  pendingInvitesCount: number;
  pendingApplicationsCount: number;
  inProgressCount: number;
  completedPendingReviewCount: number;
  actionRequiredCount: number;
};

export type CreatorOffersHubResponse = {
  summary: CreatorHubSummary;
  pending: {
    invites: CreatorHubItem[];
    applications: CreatorHubItem[];
  };
  inProgress: CreatorHubItem[];
  finalized: {
    completed: CreatorHubItem[];
    rejected: CreatorHubItem[];
    cancelled: CreatorHubItem[];
    expired: CreatorHubItem[];
  };
};
