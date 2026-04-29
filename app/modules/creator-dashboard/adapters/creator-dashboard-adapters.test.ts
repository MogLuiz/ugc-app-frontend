import { describe, expect, it } from "vitest";
import {
  adaptHubUpcoming,
  adaptPendingActions,
  isAwaitingConfirmation,
} from "./creator-dashboard-adapters";
import type { CreatorHubItem } from "~/modules/contract-requests/creator-hub.types";

function makeItem(overrides: Partial<CreatorHubItem> = {}): CreatorHubItem {
  return {
    id: "item-1",
    kind: "direct_invite",
    displayStatus: "ACCEPTED",
    company: { id: "co-1", name: "Empresa S.A.", logoUrl: null, rating: null, reviewCount: 0 },
    jobTypeName: "Foto",
    title: "Campanha de produto",
    totalAmount: 50000,
    currency: "BRL",
    startsAt: "2030-06-15T10:00:00.000Z",
    finalizedAt: null,
    effectiveExpiresAt: null,
    expiresSoon: false,
    openOfferId: null,
    address: "São Paulo, SP",
    locationDisplay: null,
    primaryAction: "VIEW",
    actionRequired: false,
    canAccept: false,
    canReject: false,
    canCancel: false,
    canConfirmCompletion: false,
    canDispute: false,
    myReviewPending: null,
    ...overrides,
  };
}

const NOW = new Date("2030-01-01T00:00:00.000Z");

// ─── isAwaitingConfirmation ───────────────────────────────────────────────────

describe("isAwaitingConfirmation", () => {
  it("retorna true para displayStatus AWAITING_CONFIRMATION", () => {
    expect(isAwaitingConfirmation(makeItem({ displayStatus: "AWAITING_CONFIRMATION" }))).toBe(true);
  });

  it("retorna true para primaryAction CONFIRM_OR_DISPUTE", () => {
    expect(isAwaitingConfirmation(makeItem({ primaryAction: "CONFIRM_OR_DISPUTE" }))).toBe(true);
  });

  it("retorna true para canConfirmCompletion === true", () => {
    expect(isAwaitingConfirmation(makeItem({ canConfirmCompletion: true }))).toBe(true);
  });

  it("retorna false para item ACCEPTED sem nenhuma flag de confirmação", () => {
    expect(isAwaitingConfirmation(makeItem())).toBe(false);
  });

  it("retorna false para item IN_DISPUTE sem canConfirmCompletion", () => {
    expect(
      isAwaitingConfirmation(makeItem({ displayStatus: "IN_DISPUTE", primaryAction: "VIEW" })),
    ).toBe(false);
  });
});

// ─── adaptHubUpcoming ─────────────────────────────────────────────────────────

describe("adaptHubUpcoming", () => {
  it("exclui item com displayStatus AWAITING_CONFIRMATION", () => {
    const items = [makeItem({ displayStatus: "AWAITING_CONFIRMATION" })];
    expect(adaptHubUpcoming(items, NOW)).toHaveLength(0);
  });

  it("exclui item com primaryAction CONFIRM_OR_DISPUTE", () => {
    const items = [makeItem({ primaryAction: "CONFIRM_OR_DISPUTE" })];
    expect(adaptHubUpcoming(items, NOW)).toHaveLength(0);
  });

  it("exclui item com canConfirmCompletion === true", () => {
    const items = [makeItem({ canConfirmCompletion: true })];
    expect(adaptHubUpcoming(items, NOW)).toHaveLength(0);
  });

  it("exclui item sem startsAt", () => {
    const items = [makeItem({ startsAt: null })];
    expect(adaptHubUpcoming(items, NOW)).toHaveLength(0);
  });

  it("inclui item ACCEPTED com startsAt válido", () => {
    const items = [makeItem()];
    const result = adaptHubUpcoming(items, NOW);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("item-1");
  });

  it("inclui item IN_DISPUTE sem canConfirmCompletion", () => {
    const items = [makeItem({ displayStatus: "IN_DISPUTE", primaryAction: "VIEW" })];
    expect(adaptHubUpcoming(items, NOW)).toHaveLength(1);
  });

  it("ordena por startsAt crescente", () => {
    const items = [
      makeItem({ id: "b", startsAt: "2030-06-20T10:00:00.000Z" }),
      makeItem({ id: "a", startsAt: "2030-06-10T10:00:00.000Z" }),
    ];
    const result = adaptHubUpcoming(items, NOW);
    expect(result[0]?.id).toBe("a");
    expect(result[1]?.id).toBe("b");
  });

  it("retorna no máximo 3 itens", () => {
    const items = [
      makeItem({ id: "1", startsAt: "2030-06-01T10:00:00.000Z" }),
      makeItem({ id: "2", startsAt: "2030-06-02T10:00:00.000Z" }),
      makeItem({ id: "3", startsAt: "2030-06-03T10:00:00.000Z" }),
      makeItem({ id: "4", startsAt: "2030-06-04T10:00:00.000Z" }),
    ];
    expect(adaptHubUpcoming(items, NOW)).toHaveLength(3);
  });

  it("statusBadge é 'Pendente' para IN_DISPUTE", () => {
    const items = [makeItem({ displayStatus: "IN_DISPUTE", primaryAction: "VIEW" })];
    expect(adaptHubUpcoming(items, NOW)[0]?.statusBadge).toBe("Pendente");
  });

  it("statusBadge é 'Confirmada' para ACCEPTED", () => {
    const items = [makeItem({ displayStatus: "ACCEPTED" })];
    expect(adaptHubUpcoming(items, NOW)[0]?.statusBadge).toBe("Confirmada");
  });
});

// ─── adaptPendingActions ──────────────────────────────────────────────────────

describe("adaptPendingActions", () => {
  it("retorna array vazio quando não há ações", () => {
    expect(adaptPendingActions([], [])).toHaveLength(0);
  });

  it("inclui apenas itens de inProgress que satisfazem isAwaitingConfirmation", () => {
    const inProgress = [
      makeItem({ id: "confirm-1", displayStatus: "AWAITING_CONFIRMATION" }),
      makeItem({ id: "normal-1", displayStatus: "ACCEPTED" }),
    ];
    const result = adaptPendingActions(inProgress, []);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("confirm-1");
    expect(result[0]?.kind).toBe("confirm_completion");
  });

  it("inclui apenas itens de completed com myReviewPending === true", () => {
    const completed = [
      makeItem({ id: "review-1", displayStatus: "COMPLETED", myReviewPending: true }),
      makeItem({ id: "reviewed-1", displayStatus: "COMPLETED", myReviewPending: false }),
      makeItem({ id: "reviewed-2", displayStatus: "COMPLETED", myReviewPending: null }),
    ];
    const result = adaptPendingActions([], completed);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("review-1");
    expect(result[0]?.kind).toBe("review_company");
  });

  it("coloca confirm_completion antes de review_company", () => {
    const inProgress = [makeItem({ id: "confirm-1", displayStatus: "AWAITING_CONFIRMATION" })];
    const completed = [makeItem({ id: "review-1", displayStatus: "COMPLETED", myReviewPending: true })];
    const result = adaptPendingActions(inProgress, completed);
    expect(result[0]?.kind).toBe("confirm_completion");
    expect(result[1]?.kind).toBe("review_company");
  });

  it("dateLabel de confirmação usa startsAt", () => {
    const inProgress = [
      makeItem({
        id: "c1",
        displayStatus: "AWAITING_CONFIRMATION",
        startsAt: "2030-04-12T10:00:00.000Z",
      }),
    ];
    const result = adaptPendingActions(inProgress, []);
    expect(result[0]?.dateLabel).toBe("Realizado em 12/04");
  });

  it("dateLabel de avaliação usa finalizedAt quando disponível", () => {
    const completed = [
      makeItem({
        id: "r1",
        displayStatus: "COMPLETED",
        myReviewPending: true,
        finalizedAt: "2030-04-08T10:00:00.000Z",
        startsAt: "2030-03-01T10:00:00.000Z",
      }),
    ];
    const result = adaptPendingActions([], completed);
    expect(result[0]?.dateLabel).toBe("Concluído em 08/04");
  });

  it("dateLabel é null quando não há data disponível", () => {
    const inProgress = [
      makeItem({ id: "c1", displayStatus: "AWAITING_CONFIRMATION", startsAt: null }),
    ];
    const result = adaptPendingActions(inProgress, []);
    expect(result[0]?.dateLabel).toBeNull();
  });
});
