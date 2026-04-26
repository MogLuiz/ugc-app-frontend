import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  MapPin,
  Video,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn, getFirstName } from "~/lib/utils";
import { formatCurrency, formatDateTime } from "~/modules/contract-requests/utils";
import type { CreatorHireFlowController } from "../../hooks/use-creator-hire-flow";
import type { CreatorProfile } from "../../types";

type CreatorHireFormProps = {
  profile: CreatorProfile;
  flow: CreatorHireFlowController;
};

export function CreatorHireForm({ profile, flow }: CreatorHireFormProps) {
  const creatorFirstName = getFirstName(profile.name);

  return (
    <div className="flex h-full min-w-0 flex-col overflow-x-hidden">
      <div className="flex-1 space-y-5 overflow-x-hidden overflow-y-auto px-4 pb-5 pt-5 sm:px-5 lg:px-5">
        <section className="pr-12">
          <h2 className="text-[20px] font-bold tracking-tight text-[#0f172a]">
            Agendar com {creatorFirstName}
          </h2>
        </section>

        <section>
          <SectionHeader
            title="Selecione o serviço"
            meta={`${profile.services.length} disponíveis`}
          />
          {flow.hasServices ? (
            <div className="mt-2.5 min-w-0 space-y-2.5">
              {profile.services.map((service) => {
                const isSelected =
                  flow.formState.selectedServiceId === service.jobTypeId;

                return (
                  <button
                    key={service.jobTypeId}
                    type="button"
                    onClick={() => flow.setSelectedServiceId(service.jobTypeId)}
                    className={cn(
                      "flex w-full min-w-0 items-start gap-3 rounded-[24px] border bg-white p-3.5 text-left transition",
                      isSelected
                        ? "border-[#895af6] shadow-[0px_12px_30px_rgba(137,90,246,0.14)]"
                        : "border-[#e2e8f0] hover:border-[#cbd5e1]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        isSelected
                          ? "bg-[#895af6] text-white shadow-[0px_4px_12px_rgba(137,90,246,0.28)]"
                          : "bg-[#f1f5f9] text-[#64748b]",
                      )}
                    >
                      {isSelected ? (
                        <Video className="h-4.5 w-4.5" />
                      ) : (
                        <Clapperboard className="h-4.5 w-4.5" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold text-[#111827]">
                        {service.name}
                      </span>
                      {service.description ? (
                        <span className="mt-1 block text-[13px] font-normal text-[#64748b]">
                          {service.description}
                        </span>
                      ) : null}
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-2 self-stretch">
                      <span
                        className={cn(
                          "text-[15px] font-bold",
                          isSelected ? "text-[#895af6]" : "text-[#111827]",
                        )}
                      >
                        {formatCurrency(
                          service.basePriceCents / 100,
                          service.currency,
                        )}
                      </span>
                      <span
                        className={cn(
                          "mt-auto flex h-5 w-5 items-center justify-center rounded-full",
                          isSelected
                            ? "bg-[#895af6] text-white"
                            : "border-2 border-[#e2e8f0]",
                        )}
                      >
                        {isSelected ? (
                          <Check className="h-3 w-3" strokeWidth={3} />
                        ) : null}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <EmptyState text="Este creator ainda não possui serviços presenciais contratáveis." />
          )}
        </section>

        <section>
          <SectionHeader title="Escolha a data" />
          <div className="mt-2.5 rounded-[20px] bg-white p-2.5 shadow-[0px_1px_2px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={flow.goToPreviousMonth}
                disabled={!flow.canGoToPreviousMonth}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border transition",
                  flow.canGoToPreviousMonth
                    ? "border-[#e2e8f0] text-[#0f172a] hover:bg-[#f8fafc]"
                    : "cursor-not-allowed border-[#e2e8f0] text-[#cbd5e1]",
                )}
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <span className="text-sm font-bold text-[#895af6]">
                {flow.monthLabel}
              </span>
              <button
                type="button"
                onClick={flow.goToNextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e2e8f0] text-[#0f172a] transition hover:bg-[#f8fafc]"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-2.5 rounded-[20px] bg-[#f8f7fc] p-2.5">
              <div className="grid grid-cols-7 gap-y-2">
                {flow.weekDayLabels.map((label, index) => (
                  <span
                    key={`${label}-${index}`}
                    className="text-center text-[8px] font-semibold uppercase tracking-[0.06em] text-[#94a3b8]"
                  >
                    {label}
                  </span>
                ))}
                {flow.calendarDays.map((day) => (
                  <button
                    key={day.isoDate}
                    type="button"
                    disabled={!day.isCurrentMonth || !day.isAvailable}
                    onClick={() => flow.setSelectedAvailableDate(day.isoDate)}
                    className={cn(
                      "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition",
                      !day.isCurrentMonth && "cursor-default text-[#cbd5e1]",
                      day.isCurrentMonth &&
                        !day.isAvailable &&
                        "cursor-not-allowed text-[#cbd5e1]",
                      day.isCurrentMonth &&
                        day.isAvailable &&
                        "text-[#0f172a] hover:bg-[rgba(137,90,246,0.08)]",
                      day.isSelected &&
                        "bg-[#895af6] text-white shadow-[0px_12px_24px_rgba(137,90,246,0.28)]",
                    )}
                  >
                    {day.dayLabel}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#71717a] text-center">
              Horário disponível
            </p>
            {flow.availabilityTimeSlots.length > 0 ? (
              <div className="mt-3 flex max-w-full flex-wrap gap-2">
                {flow.availabilityTimeSlots.map((slot) => {
                  const isSelected = flow.formState.selectedTimeSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => flow.setSelectedTimeSlot(slot)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition",
                        isSelected
                          ? "border-[#895af6] bg-[#895af6] text-white"
                          : "border-[#e2e8f0] bg-[#f8fafc] text-[#334155]",
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-2 text-sm text-[#64748b]">
                Nenhum horário disponível para a data selecionada.
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#71717a]">
              Endereço de gravação
            </h3>
            {flow.companyAddress ? (
              <button
                type="button"
                onClick={() => flow.setIsEditingAddress(true)}
                className="text-sm font-semibold text-[#895af6]"
              >
                Alterar
              </button>
            ) : null}
          </div>
          <div className="mt-2.5 rounded-[24px] bg-white p-3.5 shadow-[0px_1px_2px_rgba(15,23,42,0.06)]">
            {!flow.formState.isEditingAddress && flow.companyAddress ? (
              <div className="rounded-[20px] border border-[#e2e8f0] bg-[#f8fafc] p-3.5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[rgba(137,90,246,0.12)] text-[#895af6]">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#0f172a]">
                      Endereço cadastrado da empresa
                    </p>
                    <p className="mt-1 text-[13px] leading-5 text-[#64748b]">
                      {flow.formState.locationAddress}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  value={flow.formState.locationAddress}
                  onChange={(event) =>
                    flow.setLocationAddress(event.target.value)
                  }
                  placeholder="Rua, número, bairro, cidade e estado"
                  className="h-11 rounded-2xl border-[#dbe3ef] px-4 text-[13px]"
                />
                {flow.companyAddress ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-full"
                    onClick={flow.useRegisteredAddress}
                  >
                    Usar endereço cadastrado
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </section>

        <section>
          <SectionHeader title="Briefing do projeto" />
          <div className="mt-2.5 rounded-[24px] bg-white p-3.5 shadow-[0px_1px_2px_rgba(15,23,42,0.06)]">
            <textarea
              value={flow.formState.description}
              onChange={(event) => flow.setDescription(event.target.value)}
              rows={5}
              className="min-h-32 w-full resize-none rounded-[20px] border border-[#dbe3ef] px-4 py-3 text-[13px] text-[#0f172a] outline-none transition focus:border-[#895af6]"
              placeholder="Descreva o objetivo, referências e entregáveis esperados do creator."
            />
          </div>
        </section>

        {flow.isHiringTermsAlreadyAccepted ? (
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/80 p-3.5 text-[13px] text-emerald-900 shadow-[0px_1px_2px_rgba(15,23,42,0.06)]">
            <p className="font-semibold">Termos de Contratação já aceitos.</p>
            {flow.hiringTermsAcceptedAt ? (
              <p className="mt-1 text-emerald-800/90">
                Último aceite registrado em {formatDateTime(flow.hiringTermsAcceptedAt)}.
              </p>
            ) : null}
          </div>
        ) : (
          <label className="flex items-start gap-3 rounded-[24px] bg-white p-3.5 text-[13px] text-[#475569] shadow-[0px_1px_2px_rgba(15,23,42,0.06)]">
            <input
              type="checkbox"
              checked={flow.formState.termsAccepted}
              onChange={(event) => flow.setTermsAccepted(event.target.checked)}
              disabled={flow.isHiringTermsStatusLoading}
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span>
              Li e aceito os{" "}
              <a
                href={flow.hiringTermsDocumentPath}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#6d28d9] underline decoration-[#c4b5fd] underline-offset-4"
              >
                Termos de Contratação da UGC Local
              </a>
              . O pagamento só é liberado após a aprovação final do conteúdo.
            </span>
          </label>
        )}
      </div>

      <div className="min-w-0 border-t border-[#e2e8f0] bg-white px-4 py-4 sm:px-5 lg:px-5">
        <div className="mb-3 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-3">
          {flow.selectedService ? (
            <>
              <div className="mt-2 space-y-1.5 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748b]">Serviço</span>
                  <span className="font-semibold text-[#0f172a]">
                    {flow.previewResult
                      ? formatCurrency(
                          flow.previewResult.serviceGrossAmountCents / 100,
                          flow.previewResult.currency ?? "BRL",
                        )
                      : formatCurrency(
                          flow.selectedService.basePriceCents / 100,
                          flow.selectedService.currency,
                        )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748b]">Transporte</span>
                  <span className="font-semibold text-[#0f172a]">
                    {flow.isPreviewLoading && flow.canComputePreview
                      ? "…"
                      : (() => {
                          const pr = flow.previewResult;
                          if (!pr) {
                            return "—";
                          }
                          const feeCents = pr.transportFeeAmountCents;
                          if (typeof feeCents === "number" && Number.isFinite(feeCents)) {
                            return formatCurrency(
                              feeCents / 100,
                              pr.currency ?? "BRL",
                            );
                          }
                          if (pr.transport?.formatted) {
                            return pr.transport.formatted;
                          }
                          return "—";
                        })()}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between border-t border-dashed border-[#dbe3ef] pt-2">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#71717a]">
                    Total
                  </span>
                  <span className="text-[15px] font-bold text-[#895af6]">
                    {flow.isPreviewLoading && flow.canComputePreview
                      ? "…"
                      : flow.previewResult
                        ? formatCurrency(
                            flow.previewResult.companyTotalAmountCents / 100,
                            flow.previewResult.currency ?? "BRL",
                          )
                        : formatCurrency(
                            flow.selectedService.basePriceCents / 100,
                            flow.selectedService.currency,
                          )}
                  </span>
                </div>
                {flow.previewResult?.transport?.isMinimumApplied ? (
                  <p className="pt-1 text-[11px] text-[#64748b]">
                    Taxa minima de deslocamento aplicada.
                  </p>
                ) : flow.previewResult ? (
                  <p className="pt-1 text-[11px] text-[#64748b]">
                    Baseado na distancia ate o local.
                  </p>
                ) : null}
                {flow.isPreviewLoading ? (
                  <p className="pt-1 text-[11px] text-[#64748b]">
                    Recalculando distancia e transporte...
                  </p>
                ) : null}
                {!flow.previewResult &&
                !flow.isPreviewLoading &&
                !flow.canComputePreview ? (
                  <p className="pt-1 text-[11px] text-[#64748b]">
                    O valor do transporte aparece após informar o endereço do
                    serviço, a data e o horário.
                  </p>
                ) : null}
                {flow.previewError ? (
                  <p className="pt-1 text-[11px] text-[#b91c1c]">
                    {flow.previewError}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
        <Button
          type="button"
          variant="purple"
          className="h-12 w-full rounded-full text-sm font-bold"
          onClick={flow.submit}
          disabled={!flow.canSubmit || flow.isSubmitting || !flow.hasServices}
        >
          {flow.isSubmitting ? "Processando..." : "Ir para pagamento"}
        </Button>
      </div>
    </div>
  );
}

function SectionHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#71717a]">
        {title}
      </h3>
      {meta ? (
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
          {meta}
        </span>
      ) : null}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-3 rounded-[28px] border border-dashed border-[#cbd5e1] bg-white p-4 text-sm text-[#64748b]">
      {text}
    </div>
  );
}
