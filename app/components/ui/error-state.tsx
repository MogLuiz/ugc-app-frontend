type ErrorStateProps = {
  title?: string;
  description: string;
};

export function ErrorState({ title = "Algo deu errado", description }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
      <h3 className="text-sm font-semibold text-rose-800">{title}</h3>
      <p className="mt-1 text-sm text-rose-700">{description}</p>
    </div>
  );
}
