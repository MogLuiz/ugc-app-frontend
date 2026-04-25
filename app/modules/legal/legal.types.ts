export type LegalTermType =
  | "COMPANY_SIGNUP"
  | "CREATOR_SIGNUP"
  | "COMPANY_HIRING";

export type LegalDocumentSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  slug: "empresa" | "creator" | "contratacao";
  termType: LegalTermType;
  title: string;
  description: string;
  version: string;
  updatedAt: string;
  path: `/termos/${"empresa" | "creator" | "contratacao"}`;
  content: LegalDocumentSection[];
};

export type LegalAcceptancePayload = {
  termType: LegalTermType;
  termVersion: string;
  accepted: true;
};

export type LegalAcceptanceStatus = {
  termType: LegalTermType;
  currentVersion: string;
  accepted: boolean;
  acceptedAt: string | null;
};
