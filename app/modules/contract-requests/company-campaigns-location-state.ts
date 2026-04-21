/**
 * Compat layer do fluxo legado de campanha para empresa.
 * O fluxo oficial evolui em `open-offers`, mas este estado ainda é usado
 * para handoffs compatíveis até a remoção completa da dependência.
 */
export type CompanyCampaignsLocationState = {
  openContractRequestId?: string;
};
