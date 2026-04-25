import { LEGAL_DOCUMENTS } from "./legal-documents";
import type { LegalDocument } from "./legal.types";

export function getLegalDocumentBySlug(slug: string | undefined): LegalDocument | null {
  if (!slug) return null;
  if (slug === "empresa" || slug === "creator" || slug === "contratacao") {
    return LEGAL_DOCUMENTS[slug];
  }
  return null;
}

export function getSignupLegalDocument(role: "business" | "creator" | null) {
  if (role === "business") return LEGAL_DOCUMENTS.empresa;
  if (role === "creator") return LEGAL_DOCUMENTS.creator;
  return null;
}
