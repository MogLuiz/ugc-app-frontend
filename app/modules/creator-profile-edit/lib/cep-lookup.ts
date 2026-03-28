export type CepResult =
  | { found: true; street: string; city: string; state: string }
  | { found: false };

/**
 * Lookup a Brazilian CEP via ViaCEP.
 *
 * Accepts a signal so callers can abort in-flight requests when the CEP
 * changes, preventing race conditions where a slow response for an old CEP
 * overwrites the result of a newer one.
 */
export async function lookupCep(
  rawCep: string,
  signal?: AbortSignal,
): Promise<CepResult> {
  const cep = rawCep.replace(/\D/g, "");
  if (cep.length !== 8) return { found: false };

  let res: Response;
  try {
    res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal });
  } catch (err) {
    // AbortError is expected when the caller cancels the request — rethrow so
    // callers can distinguish it from a real network failure.
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    return { found: false };
  }

  if (!res.ok) return { found: false };

  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch {
    return { found: false };
  }

  if (data.erro) return { found: false };

  return {
    found: true,
    street: typeof data.logradouro === "string" ? data.logradouro : "",
    city: typeof data.localidade === "string" ? data.localidade : "",
    state:
      typeof data.uf === "string" ? data.uf.toUpperCase().slice(0, 2) : "",
  };
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
}
