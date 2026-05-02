import { describe, expect, it } from "vitest";
import {
  isAwaitingCreatorConfirmationItem,
  isUpcomingBusinessCampaignItem,
  formatContestDeadlineLabel,
} from "./utils";
import type { CompanyHubItem } from "~/modules/open-offers/types";

// Fixed reference point: 2030-06-15 12:00 UTC
const NOW = new Date("2030-06-15T12:00:00.000Z");

const FUTURE_DEADLINE = new Date(NOW.getTime() + 24 * 60 * 60_000).toISOString(); // +24h
const PAST_DEADLINE = new Date(NOW.getTime() - 60 * 60_000).toISOString();        // -1h
const FUTURE_START = "2030-06-20T10:00:00.000Z";

function makeItem(overrides: Partial<CompanyHubItem> = {}): CompanyHubItem {
  return {
    id: "item-1",
    kind: "contract",
    title: "Campanha de produto",
    description: null,
    address: "São Paulo, SP",
    amount: 50000,
    startsAt: FUTURE_START,
    durationMinutes: 120,
    legacyStatus: "ACCEPTED",
    displayStatus: "ACCEPTED",
    expiresAt: null,
    effectiveExpiresAt: null,
    completedAt: null,
    companyPerspectiveStatus: "UPCOMING_WORK",
    companyActionRequired: false,
    primaryAction: "view_details",
    availableActions: ["view_details"],
    completionConfirmation: null,
    applicationsToReviewCount: 0,
    myReviewPending: null,
    creatorId: "creator-1",
    creatorName: "Creator Teste",
    creatorAvatarUrl: null,
    offerId: null,
    contractRequestId: "cr-1",
    createdAt: "2030-01-01T00:00:00.000Z",
    updatedAt: null,
    paymentId: null,
    paymentStatus: null,
    pixExpiresAt: null,
    ...overrides,
  };
}

describe("isUpcomingBusinessCampaignItem", () => {
  it("inclui UPCOMING_WORK", () => {
    expect(isUpcomingBusinessCampaignItem(makeItem())).toBe(true);
  });

  it("exclui COMPANY_CONFIRMATION_REQUIRED", () => {
    expect(
      isUpcomingBusinessCampaignItem(
        makeItem({ companyPerspectiveStatus: "COMPANY_CONFIRMATION_REQUIRED", companyActionRequired: true }),
      ),
    ).toBe(false);
  });

  it("exclui AWAITING_CREATOR_CONFIRMATION", () => {
    expect(
      isUpcomingBusinessCampaignItem(
        makeItem({ companyPerspectiveStatus: "AWAITING_CREATOR_CONFIRMATION" }),
      ),
    ).toBe(false);
  });

  it("exclui AWAITING_AUTO_COMPLETION", () => {
    expect(
      isUpcomingBusinessCampaignItem(
        makeItem({ companyPerspectiveStatus: "AWAITING_AUTO_COMPLETION" }),
      ),
    ).toBe(false);
  });

  it("exclui COMPLETION_DISPUTE", () => {
    expect(
      isUpcomingBusinessCampaignItem(
        makeItem({ companyPerspectiveStatus: "COMPLETION_DISPUTE" }),
      ),
    ).toBe(false);
  });

  it("exclui COMPLETED", () => {
    expect(
      isUpcomingBusinessCampaignItem(
        makeItem({ companyPerspectiveStatus: "COMPLETED" }),
      ),
    ).toBe(false);
  });

  it("exclui CANCELLED", () => {
    expect(
      isUpcomingBusinessCampaignItem(
        makeItem({ companyPerspectiveStatus: "CANCELLED" }),
      ),
    ).toBe(false);
  });

  it("exclui EXPIRED", () => {
    expect(
      isUpcomingBusinessCampaignItem(
        makeItem({ companyPerspectiveStatus: "EXPIRED" }),
      ),
    ).toBe(false);
  });
});

// ─── isAwaitingCreatorConfirmationItem ────────────────────────────────────────

describe("isAwaitingCreatorConfirmationItem", () => {
  it("inclui AWAITING_CREATOR_CONFIRMATION", () => {
    expect(
      isAwaitingCreatorConfirmationItem(
        makeItem({
          companyPerspectiveStatus: "AWAITING_CREATOR_CONFIRMATION",
          completionConfirmation: {
            companyConfirmedAt: "2030-06-15T10:00:00.000Z",
            creatorConfirmedAt: null,
            contestDeadlineAt: FUTURE_DEADLINE,
          },
        }),
      ),
    ).toBe(true);
  });

  it("exclui COMPANY_CONFIRMATION_REQUIRED", () => {
    expect(
      isAwaitingCreatorConfirmationItem(
        makeItem({
          companyPerspectiveStatus: "COMPANY_CONFIRMATION_REQUIRED",
          companyActionRequired: true,
          completionConfirmation: {
            companyConfirmedAt: null,
            creatorConfirmedAt: null,
            contestDeadlineAt: FUTURE_DEADLINE,
          },
        }),
      ),
    ).toBe(false);
  });

  it("exclui AWAITING_AUTO_COMPLETION", () => {
    expect(
      isAwaitingCreatorConfirmationItem(
        makeItem({
          companyPerspectiveStatus: "AWAITING_AUTO_COMPLETION",
          completionConfirmation: {
            companyConfirmedAt: "2030-06-15T10:00:00.000Z",
            creatorConfirmedAt: null,
            contestDeadlineAt: PAST_DEADLINE,
          },
        }),
      ),
    ).toBe(false);
  });

  it("exclui UPCOMING_WORK", () => {
    expect(isAwaitingCreatorConfirmationItem(makeItem())).toBe(false);
  });

  it("exclui COMPLETED", () => {
    expect(
      isAwaitingCreatorConfirmationItem(
        makeItem({ companyPerspectiveStatus: "COMPLETED" }),
      ),
    ).toBe(false);
  });
});

// ─── Invariante de não-duplicação entre as três seções ───────────────────────

describe("não-duplicação entre seções", () => {
  const pendingConfirmFilter = (item: ReturnType<typeof makeItem>) =>
    item.companyPerspectiveStatus === "COMPANY_CONFIRMATION_REQUIRED";

  it("COMPANY_CONFIRMATION_REQUIRED → só Ações pendentes", () => {
    const item = makeItem({
      companyPerspectiveStatus: "COMPANY_CONFIRMATION_REQUIRED",
      companyActionRequired: true,
      completionConfirmation: {
        companyConfirmedAt: null,
        creatorConfirmedAt: null,
        contestDeadlineAt: FUTURE_DEADLINE,
      },
    });
    expect(pendingConfirmFilter(item)).toBe(true);
    expect(isAwaitingCreatorConfirmationItem(item)).toBe(false);
    expect(isUpcomingBusinessCampaignItem(item)).toBe(false);
  });

  it("AWAITING_CREATOR_CONFIRMATION → só Em confirmação final", () => {
    const item = makeItem({
      companyPerspectiveStatus: "AWAITING_CREATOR_CONFIRMATION",
      companyActionRequired: false,
      completionConfirmation: {
        companyConfirmedAt: "2030-06-15T10:00:00.000Z",
        creatorConfirmedAt: null,
        contestDeadlineAt: FUTURE_DEADLINE,
      },
    });
    expect(pendingConfirmFilter(item)).toBe(false);
    expect(isAwaitingCreatorConfirmationItem(item)).toBe(true);
    expect(isUpcomingBusinessCampaignItem(item)).toBe(false);
  });

  it("UPCOMING_WORK → só Próximos trabalhos", () => {
    const item = makeItem({
      companyPerspectiveStatus: "UPCOMING_WORK",
      companyActionRequired: false,
    });
    expect(pendingConfirmFilter(item)).toBe(false);
    expect(isAwaitingCreatorConfirmationItem(item)).toBe(false);
    expect(isUpcomingBusinessCampaignItem(item)).toBe(true);
  });

  it("COMPLETION_DISPUTE → não aparece em nenhuma das três seções ativas", () => {
    const item = makeItem({
      companyPerspectiveStatus: "COMPLETION_DISPUTE",
      companyActionRequired: false,
    });
    expect(pendingConfirmFilter(item)).toBe(false);
    expect(isAwaitingCreatorConfirmationItem(item)).toBe(false);
    expect(isUpcomingBusinessCampaignItem(item)).toBe(false);
  });

  it("COMPLETED → não aparece em nenhuma das três seções ativas", () => {
    const item = makeItem({
      companyPerspectiveStatus: "COMPLETED",
      companyActionRequired: false,
      completedAt: "2030-06-14T10:00:00.000Z",
    });
    expect(pendingConfirmFilter(item)).toBe(false);
    expect(isAwaitingCreatorConfirmationItem(item)).toBe(false);
    expect(isUpcomingBusinessCampaignItem(item)).toBe(false);
  });

  it("AWAITING_AUTO_COMPLETION → não aparece em nenhuma das três seções ativas", () => {
    const item = makeItem({
      companyPerspectiveStatus: "AWAITING_AUTO_COMPLETION",
      companyActionRequired: false,
    });
    expect(pendingConfirmFilter(item)).toBe(false);
    expect(isAwaitingCreatorConfirmationItem(item)).toBe(false);
    expect(isUpcomingBusinessCampaignItem(item)).toBe(false);
  });
});

// ─── formatContestDeadlineLabel ───────────────────────────────────────────────

describe("formatContestDeadlineLabel", () => {
  it("retorna null para isoDate null", () => {
    expect(formatContestDeadlineLabel(null, NOW)).toBeNull();
  });

  it("retorna null quando prazo já passou", () => {
    expect(formatContestDeadlineLabel(PAST_DEADLINE, NOW)).toBeNull();
  });

  it("retorna 'em Xh' para prazo menor que 24h", () => {
    const in3h = new Date(NOW.getTime() + 3 * 60 * 60_000).toISOString();
    expect(formatContestDeadlineLabel(in3h, NOW)).toBe("Conclusão automática em 3h");
  });

  it("retorna 'até DD/MM às HH:mm' para prazo igual ou maior que 24h", () => {
    const label = formatContestDeadlineLabel(FUTURE_DEADLINE, NOW);
    expect(label).toMatch(/^Conclusão automática até \d{2}\/\d{2} às \d{2}:\d{2}$/);
  });
});
