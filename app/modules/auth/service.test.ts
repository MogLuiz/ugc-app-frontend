import { beforeEach, describe, expect, it, vi } from "vitest";
import { forgotPassword, logout } from "./service";

const {
  mockResetPasswordForEmail,
  mockGetResetPasswordRedirectUrl,
  mockSignOut,
} = vi.hoisted(() => ({
  mockResetPasswordForEmail: vi.fn(),
  mockGetResetPasswordRedirectUrl: vi.fn(),
  mockSignOut: vi.fn(),
}));

vi.mock("~/lib/supabase", () => ({
  getSupabaseClient: () => ({
    auth: {
      resetPasswordForEmail: mockResetPasswordForEmail,
      signOut: mockSignOut,
    },
  }),
}));

vi.mock("~/lib/env", async () => {
  const actual = await vi.importActual<typeof import("~/lib/env")>("~/lib/env");
  return {
    ...actual,
    getResetPasswordRedirectUrl: mockGetResetPasswordRedirectUrl,
  };
});

describe("forgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("uses the reset password redirect helper when calling supabase", async () => {
    mockGetResetPasswordRedirectUrl.mockReturnValue(
      "https://app.example.com/auth/redefinir-senha"
    );
    mockResetPasswordForEmail.mockResolvedValue({ error: null });

    await forgotPassword("user@example.com");

    expect(mockGetResetPasswordRedirectUrl).toHaveBeenCalledTimes(1);
    expect(mockResetPasswordForEmail).toHaveBeenCalledTimes(1);
    expect(mockResetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
      redirectTo: "https://app.example.com/auth/redefinir-senha",
    });
  });

  it("propagates provider errors", async () => {
    mockGetResetPasswordRedirectUrl.mockReturnValue(
      "https://app.example.com/auth/redefinir-senha"
    );
    mockResetPasswordForEmail.mockResolvedValue({
      error: {
        message: "provider error",
      },
    });

    await expect(forgotPassword("user@example.com")).rejects.toThrow(
      "provider error"
    );
  });

  it("calls supabase signOut and clears stored role on logout", async () => {
    localStorage.setItem("ugc_role", "creator");
    mockSignOut.mockResolvedValue(undefined);

    await logout();

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("ugc_role")).toBeNull();
  });
});
