import type { CompanyProfilePayload } from "~/modules/auth/types";

export type CompanyProfileFormData = {
  name: string;
  bio: string;
  companyName: string;
  jobTitle: string;
  businessNiche: string;
  documentType: "CPF" | "CNPJ" | "";
  documentNumber: string;
};

export type CompanyProfileDisplayData = {
  profile: {
    name?: string | null;
    photoUrl?: string | null;
    bio?: string | null;
  };
  companyProfile: CompanyProfilePayload | null | undefined;
};
