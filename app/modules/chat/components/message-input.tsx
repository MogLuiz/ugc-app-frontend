import { useState } from "react";
import { Send } from "lucide-react";

type MessageInputProps = {
  onSend: (content: string) => Promise<void> | void;
  onRetryLastFailed?: () => Promise<void> | void;
  disabled?: boolean;
  isSending?: boolean;
  errorMessage?: string | null;
};

export function MessageInput({
  onSend,
  onRetryLastFailed,
  disabled,
  isSending,
  errorMessage,
}: MessageInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = content.trim();

    if (!trimmed || disabled) {
      return;
    }

    await onSend(trimmed);
    setContent("");
  };

  return (
    <div className="border-t border-slate-200 p-3">
      {errorMessage ? (
        <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          <p className="truncate">{errorMessage}</p>
          {onRetryLastFailed ? (
            <button
              type="button"
              onClick={() => void onRetryLastFailed()}
              className="shrink-0 rounded-full border border-rose-300 px-2.5 py-1 font-semibold text-rose-700 hover:bg-rose-100"
            >
              Reenviar
            </button>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={2000}
          placeholder="Escreva sua mensagem..."
          className="max-h-36 min-h-[46px] flex-1 resize-y rounded-2xl border border-slate-300 bg-[#f7f7fb] px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#895af6] focus:bg-white"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !content.trim()}
          className="inline-flex size-11 items-center justify-center rounded-full bg-[#895af6] text-white shadow-[0_10px_20px_-10px_rgba(137,90,246,0.8)] transition hover:bg-[#7b4bf0] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          aria-label={isSending ? "Enviando mensagem" : "Enviar mensagem"}
        >
          {isSending ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
          ) : (
            <Send className="size-4" />
          )}
        </button>
      </form>
    </div>
  );
}
