import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentPendingRoute from "./pagamento.aguardando";

const { mockNavigate, mockUseSearchParams, mockUsePaymentQuery } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
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
  useNavigate: () => mockNavigate,
  useSearchParams: () => mockUseSearchParams(),
}));

vi.mock("~/modules/payments/api/payments.queries", () => ({
  usePaymentQuery: mockUsePaymentQuery,
}));

vi.mock("~/components/auth-guard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("PaymentPendingRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchParams.mockReturnValue([new URLSearchParams("paymentId=pay-123")]);
  });

  it.each(["pending", "processing"])(
    "keeps waiting screen without navigation for %s status",
    async (status) => {
      mockUsePaymentQuery.mockReturnValue({
        data: {
          status,
        },
      });

      render(<PaymentPendingRoute />);

      expect(
        screen.getByText("Aguardando confirmação")
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    }
  );

  it.each(["paid", "authorized"])(
    "redirects to success route for %s status",
    async (status) => {
      mockUsePaymentQuery.mockReturnValue({
        data: {
          status,
        },
      });

      render(<PaymentPendingRoute />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith(
          "/pagamento/sucesso?paymentId=pay-123"
        );
      });
    }
  );

  it.each(["failed", "canceled"])(
    "redirects to failed route for %s status",
    async (status) => {
      mockUsePaymentQuery.mockReturnValue({
        data: {
          status,
        },
      });

      render(<PaymentPendingRoute />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith(
          "/pagamento/falhou?paymentId=pay-123"
        );
      });
    }
  );
});
