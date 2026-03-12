export function LoadingState({ message = "Carregando..." }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}
