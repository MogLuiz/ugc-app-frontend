import { useEffect, useState } from "react";

type Props = {
  contractRequestId: string;
  pixCopyPaste: string;
  pixQrCodeBase64: string | null;
  pixExpiresAt: string | null;
  /** Chamado quando o usuário clica em "Gerar novo PIX" após expiração. */
  onRequestNewPix?: () => void;
};

function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Exibe o QR code PIX, código copia-e-cola, countdown de expiração e
 * CTA para gerar novo PIX quando expirado.
 *
 * Recebe pixCopyPaste e pixQrCodeBase64 — ambos salvos no Payment no backend
 * e disponíveis inclusive após reload da página via GET /payments/:id.
 */
export function PixQrPanel({
  contractRequestId,
  pixCopyPaste,
  pixQrCodeBase64,
  pixExpiresAt,
  onRequestNewPix,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!pixExpiresAt) return;

    function tick() {
      const diff = new Date(pixExpiresAt!).getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setSecondsLeft(0);
      } else {
        setSecondsLeft(Math.ceil(diff / 1000));
      }
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [pixExpiresAt]);

  function handleCopy() {
    void navigator.clipboard.writeText(pixCopyPaste).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-neutral-800">
          Pague o PIX e aguarde a confirmação
        </p>
        <p className="text-xs text-neutral-500">
          Após o pagamento, a confirmação é automática — você não precisa fechar esta tela.
        </p>
      </div>

      {pixQrCodeBase64 && (
        <div className="flex justify-center">
          <img
            src={`data:image/png;base64,${pixQrCodeBase64}`}
            alt="QR Code PIX"
            width={192}
            height={192}
            className="rounded-lg border border-neutral-200"
          />
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-medium text-neutral-500 text-center uppercase tracking-wide">
          Código copia e cola
        </p>
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <p className="text-xs font-mono text-neutral-700 break-all line-clamp-3 select-all">
            {pixCopyPaste}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="w-full rounded-lg border border-[#895af6] py-2.5 text-sm font-medium text-[#895af6] hover:bg-[#895af6]/5 transition-colors"
        >
          {copied ? "Copiado!" : "Copiar código PIX"}
        </button>
      </div>

      {pixExpiresAt && (
        <div className="text-center">
          {expired ? (
            <p className="text-sm font-medium text-red-600">PIX expirado</p>
          ) : (
            <p className="text-xs text-neutral-500">
              Expira em{" "}
              <span className="font-mono font-medium text-neutral-700">
                {secondsLeft !== null ? formatCountdown(secondsLeft) : "—"}
              </span>
            </p>
          )}
        </div>
      )}

      {expired ? (
        <button
          type="button"
          onClick={() =>
            onRequestNewPix
              ? onRequestNewPix()
              : (window.location.href = `/pagamento/${contractRequestId}`)
          }
          className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
        >
          Gerar novo PIX
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 py-1">
          <svg
            className="h-4 w-4 animate-spin text-[#895af6]"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-xs text-neutral-500">Aguardando confirmação do pagamento...</p>
        </div>
      )}
    </div>
  );
}
