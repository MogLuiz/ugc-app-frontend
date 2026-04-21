function normalizeMessage(message?: string | null): string {
  return message?.trim() ?? "";
}

export const MAX_PORTFOLIO_VIDEO_SIZE_MB = 200;

export function getCompanyProfileErrorMessage(
  error: unknown,
  action:
    | "avatar_upload"
    | "portfolio_upload"
    | "portfolio_remove"
    | "profile_update"
): string {
  const rawMessage =
    error instanceof Error ? normalizeMessage(error.message) : "";
  const lower = rawMessage.toLowerCase();

  if (action === "avatar_upload") {
    if (lower.includes("tipo de arquivo")) {
      return "Formato de imagem não suportado. Envie JPG, PNG ou WEBP.";
    }
    if (lower.includes("arquivo muito grande") || lower.includes("file too large")) {
      return "A foto é muito grande. Escolha uma imagem menor e tente novamente.";
    }
    return rawMessage || "Não foi possível atualizar a foto agora. Tente novamente.";
  }

  if (action === "portfolio_upload") {
    if (
      lower.includes("payload too large") ||
      lower.includes("file too large") ||
      lower.includes("arquivo muito grande")
    ) {
      return `O arquivo é maior do que o permitido. Para vídeos, envie um arquivo de até ${MAX_PORTFOLIO_VIDEO_SIZE_MB}MB.`;
    }
    if (lower.includes("exceeded the maximum allowed size")) {
      return `O vídeo ultrapassa o limite aceito pelo armazenamento. Vídeos devem ter até ${MAX_PORTFOLIO_VIDEO_SIZE_MB}MB.`;
    }
    if (lower.includes("tipo de mídia não permitido") || lower.includes("tipo de arquivo")) {
      return "Formato não suportado. Envie imagens JPG, PNG, WEBP ou vídeos MP4, MOV e WEBM.";
    }
    if (lower.includes("falha no upload")) {
      return `Não foi possível concluir o upload da mídia. ${rawMessage.replace(/^falha no upload:\s*/i, "")}`;
    }
    return rawMessage || "Não foi possível enviar a mídia agora. Tente novamente.";
  }

  if (action === "portfolio_remove") {
    if (lower.includes("não encontrada")) {
      return "Esta mídia não foi encontrada. Atualize a página e tente novamente.";
    }
    if (lower.includes("não pode remover")) {
      return "Você não tem permissão para remover esta mídia.";
    }
    return rawMessage || "Não foi possível remover a mídia agora. Tente novamente.";
  }

  if (action === "profile_update") {
    return rawMessage || "Não foi possível salvar as alterações agora. Tente novamente.";
  }

  return rawMessage || "Ocorreu um erro inesperado. Tente novamente.";
}

export function validatePortfolioFile(file: File): string | null {
  const isVideo = file.type.startsWith("video/");
  const maxBytes = MAX_PORTFOLIO_VIDEO_SIZE_MB * 1024 * 1024;

  if (isVideo && file.size > maxBytes) {
    return `Este vídeo tem ${(file.size / (1024 * 1024)).toFixed(1)}MB. Vídeos devem ter até ${MAX_PORTFOLIO_VIDEO_SIZE_MB}MB.`;
  }

  return null;
}

export function getCompanyProfileSuccessMessage(
  action: "avatar_upload" | "portfolio_upload" | "portfolio_remove" | "profile_update"
): string {
  switch (action) {
    case "avatar_upload":
      return "Foto atualizada com sucesso.";
    case "portfolio_upload":
      return "Mídia adicionada ao portfólio com sucesso.";
    case "portfolio_remove":
      return "Mídia removida do portfólio com sucesso.";
    case "profile_update":
      return "Perfil atualizado com sucesso.";
  }
}
