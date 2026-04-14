import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock é hoisted — as factories rodam antes dos imports abaixo
vi.mock("~/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      updateUser: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock("~/lib/http/client", () => ({
  httpClient: vi.fn(),
}));

vi.mock("~/lib/config/env", () => ({
  getApiBaseUrl: () => "http://localhost:3000",
}));

vi.mock("~/modules/auth/types", () => ({
  bootstrapToAuthUser: (p: any) => ({ ...p, _converted: true }),
  toBackendRole: (r: string) => r.toUpperCase(),
  toFrontendRole: (r: string) => r.toLowerCase(),
}));

// HttpError importado do módulo mockado — mesma classe usada por service.ts
vi.mock("~/lib/http/errors", () => ({
  HttpError: class HttpError extends Error {
    constructor(
      public status: number,
      message: string,
    ) {
      super(message);
      this.name = "HttpError";
    }
  },
}));

import { supabase } from "~/lib/supabase";
import { httpClient } from "~/lib/http/client";
import { HttpError } from "~/lib/http/errors";
import {
  bootstrapUser,
  getSession,
  setStoredRole,
  logout,
} from "~/modules/auth/service";

// Token único por teste evita colisão no Map de dedup do módulo
let tokenCounter = 0;
function uniqueToken() {
  return `test-token-${++tokenCounter}`;
}

const makeSession = (token: string, metaOverrides: object = {}) => ({
  access_token: token,
  user: {
    id: "supabase-uid",
    user_metadata: {
      role: "CREATOR",
      name: "João Silva",
      referralCode: null,
      ...metaOverrides,
    },
  },
});

describe("bootstrapUser", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(supabase.auth.updateUser as any).mockResolvedValue({});
  });

  it("dispara dois requests HTTP quando chamado duas vezes concorrentemente (sem deduplicação)", async () => {
    const token = uniqueToken();
    vi.mocked(httpClient).mockResolvedValue({ id: "u1", role: "CREATOR" } as any);

    const [r1, r2] = await Promise.all([
      bootstrapUser("creator", token),
      bootstrapUser("creator", token),
    ]);

    expect(httpClient).toHaveBeenCalledTimes(2);
    expect(r1).toEqual(r2);
  });

  it("dispara dois requests quando chamado sequencialmente (após o primeiro completar)", async () => {
    const token = uniqueToken();
    vi.mocked(httpClient)
      .mockResolvedValueOnce({ id: "u1" } as any)
      .mockResolvedValueOnce({ id: "u2" } as any);

    await bootstrapUser("creator", token);
    await bootstrapUser("creator", token);

    expect(httpClient).toHaveBeenCalledTimes(2);
  });

  it("tokens diferentes disparam requests independentes", async () => {
    vi.mocked(httpClient).mockResolvedValue({ id: "u1" } as any);

    await Promise.all([
      bootstrapUser("creator", uniqueToken()),
      bootstrapUser("creator", uniqueToken()),
    ]);

    expect(httpClient).toHaveBeenCalledTimes(2);
  });

  it("não inclui name no body (name vem dos metadados Supabase em getSession)", async () => {
    const token = uniqueToken();
    vi.mocked(httpClient).mockResolvedValue({ id: "u1" } as any);
    await bootstrapUser("creator", token);
    const body = (vi.mocked(httpClient).mock.calls[0]![1] as any).body;
    expect(body).not.toHaveProperty("name");
  });

  it("inclui referralCode normalizado no body quando fornecido", async () => {
    const token = uniqueToken();
    vi.mocked(httpClient).mockResolvedValue({ id: "u1" } as any);
    await bootstrapUser("creator", token, "  REF123  ");
    const body = (vi.mocked(httpClient).mock.calls[0]![1] as any).body;
    expect(body.referralCode).toBe("REF123");
  });

  it("throws quando não há sessão ativa", async () => {
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
    });
    await expect(bootstrapUser("creator")).rejects.toThrow("Usuário não autenticado");
  });
});

describe("getSession", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(supabase.auth.updateUser as any).mockResolvedValue({});
  });

  it("retorna authenticated: false quando não há sessão Supabase", async () => {
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    const result = await getSession();
    expect(result.authenticated).toBe(false);
    expect(result.user).toBeNull();
  });

  it("retorna usuário sem acionar bootstrap quando /profiles/me retorna 200", async () => {
    const token = uniqueToken();
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: makeSession(token) },
      error: null,
    });
    vi.mocked(httpClient).mockResolvedValueOnce({ id: "u1", role: "CREATOR" } as any);

    const result = await getSession();

    expect(result.authenticated).toBe(true);
    expect(httpClient).toHaveBeenCalledTimes(1);
    expect(vi.mocked(httpClient).mock.calls[0]![0]).not.toContain("bootstrap");
  });

  it("aciona bootstrap como owner único quando /profiles/me retorna 404", async () => {
    const token = uniqueToken();
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: makeSession(token) },
      error: null,
    });
    vi.mocked(httpClient)
      .mockRejectedValueOnce(new HttpError(404, "Not Found"))
      .mockResolvedValueOnce({ id: "u1", role: "CREATOR" } as any);

    const result = await getSession();

    expect(result.authenticated).toBe(true);
    const calls = vi.mocked(httpClient).mock.calls;
    expect(calls.some((c) => (c[0] as string).includes("bootstrap"))).toBe(true);
  });

  it("não inclui name no body do POST /users/bootstrap (contrato atual: role e referralCode)", async () => {
    const token = uniqueToken();
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: makeSession(token, { name: "Maria Souza" }) },
      error: null,
    });
    vi.mocked(httpClient)
      .mockRejectedValueOnce(new HttpError(404, "Not Found"))
      .mockResolvedValueOnce({ id: "u1" } as any);

    await getSession();

    const bootstrapCall = vi.mocked(httpClient).mock.calls.find(
      (c) => (c[0] as string).includes("bootstrap"),
    );
    expect((bootstrapCall?.[1] as any)?.body?.name).toBeUndefined();
  });

  it("passa referralCode dos metadados e limpa após bootstrap", async () => {
    const token = uniqueToken();
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: makeSession(token, { referralCode: "REF789" }) },
      error: null,
    });
    vi.mocked(httpClient)
      .mockRejectedValueOnce(new HttpError(404, "Not Found"))
      .mockResolvedValueOnce({ id: "u1" } as any);

    await getSession();

    const bootstrapCall = vi.mocked(httpClient).mock.calls.find(
      (c) => (c[0] as string).includes("bootstrap"),
    );
    expect((bootstrapCall?.[1] as any)?.body?.referralCode).toBe("ref789");
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ data: { referralCode: null } });
  });

  it("não aciona bootstrap para erros que não sejam 404 — propaga o erro", async () => {
    const token = uniqueToken();
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: makeSession(token) },
      error: null,
    });
    vi.mocked(httpClient).mockRejectedValueOnce(new HttpError(500, "Server Error"));

    await expect(getSession()).rejects.toBeInstanceOf(HttpError);
    const bootstrapCalls = vi.mocked(httpClient).mock.calls.filter(
      (c) => (c[0] as string).includes("bootstrap"),
    );
    expect(bootstrapCalls).toHaveLength(0);
  });

  it("não limpa storedRole quando /profiles/me retorna 200 (bootstrap não ocorreu)", async () => {
    const token = uniqueToken();
    setStoredRole("creator");
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: makeSession(token) },
      error: null,
    });
    vi.mocked(httpClient).mockResolvedValueOnce({ id: "u1", role: "CREATOR" } as any);

    await getSession();

    // storedRole deve permanecer quando /profiles/me retorna 200 (sem bootstrap)
    expect(localStorage.getItem("ugc_role")).toBe("creator");
    localStorage.removeItem("ugc_role");
  });

  it("mantém storedRole após bootstrap bem-sucedido (path 404)", async () => {
    const token = uniqueToken();
    setStoredRole("creator");
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: makeSession(token) },
      error: null,
    });
    vi.mocked(httpClient)
      .mockRejectedValueOnce(new HttpError(404, "Not Found"))
      .mockResolvedValueOnce({ id: "u1", referralStatus: "ok" } as any);

    await getSession();

    expect(localStorage.getItem("ugc_role")).toBe("creator");
    localStorage.removeItem("ugc_role");
  });

  it("limpa referralCode dos metadados após bootstrap mesmo com referralStatus === 'error'", async () => {
    const token = uniqueToken();
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: makeSession(token, { referralCode: "REF999" }) },
      error: null,
    });
    vi.mocked(httpClient)
      .mockRejectedValueOnce(new HttpError(404, "Not Found"))
      .mockResolvedValueOnce({ id: "u1", referralStatus: "error" } as any);

    await getSession();

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ data: { referralCode: null } });
  });

  it("limpa referralCode dos metadados quando referralStatus === 'ok'", async () => {
    const token = uniqueToken();
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: makeSession(token, { referralCode: "REF999" }) },
      error: null,
    });
    vi.mocked(httpClient)
      .mockRejectedValueOnce(new HttpError(404, "Not Found"))
      .mockResolvedValueOnce({ id: "u1", referralStatus: "ok" } as any);

    await getSession();

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ data: { referralCode: null } });
  });

  it("limpa referralCode dos metadados quando referralStatus === undefined (backward compat com backend antigo)", async () => {
    const token = uniqueToken();
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: makeSession(token, { referralCode: "REF_LEGADO" }) },
      error: null,
    });
    // backend antigo: payload sem referralStatus
    vi.mocked(httpClient)
      .mockRejectedValueOnce(new HttpError(404, "Not Found"))
      .mockResolvedValueOnce({ id: "u1" } as any);

    await getSession();

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ data: { referralCode: null } });
  });

  it("usa role do localStorage como fallback quando metadata não tem role", async () => {
    const token = uniqueToken();
    setStoredRole("business");
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: {
        session: makeSession(token, { role: undefined }),
      },
      error: null,
    });
    vi.mocked(httpClient)
      .mockRejectedValueOnce(new HttpError(404, "Not Found"))
      .mockResolvedValueOnce({ id: "u1" } as any);

    await getSession();

    const bootstrapCall = vi.mocked(httpClient).mock.calls.find(
      (c) => (c[0] as string).includes("bootstrap"),
    );
    // toBackendRole("business") → "BUSINESS" pelo mock acima
    expect((bootstrapCall?.[1] as any)?.body?.role).toBe("BUSINESS");
    localStorage.removeItem("ugc_role");
  });

  it("usa 'business' como default quando não há role em metadata nem localStorage", async () => {
    const token = uniqueToken();
    localStorage.removeItem("ugc_role");
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: makeSession(token, { role: undefined }) },
      error: null,
    });
    vi.mocked(httpClient)
      .mockRejectedValueOnce(new HttpError(404, "Not Found"))
      .mockResolvedValueOnce({ id: "u1" } as any);

    await getSession();

    const bootstrapCall = vi.mocked(httpClient).mock.calls.find(
      (c) => (c[0] as string).includes("bootstrap"),
    );
    expect((bootstrapCall?.[1] as any)?.body?.role).toBe("BUSINESS");
  });

  it("não aciona bootstrap na segunda chamada quando usuário já está bootstrapado", async () => {
    const token = uniqueToken();
    vi.mocked(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: makeSession(token) },
      error: null,
    });
    vi.mocked(httpClient)
      .mockResolvedValueOnce({ id: "u1", role: "CREATOR" } as any)
      .mockResolvedValueOnce({ id: "u1", role: "CREATOR" } as any);

    await getSession();
    await getSession();

    const bootstrapCalls = vi.mocked(httpClient).mock.calls.filter(
      (c) => (c[0] as string).includes("bootstrap"),
    );
    expect(bootstrapCalls).toHaveLength(0);
  });
});

describe("logout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(supabase.auth as any).signOut = vi.fn().mockResolvedValue({});
  });

  it("chama signOut", async () => {
    setStoredRole("business");
    await logout();
    expect((supabase.auth as any).signOut).toHaveBeenCalled();
    localStorage.removeItem("ugc_role");
  });
});
