import { describe, expect, it } from "vitest";
import {
  adaptHubUpcoming,
  adaptPendingActions,
  isCreatorConfirmationRequired,
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
    creatorPerspectiveStatus: "UPCOMING_WORK",
    primaryAction: "view_details",
    availableActions: ["view_details"],
    actionRequired: false,
    completionConfirmation: null,
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
const FUTURE_DEADLINE = new Date(NOW.getTime() + 24 * 60 * 60_000).toISOString();

// ─── isCreatorConfirmationRequired ───────────────────────────────────────────

describe("isCreatorConfirmationRequired", () => {
  it("retorna true para CREATOR_CONFIRMATION_REQUIRED", () => {
    expect(
      isCreatorConfirmationRequired(
        makeItem({
          creatorPerspectiveStatus: "CREATOR_CONFIRMATION_REQUIRED",
          primaryAction: "confirm_completion",
          availableActions: ["confirm_completion", "contest_completion", "view_details"],
          actionRequired: true,
          canConfirmCompletion: true,
          canDispute: true,
        }),
      ),
    ).toBe(true);
  });

  it("retorna false para AWAITING_COMPANY_CONFIRMATION (creator já confirmou)", () => {
    expect(
      isCreatorConfirmationRequired(
        makeItem({
          creatorPerspectiveStatus: "AWAITING_COMPANY_CONFIRMATION",
          actionRequired: false,
          completionConfirmation: {
            creatorConfirmed: true,
            companyConfirmed: false,
            contestDeadlineAt: FUTURE_DEADLINE,
            autoCompletionAt: FUTURE_DEADLINE,
          },
        }),
      ),
    ).toBe(false);
  });

  it("retorna false para UPCOMING_WORK", () => {
    expect(isCreatorConfirmationRequired(makeItem())).toBe(false);
  });

  it("retorna false para AWAITING_AUTO_COMPLETION", () => {
    expect(
      isCreatorConfirmationRequired(makeItem({ creatorPerspectiveStatus: "AWAITING_AUTO_COMPLETION" })),
    ).toBe(false);
  });

  it("retorna false para REVIEW_COMPANY_REQUIRED", () => {
    expect(
      isCreatorConfirmationRequired(makeItem({ creatorPerspectiveStatus: "REVIEW_COMPANY_REQUIRED" })),
    ).toBe(false);
  });
});

// ─── adaptHubUpcoming ─────────────────────────────────────────────────────────

describe("adaptHubUpcoming", () => {
  it("inclui apenas itens com UPCOMING_WORK e startsAt preenchido", () => {
    const items = [makeItem()];
    expect(adaptHubUpcoming(items, NOW)).toHaveLength(1);
  });

  it("exclui CREATOR_CONFIRMATION_REQUIRED (ação pendente do creator)", () => {
    const items = [
      makeItem({
        creatorPerspectiveStatus: "CREATOR_CONFIRMATION_REQUIRED",
        primaryAction: "confirm_completion",
        availableActions: ["confirm_completion", "contest_completion", "view_details"],
        actionRequired: true,
      }),
    ];
    expect(adaptHubUpcoming(items, NOW)).toHaveLength(0);
  });

  it("exclui AWAITING_COMPANY_CONFIRMATION (não é upcoming)", () => {
    const items = [
      makeItem({
        creatorPerspectiveStatus: "AWAITING_COMPANY_CONFIRMATION",
        actionRequired: false,
      }),
    ];
    expect(adaptHubUpcoming(items, NOW)).toHaveLength(0);
  });

  it("exclui AWAITING_AUTO_COMPLETION", () => {
    const items = [makeItem({ creatorPerspectiveStatus: "AWAITING_AUTO_COMPLETION" })];
    expect(adaptHubUpcoming(items, NOW)).toHaveLength(0);
  });

  it("exclui item sem startsAt", () => {
    const items = [makeItem({ startsAt: null })];
    expect(adaptHubUpcoming(items, NOW)).toHaveLength(0);
  });

  it("exclui COMPLETION_DISPUTE (não é upcoming)", () => {
    const items = [makeItem({ creatorPerspectiveStatus: "COMPLETION_DISPUTE" })];
    expect(adaptHubUpcoming(items, NOW)).toHaveLength(0);
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

  it("statusBadge é 'Confirmada' para UPCOMING_WORK", () => {
    const items = [makeItem()];
    expect(adaptHubUpcoming(items, NOW)[0]?.statusBadge).toBe("Confirmada");
  });
});

// ─── adaptPendingActions ──────────────────────────────────────────────────────

describe("adaptPendingActions", () => {
  it("retorna array vazio quando não há ações", () => {
    expect(adaptPendingActions([], [])).toHaveLength(0);
  });

  it("inclui CREATOR_CONFIRMATION_REQUIRED em ações pendentes", () => {
    const inProgress = [
      makeItem({
        id: "confirm-1",
        creatorPerspectiveStatus: "CREATOR_CONFIRMATION_REQUIRED",
        primaryAction: "confirm_completion",
        availableActions: ["confirm_completion", "contest_completion", "view_details"],
        actionRequired: true,
        canConfirmCompletion: true,
      }),
      makeItem({ id: "upcoming-1" }),
    ];
    const result = adaptPendingActions(inProgress, []);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("confirm-1");
    expect(result[0]?.kind).toBe("confirm_completion");
  });

  it("não inclui AWAITING_COMPANY_CONFIRMATION em ações pendentes", () => {
    const inProgress = [
      makeItem({
        id: "waiting-1",
        creatorPerspectiveStatus: "AWAITING_COMPANY_CONFIRMATION",
        actionRequired: false,
        completionConfirmation: {
          creatorConfirmed: true,
          companyConfirmed: false,
          contestDeadlineAt: FUTURE_DEADLINE,
          autoCompletionAt: FUTURE_DEADLINE,
        },
      }),
    ];
    const result = adaptPendingActions(inProgress, []);
    expect(result).toHaveLength(0);
  });

  it("inclui REVIEW_COMPANY_REQUIRED em ações pendentes", () => {
    const completed = [
      makeItem({
        id: "review-1",
        creatorPerspectiveStatus: "REVIEW_COMPANY_REQUIRED",
        myReviewPending: true,
        primaryAction: "review_company",
        availableActions: ["review_company", "view_details"],
        actionRequired: true,
      }),
      makeItem({
        id: "reviewed-1",
        creatorPerspectiveStatus: "COMPLETED",
        myReviewPending: false,
      }),
    ];
    const result = adaptPendingActions([], completed);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("review-1");
    expect(result[0]?.kind).toBe("review_company");
  });

  it("não inclui COMPLETED (já avaliado) em ações pendentes", () => {
    const completed = [
      makeItem({
        id: "done-1",
        creatorPerspectiveStatus: "COMPLETED",
        myReviewPending: false,
      }),
    ];
    expect(adaptPendingActions([], completed)).toHaveLength(0);
  });

  it("coloca confirm_completion antes de review_company", () => {
    const inProgress = [
      makeItem({
        id: "c1",
        creatorPerspectiveStatus: "CREATOR_CONFIRMATION_REQUIRED",
        primaryAction: "confirm_completion",
        availableActions: ["confirm_completion", "contest_completion", "view_details"],
        actionRequired: true,
      }),
    ];
    const completed = [
      makeItem({
        id: "r1",
        creatorPerspectiveStatus: "REVIEW_COMPANY_REQUIRED",
        myReviewPending: true,
        primaryAction: "review_company",
        availableActions: ["review_company", "view_details"],
        actionRequired: true,
      }),
    ];
    const result = adaptPendingActions(inProgress, completed);
    expect(result[0]?.kind).toBe("confirm_completion");
    expect(result[1]?.kind).toBe("review_company");
  });

  it("dateLabel de confirmação usa startsAt", () => {
    const inProgress = [
      makeItem({
        id: "c1",
        creatorPerspectiveStatus: "CREATOR_CONFIRMATION_REQUIRED",
        primaryAction: "confirm_completion",
        availableActions: ["confirm_completion", "contest_completion", "view_details"],
        actionRequired: true,
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
        creatorPerspectiveStatus: "REVIEW_COMPANY_REQUIRED",
        myReviewPending: true,
        primaryAction: "review_company",
        availableActions: ["review_company", "view_details"],
        actionRequired: true,
        finalizedAt: "2030-04-08T10:00:00.000Z",
        startsAt: "2030-03-01T10:00:00.000Z",
      }),
    ];
    const result = adaptPendingActions([], completed);
    expect(result[0]?.dateLabel).toBe("Concluído em 08/04");
  });

  it("dateLabel é null quando não há data disponível", () => {
    const inProgress = [
      makeItem({
        id: "c1",
        creatorPerspectiveStatus: "CREATOR_CONFIRMATION_REQUIRED",
        primaryAction: "confirm_completion",
        availableActions: ["confirm_completion", "contest_completion", "view_details"],
        actionRequired: true,
        startsAt: null,
      }),
    ];
    const result = adaptPendingActions(inProgress, []);
    expect(result[0]?.dateLabel).toBeNull();
  });
});

// ─── Invariante: não-duplicação entre seções ─────────────────────────────────

describe("não-duplicação entre seções da dashboard", () => {
  it("CREATOR_CONFIRMATION_REQUIRED aparece em Ações pendentes e não em Próximos", () => {
    const item = makeItem({
      creatorPerspectiveStatus: "CREATOR_CONFIRMATION_REQUIRED",
      primaryAction: "confirm_completion",
      availableActions: ["confirm_completion", "contest_completion", "view_details"],
      actionRequired: true,
      canConfirmCompletion: true,
    });
    expect(isCreatorConfirmationRequired(item)).toBe(true);
    expect(adaptHubUpcoming([item], NOW)).toHaveLength(0);
  });

  it("AWAITING_COMPANY_CONFIRMATION não aparece em nenhuma seção de ação", () => {
    const item = makeItem({
      creatorPerspectiveStatus: "AWAITING_COMPANY_CONFIRMATION",
      actionRequired: false,
      completionConfirmation: {
        creatorConfirmed: true,
        companyConfirmed: false,
        contestDeadlineAt: FUTURE_DEADLINE,
        autoCompletionAt: FUTURE_DEADLINE,
      },
    });
    expect(isCreatorConfirmationRequired(item)).toBe(false);
    expect(adaptPendingActions([item], [])).toHaveLength(0);
    expect(adaptHubUpcoming([item], NOW)).toHaveLength(0);
  });

  it("UPCOMING_WORK aparece apenas em Próximos trabalhos", () => {
    const item = makeItem();
    expect(isCreatorConfirmationRequired(item)).toBe(false);
    expect(adaptPendingActions([item], [])).toHaveLength(0);
    expect(adaptHubUpcoming([item], NOW)).toHaveLength(1);
  });
});
