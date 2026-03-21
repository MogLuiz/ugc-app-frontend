import { CheckCircle2, MapPin, Video, XCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { formatCurrency } from "~/modules/contract-requests/utils";
import type { CreatorHireFlowController } from "../../hooks/use-creator-hire-flow";
import type { CreatorProfile } from "../../types";

type CreatorHireFormProps = {
  profile: CreatorProfile;
  flow: CreatorHireFlowController;
};

export function CreatorHireForm({ profile, flow }: CreatorHireFormProps) {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-x-hidden">
      <div className="flex-1 space-y-5 overflow-x-hidden overflow-y-auto px-4 pb-5 pt-5 sm:px-5 lg:px-5">
        <section className="pr-12">
          <h2 className="text-[28px] font-bold tracking-tight text-[#0f172a]">
            Contratar {profile.name}
          </h2>
          <p className="mt-1.5 text-[13px] leading-5 text-[#64748b]">
            Escolha serviço, disponibilidade e envie o briefing sem sair desta
            tela.
          </p>
        </section>

        <section>
          <SectionHeader
            title="Selecionar Serviço"
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
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgba(137,90,246,0.12)] text-[#895af6]">
                      <Video className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-semibold text-[#0f172a]">
                        {service.name}
                      </span>
                      <span className="mt-1 block text-[13px] text-[#64748b]">
                        {service.durationMinutes} min
                      </span>
                      <span className="mt-2 block text-[15px] font-bold text-[#0f172a]">
                        {formatCurrency(service.price, service.currency)}
                      </span>
                    </span>
                    <span className="shrink-0 pt-1">
                      {isSelected ? (
                        <CheckCircle2 className="h-5 w-5 text-[#895af6]" />
                      ) : (
                        <XCircle className="h-5 w-5 text-[#cbd5e1]" />
                      )}
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
          <SectionHeader title="Data e Horário" meta={flow.monthLabel} />
          <div className="mt-2.5 rounded-[24px] bg-white p-3.5 shadow-[0px_1px_2px_rgba(15,23,42,0.06)]">
            <div className="flex max-w-full gap-2.5 overflow-x-auto pb-1 pr-2">
              {flow.availabilityDayOptions.map((day) => {
                const isSelected =
                  flow.formState.selectedAvailableDay === day.value;

                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => flow.setSelectedAvailableDay(day.value)}
                    className={cn(
                      "flex min-w-[68px] flex-col items-center rounded-[20px] border px-3 py-2.5 text-center transition",
                      isSelected
                        ? "border-[#895af6] bg-[#895af6] text-white"
                        : "border-[#e2e8f0] bg-white text-[#0f172a]",
                    )}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.08em]">
                      {day.weekdayLabel}
                    </span>
                    <span className="mt-1 text-lg font-bold">{day.dayLabel}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-[13px] font-semibold text-[#334155]">
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
          <SectionHeader title="Endereço da Gravação" />
          <div className="mt-2.5 rounded-[24px] bg-white p-3.5 shadow-[0px_1px_2px_rgba(15,23,42,0.06)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[13px] font-semibold text-[#334155]">
                Local do job
              </p>
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
                  onChange={(event) => flow.setLocationAddress(event.target.value)}
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
          <SectionHeader title="Briefing do Projeto" />
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

        <label className="flex items-start gap-3 rounded-[24px] bg-white p-3.5 text-[13px] text-[#475569] shadow-[0px_1px_2px_rgba(15,23,42,0.06)]">
          <input
            type="checkbox"
            checked={flow.formState.termsAccepted}
            onChange={(event) => flow.setTermsAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300"
          />
          <span>
            Li e aceito os termos da contratação. O pagamento só é liberado após
            a aprovação final do conteúdo.
          </span>
        </label>
      </div>

      <div className="min-w-0 border-t border-[#e2e8f0] bg-white px-4 py-4 sm:px-5 lg:px-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#94a3b8]">
              Serviço selecionado
            </p>
            <p className="mt-1 truncate text-[13px] font-semibold text-[#0f172a]">
              {flow.selectedService?.name ?? "Selecione um serviço"}
            </p>
          </div>
          {flow.selectedService ? (
            <p className="text-[15px] font-bold text-[#895af6]">
              {formatCurrency(
                flow.selectedService.price,
                flow.selectedService.currency,
              )}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="purple"
          className="h-12 w-full rounded-full text-sm font-bold"
          onClick={flow.submit}
          disabled={!flow.canSubmit || flow.isSubmitting || !flow.hasServices}
        >
          {flow.isSubmitting ? "Enviando..." : "Contratar Creator"}
        </Button>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  meta,
}: {
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-[15px] font-bold text-[#0f172a]">{title}</h3>
      {meta ? (
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
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
