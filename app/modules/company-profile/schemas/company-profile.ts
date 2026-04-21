import { z } from "zod/v3";

function stripDocument(value: string): string {
  return value.replace(/\D/g, "");
}

const SOCIAL_HANDLE_REGEX = /^[A-Za-z0-9._-]{1,100}$/;

function isValidHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidSocialValue(value: string, platform: "instagram" | "tiktok"): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;

  if (trimmed.startsWith("@")) {
    return SOCIAL_HANDLE_REGEX.test(trimmed.slice(1));
  }

  if (!trimmed.includes("://")) {
    return SOCIAL_HANDLE_REGEX.test(trimmed);
  }

  try {
    const url = new URL(trimmed);
    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();
    const allowedHosts =
      platform === "instagram"
        ? new Set(["instagram.com"])
        : new Set(["tiktok.com", "vm.tiktok.com", "m.tiktok.com"]);

    if (!allowedHosts.has(hostname)) {
      return false;
    }

    const [firstSegment] = url.pathname.split("/").filter(Boolean);
    if (!firstSegment) {
      return false;
    }

    const normalizedSegment =
      platform === "tiktok" && firstSegment.toLowerCase() === "@" ? ""
        : firstSegment.replace(/^@/, "");

    return SOCIAL_HANDLE_REGEX.test(normalizedSegment);
  } catch {
    return false;
  }
}

export const companyProfileSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório").max(255),
    bio: z.string().max(500),
    companyName: z.string().min(1, "Nome da empresa é obrigatório").max(255),
    jobTitle: z.string().max(100),
    businessNiche: z.string().max(255),
    phone: z.string().max(50),
    documentType: z.enum(["CPF", "CNPJ", ""]),
    documentNumber: z.string(),
    addressStreet: z.string().max(255),
    addressNumber: z.string().max(50),
    addressCity: z.string().max(100),
    addressState: z.string().max(50),
    addressZipCode: z.string().max(20),
    websiteUrl: z.string().max(500),
    instagramUsername: z.string().max(100),
    tiktokUsername: z.string().max(100),
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
  )
  .refine(
    (data) => {
      const websiteUrl = data.websiteUrl.trim();
      return !websiteUrl || isValidHttpsUrl(websiteUrl);
    },
    {
      message: "Informe uma URL válida começando com https://",
      path: ["websiteUrl"],
    }
  )
  .refine(
    (data) => isValidSocialValue(data.instagramUsername, "instagram"),
    {
      message: "Informe um @handle ou URL válida do Instagram",
      path: ["instagramUsername"],
    }
  )
  .refine(
    (data) => isValidSocialValue(data.tiktokUsername, "tiktok"),
    {
      message: "Informe um @handle ou URL válida do TikTok",
      path: ["tiktokUsername"],
    }
  );

export type CompanyProfileForm = z.infer<typeof companyProfileSchema>;
