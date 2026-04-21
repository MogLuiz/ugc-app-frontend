import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/toast";
import { useSubmitReviewMutation } from "../queries";

const MAX_COMMENT_LENGTH = 1000;

type Props = {
  contractRequestId: string;
  onSuccess?: () => void;
};

export function ReviewForm({ contractRequestId, onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useSubmitReviewMutation(contractRequestId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Selecione uma avaliação de 1 a 5 estrelas.");
      return;
    }

    const trimmedComment = comment.trim();
    if (trimmedComment.length > MAX_COMMENT_LENGTH) {
      toast.error(`O comentário pode ter no máximo ${MAX_COMMENT_LENGTH} caracteres.`);
      return;
    }

    try {
      await submitMutation.mutateAsync({
        rating,
        comment: trimmedComment || undefined,
      });
      setSubmitted(true);
      toast.success("Avaliação enviada com sucesso!");
      onSuccess?.();
    } catch (err) {
      if (err instanceof Error && err.message.includes("409")) {
        toast.error("Você já avaliou esta contratação.");
        setSubmitted(true);
      } else {
        toast.error(
          err instanceof Error ? err.message : "Não foi possível enviar a avaliação."
        );
      }
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Avaliação enviada. Obrigado pelo feedback!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
      <p className="text-sm font-semibold text-gray-800">Avaliar esta contratação</p>

      {/* Stars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(star)}
          >
            <Star
              className="h-7 w-7 transition-colors"
              fill={(hovered || rating) >= star ? "#f59e0b" : "none"}
              stroke={(hovered || rating) >= star ? "#f59e0b" : "#d1d5db"}
            />
          </button>
        ))}
      </div>

      {/* Comment */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600">
          Comentário (opcional)
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          rows={3}
          maxLength={MAX_COMMENT_LENGTH}
          placeholder="Compartilhe sua experiência..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <p className="text-right text-xs text-gray-400">
          {comment.length}/{MAX_COMMENT_LENGTH}
        </p>
      </div>

      <Button type="submit" size="sm" disabled={submitMutation.isPending}>
        {submitMutation.isPending ? "Enviando..." : "Enviar avaliação"}
      </Button>
    </form>
  );
}
