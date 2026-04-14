import { HttpError } from "~/lib/http/errors";

/** Trecho estável da mensagem do backend (`ensureCreatorHasCoordinates`). */
const ADDRESS_REQUIRED_MESSAGE_SNIPPET = "Complete seu endereço";

export function isOpportunitiesAddressRequiredError(
  error: unknown
): error is HttpError {
  return (
    error instanceof HttpError &&
    error.status === 403 &&
    error.message.includes(ADDRESS_REQUIRED_MESSAGE_SNIPPET)
  );
}
