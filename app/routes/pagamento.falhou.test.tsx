import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentFailedRoute from "./pagamento.falhou";

const { mockUseSearchParams, mockUsePaymentQuery } = vi.hoisted(() => ({
  mockUseSearchParams: vi.fn(),
  mockUsePaymentQuery: vi.fn(),
}));

vi.mock("react-router", () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useSearchParams: () => mockUseSearchParams(),
}));

vi.mock("~/modules/payments/api/payments.queries", () => ({
  usePaymentQuery: mockUsePaymentQuery,
}));

vi.mock("~/components/auth-guard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("PaymentFailedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders retry CTA with contractRequestId returned by payment query", () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams("paymentId=pay-1")]);
    mockUsePaymentQuery.mockReturnValue({
      data: {
        contractRequestId: "contract-123",
      },
    });

    render(<PaymentFailedRoute />);

    expect(screen.getByRole("link", { name: "Tentar novamente" })).toHaveAttribute(
      "href",
      "/pagamento/contract-123"
    );
    expect(screen.getByRole("link", { name: "Voltar ao dashboard" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });

  it("falls back to legacy contractRequestId from search params", () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams("paymentId=pay-1&contractRequestId=legacy-456"),
    ]);
    mockUsePaymentQuery.mockReturnValue({
      data: null,
    });

    render(<PaymentFailedRoute />);

    expect(screen.getByRole("link", { name: "Tentar novamente" })).toHaveAttribute(
      "href",
      "/pagamento/legacy-456"
    );
  });

  it("does not render retry CTA when no contract request id is available", () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams("paymentId=pay-1")]);
    mockUsePaymentQuery.mockReturnValue({
      data: null,
    });

    render(<PaymentFailedRoute />);

    expect(
      screen.queryByRole("link", { name: "Tentar novamente" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar ao dashboard" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });
});
