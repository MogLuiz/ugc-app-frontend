export type OpportunityStatus = "OPEN" | "FILLED" | "CANCELLED" | "EXPIRED";

/** Payload do item na listagem — espelha GET /open-offers/available */
export type OpportunityListItem = {
  id: string;
  status: OpportunityStatus;
  description: string;
  startsAt: string;
  durationMinutes: number;
  jobFormattedAddress: string | null;
  offeredAmount: number;
  /** Prazo para candidaturas (expiresAt da oferta) */
  expiresAt: string;
  platformFeeRateSnapshot: number;
  jobType: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
  distanceKm: number;
};

/** Payload do detalhe — espelha GET /open-offers/available/:id */
export type OpportunityDetail = OpportunityListItem & {
  /**
   * Candidatura do creator autenticado nesta oferta.
   * null = ainda não se candidatou.
   */
  myApplication: { id: string; status: string } | null;
};

export type OpportunityListResponse = {
  items: OpportunityListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/** Filtros locais (MVP: aplicados no frontend, não enviados à API) */
export type OpportunityFilters = {
  workType: "all" | string;
  distance: "all" | "5" | "10" | "20" | "50";
};

export type SortOption = "recent" | "value" | "distance";
