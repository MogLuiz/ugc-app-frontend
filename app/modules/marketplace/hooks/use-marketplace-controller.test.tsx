import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMarketplaceController } from "./use-marketplace-controller";
import type { MarketplaceCreator } from "../types";

const { mockNavigate, mockCreatorsQuery, mockServiceTypesQuery } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockCreatorsQuery: vi.fn(),
  mockServiceTypesQuery: vi.fn(),
}));

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../queries", () => ({
  useMarketplaceCreatorsQuery: mockCreatorsQuery,
  useMarketplaceServiceTypesQuery: mockServiceTypesQuery,
}));

describe("useMarketplaceController", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCreatorsQuery.mockReturnValue({
      data: {
        items: [],
        pagination: {
          page: 1,
          total: 0,
          totalPages: 1,
        },
      },
      isLoading: false,
      isFetching: false,
      error: null,
    });

    mockServiceTypesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      error: null,
    });
  });

  it("navigates to creator page with hire panel state when hiring", () => {
    const creator = {
      id: "creator-123",
      name: "Creator Test",
    } as MarketplaceCreator;

    const { result } = renderHook(() => useMarketplaceController());

    result.current.actions.onHire(creator);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/criador/creator-123", {
      state: {
        marketplaceCreator: creator,
        openHirePanel: true,
      },
    });
  });
});
