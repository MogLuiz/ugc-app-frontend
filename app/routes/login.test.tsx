import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthLoginRoute from "./login";

const { mockNavigate, mockSignIn, mockToastError, mockToastSuccess } =
  vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockSignIn: vi.fn(),
    mockToastError: vi.fn(),
    mockToastSuccess: vi.fn(),
  }));

vi.mock("react-router", () => ({
  Link: ({
    children,
    to,
    className,
  }: {
    children: React.ReactNode;
    to: string;
    className?: string;
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

vi.mock("~/modules/auth/service", () => ({
  signIn: mockSignIn,
}));

vi.mock("~/components/ui/toast", () => ({
  toast: {
    error: mockToastError,
    success: mockToastSuccess,
  },
}));

vi.mock("~/modules/auth/components/auth-visual-panel", () => ({
  AuthVisualPanel: () => <div data-testid="auth-visual-panel" />,
}));

describe("AuthLoginRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render "Lembrar de mim"', () => {
    render(<AuthLoginRoute />);

    expect(screen.queryByText("Lembrar de mim")).not.toBeInTheDocument();
    expect(screen.getByText("Esqueci a senha")).toBeInTheDocument();
  });

  it("submits login with the current flow", async () => {
    mockSignIn.mockResolvedValue({ error: null });

    render(<AuthLoginRoute />);

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("user@example.com", "123456");
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Login realizado com sucesso");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
