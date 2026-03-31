/** Skeleton que antecipa a estrutura da agenda antes dos dados chegarem. */
export function CalendarSkeleton() {
  return (
    <div className="animate-pulse">
      {/* ── Desktop ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:flex-col lg:gap-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Coluna principal */}
          <div className="min-w-0 flex-1">
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
              {/* Header */}
              <div className="flex flex-col gap-4 border-b border-slate-200/70 px-6 py-5">
                <div className="h-7 w-48 rounded-lg bg-slate-200" />
                <div className="flex items-center gap-2">
                  <div className="size-9 rounded-full bg-slate-100" />
                  <div className="h-4 w-36 flex-1 rounded bg-slate-100" />
                  <div className="size-9 rounded-full bg-slate-100" />
                  <div className="h-8 w-16 rounded-full bg-slate-100" />
                </div>
                {/* Day pills */}
                <div className="flex gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="h-9 flex-1 rounded-full bg-slate-100" />
                  ))}
                </div>
              </div>
              {/* Grid body */}
              <div className="space-y-2 px-6 pb-6 pt-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-3 w-10 shrink-0 rounded bg-slate-100" />
                    <div className="h-[40px] flex-1 rounded-xl bg-slate-50" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Painel lateral */}
          <div className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
            <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="h-2.5 w-16 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-44 rounded bg-slate-100" />
            </div>
            <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="h-2.5 w-20 rounded bg-slate-200" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-3 w-24 rounded bg-slate-100" />
                <div className="h-3 w-20 rounded bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile ──────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-28 pt-6">
          <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
            {/* Título + subtítulo */}
            <div className="h-7 w-24 rounded-lg bg-slate-200" />
            <div className="mt-1.5 h-3 w-40 rounded bg-slate-100" />

            {/* Week strip */}
            <div className="mt-5 flex items-center gap-2">
              <div className="size-8 shrink-0 rounded-full bg-slate-100" />
              <div className="flex flex-1 gap-1.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-11 flex-1 rounded-2xl bg-slate-100" />
                ))}
              </div>
              <div className="size-8 shrink-0 rounded-full bg-slate-100" />
            </div>

            {/* Event stubs */}
            <div className="mt-10 flex flex-col gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-3 w-20 rounded bg-slate-200" />
                  <div className="h-20 rounded-2xl bg-white shadow-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
