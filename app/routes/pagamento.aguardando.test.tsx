import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
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

// PixQrPanel usa navigator.clipboard — mockar
Object.defineProperty(navigator, "clipboard", {
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
  writable: true,
});

const BASE_PAYMENT = {
  contractRequestId: "contract-1",
  createdAt: new Date().toISOString(),
  pixCopyPaste: null,
  pixQrCodeBase64: null,
  pixExpiresAt: null,
  paymentType: null,
};

describe("PaymentPendingRoute — redirecionamentos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchParams.mockReturnValue([new URLSearchParams("paymentId=pay-123")]);
  });

  it.each(["pending", "processing"])(
    "mantém tela de espera sem navegar para status %s",
    async (status) => {
      mockUsePaymentQuery.mockReturnValue({
        data: { ...BASE_PAYMENT, status },
      });

      render(<PaymentPendingRoute />);

      expect(screen.getByText("Aguardando confirmação")).toBeInTheDocument();

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    },
  );

  it.each(["paid", "authorized"])(
    "redireciona para sucesso com status %s",
    async (status) => {
      mockUsePaymentQuery.mockReturnValue({
        data: { ...BASE_PAYMENT, status },
      });

      render(<PaymentPendingRoute />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/pagamento/sucesso?paymentId=pay-123",
        );
      });
    },
  );

  it.each(["failed", "canceled"])(
    "redireciona para falhou com status %s",
    async (status) => {
      mockUsePaymentQuery.mockReturnValue({
        data: { ...BASE_PAYMENT, status },
      });

      render(<PaymentPendingRoute />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/pagamento/falhou?paymentId=pay-123",
        );
      });
    },
  );
});

// ─── KAN-72: PIX na tela aguardando ──────────────────────────────────────────

describe("PaymentPendingRoute — PIX (KAN-72)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchParams.mockReturnValue([new URLSearchParams("paymentId=pay-pix-1")]);
  });

  it("exibe PixQrPanel quando payment tem pixCopyPaste", () => {
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000).toISOString();
    mockUsePaymentQuery.mockReturnValue({
      data: {
        ...BASE_PAYMENT,
        status: "processing",
        paymentType: "pix",
        pixCopyPaste: "00020101...",
        pixQrCodeBase64: null,
        pixExpiresAt: expiresAt,
      },
    });

    render(<PaymentPendingRoute />);

    expect(screen.getAllByText(/Pague o PIX/).length).toBeGreaterThan(0);
    expect(screen.getByText("Copiar código PIX")).toBeInTheDocument();
    expect(screen.getByText("00020101...")).toBeInTheDocument();
  });

  it("botão copiar copia o código PIX", async () => {
    mockUsePaymentQuery.mockReturnValue({
      data: {
        ...BASE_PAYMENT,
        status: "processing",
        paymentType: "pix",
        pixCopyPaste: "00020101abc",
        pixQrCodeBase64: null,
        pixExpiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      },
    });

    render(<PaymentPendingRoute />);

    fireEvent.click(screen.getByText("Copiar código PIX"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("00020101abc");
    await waitFor(() => {
      expect(screen.getByText("Copiado!")).toBeInTheDocument();
    });
  });

  it("exibe PIX expirado quando pixExpiresAt está no passado", () => {
    mockUsePaymentQuery.mockReturnValue({
      data: {
        ...BASE_PAYMENT,
        status: "processing",
        paymentType: "pix",
        pixCopyPaste: "00020101...",
        pixQrCodeBase64: null,
        pixExpiresAt: new Date(Date.now() - 1000).toISOString(), // passado
      },
    });

    render(<PaymentPendingRoute />);

    expect(screen.getByText("PIX expirado")).toBeInTheDocument();
    expect(screen.getByText("Gerar novo PIX")).toBeInTheDocument();
  });

  it("não exibe PixQrPanel para pagamento de cartão sem pixCopyPaste", () => {
    mockUsePaymentQuery.mockReturnValue({
      data: {
        ...BASE_PAYMENT,
        status: "processing",
        paymentType: "card",
        pixCopyPaste: null,
      },
    });

    render(<PaymentPendingRoute />);

    expect(screen.queryByText("Copiar código PIX")).not.toBeInTheDocument();
    expect(screen.getByText(/Seu pagamento está sendo processado/)).toBeInTheDocument();
  });
});

// ─── KAN-74: timeout de segurança ────────────────────────────────────────────

describe("PaymentPendingRoute — timeout KAN-74", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchParams.mockReturnValue([new URLSearchParams("paymentId=pay-timeout-1")]);
  });

  it("exibe CTA de retry imediatamente quando createdAt já ultrapassou 30 min", async () => {
    // createdAt 31 min atrás → msUntilTimeout < 0 → timedOut=true imediato
    const oldCreatedAt = new Date(Date.now() - 31 * 60 * 1000).toISOString();
    mockUsePaymentQuery.mockReturnValue({
      data: {
        ...BASE_PAYMENT,
        status: "processing",
        paymentType: "card",
        createdAt: oldCreatedAt,
        contractRequestId: "contract-timeout-1",
      },
    });

    render(<PaymentPendingRoute />);

    await waitFor(() => {
      expect(screen.getByText("Tentar novamente")).toBeInTheDocument();
    });
  });
});
