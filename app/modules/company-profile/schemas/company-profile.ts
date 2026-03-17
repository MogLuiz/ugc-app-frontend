import { z } from "zod/v3";

function stripDocument(value: string): string {
  return value.replace(/\D/g, "");
}

export const companyProfileSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório").max(255),
    bio: z.string().max(500),
    companyName: z.string().min(1, "Nome da empresa é obrigatório").max(255),
    jobTitle: z.string().max(100),
    businessNiche: z.string().max(255),
    documentType: z.enum(["CPF", "CNPJ", ""]),
    documentNumber: z.string(),
  })
  .refine(
    (data) => {
      if (!data.documentType || !data.documentNumber?.trim()) return true;
      const stripped = stripDocument(data.documentNumber);
      if (data.documentType === "CPF") return stripped.length === 11;
      if (data.documentType === "CNPJ") return stripped.length === 14;
      return true;
    },
    {
      message: "Documento inválido para o tipo selecionado",
      path: ["documentNumber"],
    }
  );

export type CompanyProfileForm = z.infer<typeof companyProfileSchema>;
