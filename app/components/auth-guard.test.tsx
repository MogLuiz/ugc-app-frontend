import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthGuard } from "./auth-guard";

const { mockUseAuth } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
}));

vi.mock("~/hooks/use-auth", () => ({
  useAuth: mockUseAuth,
}));

vi.mock("react-router", () => ({
  Navigate: ({
    to,
    replace,
  }: {
    to: string;
    replace?: boolean;
  }) => <div data-replace={String(Boolean(replace))} data-testid="navigate" data-to={to} />,
}));

vi.mock("~/components/ui/app-loading-splash", () => ({
  AppLoadingSplash: () => <div data-testid="loading-splash" />,
}));

describe("AuthGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading splash while auth is loading", () => {
    mockUseAuth.mockReturnValue({
      loading: true,
      user: null,
    });

    render(
      <AuthGuard>
        <div>conteudo protegido</div>
      </AuthGuard>
    );

    expect(screen.getByTestId("loading-splash")).toBeInTheDocument();
  });

  it("redirects unauthenticated users to /login", () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      user: null,
    });

    render(
      <AuthGuard>
        <div>conteudo protegido</div>
      </AuthGuard>
    );

    expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/login");
    expect(screen.getByTestId("navigate")).toHaveAttribute("data-replace", "true");
  });

  it("redirects unauthorized roles to /dashboard", () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      user: {
        id: "user-1",
        role: "creator",
      },
    });

    render(
      <AuthGuard allowedRoles={["business"]}>
        <div>conteudo protegido</div>
      </AuthGuard>
    );

    expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/dashboard");
    expect(screen.getByTestId("navigate")).toHaveAttribute("data-replace", "true");
  });

  it("renders children for authorized users", () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      user: {
        id: "user-1",
        role: "business",
      },
    });

    render(
      <AuthGuard allowedRoles={["business"]}>
        <div>conteudo protegido</div>
      </AuthGuard>
    );

    expect(screen.getByText("conteudo protegido")).toBeInTheDocument();
  });
});
