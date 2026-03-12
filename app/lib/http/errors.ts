export class HttpError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.payload = payload;
  }
}

export function normalizeHttpError(status: number, payload: unknown): HttpError {
  if (status === 401) {
    return new HttpError(status, "Sessao expirada. Faça login novamente.", payload);
  }

  if (status === 403) {
    return new HttpError(status, "Acesso negado para este recurso.", payload);
  }

  if (status === 422) {
    return new HttpError(status, "Dados invalidos. Verifique os campos e tente novamente.", payload);
  }

  if (status >= 500) {
    return new HttpError(status, "Erro interno do servidor. Tente novamente em instantes.", payload);
  }

  return new HttpError(status, "Falha na requisicao.", payload);
}
