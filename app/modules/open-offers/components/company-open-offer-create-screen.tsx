import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, MapPin, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod/v3";
import { toast } from "sonner";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { Button } from "~/components/ui/button";
import { HttpError } from "~/lib/http/errors";
import { cn } from "~/lib/utils";
import { useAuthContext } from "~/modules/auth/context";
import { lookupCep, formatCep } from "~/modules/creator-profile-edit/lib/cep-lookup";
import { formatCurrency, formatDateShort, formatDuration } from "~/modules/contract-requests/utils";
import { useCreateOpenOfferMutation } from "../mutations";
import { useOpenOfferJobTypesQuery } from "../queries";
import { formatProfileAddress, hasUsableCompanyAddress } from "../helpers";

// ─── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z
  .object({
    jobTypeId: z.string().min(1, "Selecione o tipo de serviço."),
    description: z.string().trim().min(10, "Descreva melhor o trabalho."),
    startsAt: z.string().min(1, "Informe data e hora de início."),
    expiresAt: z.string().min(1, "Informe o prazo para receber candidaturas."),
    offeredAmount: z.preprocess(
      (v) => {
        if (v === "" || v === null || v === undefined) return undefined;
        const n = Number(v);
        return Number.isNaN(n) ? undefined : n;
      },
      z
        .number({
          required_error: "Informe o valor do trabalho.",
          invalid_type_error: "Informe o valor do trabalho.",
        })
        .min(0.01, "Digite um valor válido.")
    ),
    durationMinutes: z.coerce.number().min(1),
    // Address mode: true = use company's registered address; false = structured fields
    useCompanyAddress: z.boolean(),
    zipCode: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const startsAt = new Date(data.startsAt);
    const expiresAt = new Date(data.expiresAt);

    if (!Number.isNaN(startsAt.getTime()) && !Number.isNaN(expiresAt.getTime())) {
      if (expiresAt <= new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["expiresAt"],
          message: "A data precisa estar no futuro.",
        });
      }

      if (expiresAt >= startsAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["expiresAt"],
          message: "O prazo deve ser anterior à data de início.",
        });
      }
    }

    if (!data.useCompanyAddress) {
      if (!data.zipCode?.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["zipCode"], message: "Informe o CEP." });
      if (!data.street?.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["street"], message: "Informe o logradouro." });
      if (!data.number?.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["number"], message: "Informe o número." });
      if (!data.city?.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["city"], message: "Informe a cidade." });
      if (!data.state?.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["state"], message: "Informe o estado." });
    }
  });

type FormValues = z.infer<typeof formSchema>;
type CepStatus = "idle" | "loading" | "found" | "not_found" | "error";

// ─── Utilities ────────────────────────────────────────────────────────────────

function toIsoLocal(value: string) {
  return new Date(value).toISOString();
}

function toInputDateTime(value: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CompanyOpenOfferCreateScreen() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const createMutation = useCreateOpenOfferMutation();
  const jobTypesQuery = useOpenOfferJobTypesQuery();

  const jobTypeOptions = useMemo(
    () => (jobTypesQuery.data ?? []).filter((item) => item.mode === "PRESENTIAL"),
    [jobTypesQuery.data]
  );

  const companyHasAddress = useMemo(
    () => hasUsableCompanyAddress(user?.profile),
    [user?.profile]
  );

  // ─── Default dates ──────────────────────────────────────────────────────────
  const defaultStartsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  defaultStartsAt.setMinutes(0, 0, 0);
  defaultStartsAt.setHours(Math.max(8, defaultStartsAt.getHours()), 0, 0, 0);
  const defaultExpiresAt = new Date(defaultStartsAt.getTime() - 4 * 60 * 60 * 1000);

  // ─── Form ───────────────────────────────────────────────────────────────────
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      jobTypeId: "",
      description: "",
      startsAt: toInputDateTime(defaultStartsAt),
      expiresAt: toInputDateTime(defaultExpiresAt),
      offeredAmount: undefined,
      durationMinutes: 60,
      useCompanyAddress: companyHasAddress,
      zipCode: "",
      street: "",
      number: "",
      city: "",
      state: "",
    },
  });

  // ─── Watched values for preview ─────────────────────────────────────────────
  const selectedJobTypeId = useWatch({ control: form.control, name: "jobTypeId" });
  const startsAtValue = useWatch({ control: form.control, name: "startsAt" });
  const expiresAtValue = useWatch({ control: form.control, name: "expiresAt" });
  const amountValue = useWatch({ control: form.control, name: "offeredAmount" });
  const descriptionValue = useWatch({ control: form.control, name: "description" });
  const useCompanyAddressValue = useWatch({ control: form.control, name: "useCompanyAddress" });
  const zipCodeValue = useWatch({ control: form.control, name: "zipCode" });
  const streetValue = useWatch({ control: form.control, name: "street" });
  const numberValue = useWatch({ control: form.control, name: "number" });
  const cityValue = useWatch({ control: form.control, name: "city" });
  const stateValue = useWatch({ control: form.control, name: "state" });

  const selectedJobType = useMemo(
    () => jobTypeOptions.find((item) => item.id === selectedJobTypeId) ?? null,
    [jobTypeOptions, selectedJobTypeId]
  );

  const startsAtDate = startsAtValue ? new Date(startsAtValue) : null;
  const expiresAtDate = expiresAtValue ? new Date(expiresAtValue) : null;

  // ─── Date constraints ───────────────────────────────────────────────────────
  const hasManualExpiresAt = useRef(false);
  const nowInputMin = useMemo(() => toInputDateTime(new Date()), []);

  const expiresAtMax = useMemo(() => {
    if (!startsAtValue) return undefined;
    const start = new Date(startsAtValue);
    if (Number.isNaN(start.getTime())) return undefined;
    return toInputDateTime(new Date(start.getTime() - 60_000));
  }, [startsAtValue]);

  useEffect(() => {
    if (!startsAtValue) return;
    const startDate = new Date(startsAtValue);
    if (Number.isNaN(startDate.getTime())) return;

    const currentExpires = form.getValues("expiresAt");
    const expiresDate = currentExpires ? new Date(currentExpires) : null;
    const isInvalid =
      !expiresDate ||
      Number.isNaN(expiresDate.getTime()) ||
      expiresDate >= startDate ||
      expiresDate <= new Date();

    if (!hasManualExpiresAt.current || isInvalid) {
      const startsMs = startDate.getTime();
      const auto = new Date(startsMs - 4 * 60 * 60 * 1000);
      const floor = new Date(Date.now() + 60_000);
      let candidate = auto < floor ? floor : auto;
      if (candidate >= startDate) candidate = new Date(startsMs - 60_000);
      form.setValue("expiresAt", toInputDateTime(candidate), { shouldValidate: false });
    }
  }, [startsAtValue, form]);

  // ─── Address preview ────────────────────────────────────────────────────────
  const previewAddress = useMemo(() => {
    if (useCompanyAddressValue) return formatProfileAddress(user?.profile);
    return formatProfileAddress({
      addressStreet: streetValue,
      addressNumber: numberValue,
      addressCity: cityValue,
      addressState: stateValue,
      addressZipCode: zipCodeValue,
    });
  }, [useCompanyAddressValue, user?.profile, streetValue, numberValue, cityValue, stateValue, zipCodeValue]);

  // ─── CEP lookup ─────────────────────────────────────────────────────────────
  const [cepStatus, setCepStatus] = useState<CepStatus>("idle");
  const [cityStateLocked, setCityStateLocked] = useState(false);
  const cepAbortRef = useRef<AbortController | null>(null);

  const handleCepChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCep(e.target.value);
      form.setValue("zipCode", formatted, { shouldValidate: false });

      const digits = formatted.replace(/\D/g, "");
      if (digits.length < 8) {
        setCepStatus("idle");
        setCityStateLocked(false);
        return;
      }

      cepAbortRef.current?.abort();
      const controller = new AbortController();
      cepAbortRef.current = controller;
      setCepStatus("loading");

      try {
        const result = await lookupCep(formatted, controller.signal);
        if (result.found) {
          form.setValue("street", result.street, { shouldValidate: true });
          form.setValue("city", result.city, { shouldValidate: true });
          form.setValue("state", result.state, { shouldValidate: true });
          setCityStateLocked(true);
          setCepStatus("found");
        } else {
          setCityStateLocked(false);
          setCepStatus("not_found");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setCityStateLocked(false);
        setCepStatus("error");
      }
    },
    [form]
  );

  function switchToCompanyAddress() {
    form.setValue("useCompanyAddress", true);
    form.setValue("zipCode", "");
    form.setValue("street", "");
    form.setValue("number", "");
    form.setValue("city", "");
    form.setValue("state", "");
    form.clearErrors(["zipCode", "street", "number", "city", "state"]);
    setCityStateLocked(false);
    setCepStatus("idle");
    cepAbortRef.current?.abort();
  }

  function switchToCustomAddress() {
    form.setValue("useCompanyAddress", false);
  }

  // ─── Submit ─────────────────────────────────────────────────────────────────
  async function onSubmit(values: FormValues) {
    const jobType = jobTypeOptions.find((jt) => jt.id === values.jobTypeId);
    if (jobType && values.offeredAmount < jobType.minimumOfferedAmount) {
      form.setError("offeredAmount", {
        message: `O valor mínimo para este tipo é ${formatCurrency(jobType.minimumOfferedAmount, "BRL")}.`,
      });
      return;
    }

    const jobAddress = values.useCompanyAddress
      ? formatProfileAddress(user?.profile)
      : formatProfileAddress({
          addressStreet: values.street,
          addressNumber: values.number,
          addressCity: values.city,
          addressState: values.state,
          addressZipCode: values.zipCode,
        });

    try {
      const result = await createMutation.mutateAsync({
        jobTypeId: values.jobTypeId,
        description: values.description.trim(),
        startsAt: toIsoLocal(values.startsAt),
        expiresAt: toIsoLocal(values.expiresAt),
        jobAddress,
        offeredAmount: values.offeredAmount,
        durationMinutes: values.durationMinutes,
      });

      toast.success("Oferta criada com sucesso.");
      void navigate(`/ofertas/${result.id}`);
    } catch (error) {
      if (error instanceof HttpError) {
        toast.error(error.message);
        return;
      }
      toast.error("Não foi possível criar a oferta.");
    }
  }

  // ─── CEP status icon ────────────────────────────────────────────────────────
  const cepIcon =
    cepStatus === "loading" ? (
      <Loader2 className="size-4 animate-spin text-[#895af6]" />
    ) : cepStatus === "found" ? (
      <CheckCircle2 className="size-4 text-emerald-500" />
    ) : cepStatus === "not_found" || cepStatus === "error" ? (
      <XCircle className="size-4 text-red-400" />
    ) : null;

  const cepHint =
    cepStatus === "not_found"
      ? "CEP não encontrado. Preencha os campos manualmente."
      : cepStatus === "error"
        ? "Erro ao buscar CEP. Preencha manualmente."
        : cepStatus === "idle"
          ? "Preencha o CEP para auto-completar os campos abaixo."
          : null;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 pb-24 pt-4 lg:p-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6 px-4 lg:px-0">
          <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#895af6]">
                Nova oferta
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900">
                Publicar oferta aberta
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Defina o tipo, a descrição e o prazo para receber candidaturas. O transporte será calculado apenas quando você selecionar o creator.
              </p>
            </div>

            <Link
              to="/ofertas"
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
            >
              Voltar para ofertas
            </Link>
          </header>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
            <form
              id="open-offer-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 rounded-[32px] bg-white p-6 shadow-sm"
            >
              <section className="grid gap-5 md:grid-cols-2">

                {/* Tipo de serviço */}
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Tipo de serviço</span>
                  <select
                    {...form.register("jobTypeId", {
                      onChange: (event) => {
                        const next = jobTypeOptions.find((item) => item.id === event.target.value);
                        if (next) {
                          form.setValue("durationMinutes", next.durationMinutes, {
                            shouldValidate: true,
                          });
                          if (!form.getValues("offeredAmount")) {
                            form.setValue("offeredAmount", next.minimumOfferedAmount);
                          }
                        }
                      },
                    })}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900"
                  >
                    <option value="">Selecione</option>
                    {jobTypeOptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.jobTypeId ? (
                    <p className="text-xs font-medium text-rose-600">
                      {form.formState.errors.jobTypeId.message}
                    </p>
                  ) : null}
                </label>

                {/* Valor do trabalho */}
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Valor do trabalho</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 150,00"
                    {...form.register("offeredAmount")}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-900"
                  />
                  {selectedJobType ? (
                    <p className="text-xs text-slate-500">
                      Mínimo para este tipo:{" "}
                      {formatCurrency(selectedJobType.minimumOfferedAmount, "BRL")}
                    </p>
                  ) : null}
                  {form.formState.errors.offeredAmount ? (
                    <p className="text-xs font-medium text-rose-600">
                      {form.formState.errors.offeredAmount.message}
                    </p>
                  ) : null}
                </label>

                {/* Data e hora */}
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Data e hora</span>
                  <input
                    type="datetime-local"
                    min={nowInputMin}
                    {...form.register("startsAt")}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-900"
                  />
                  {form.formState.errors.startsAt ? (
                    <p className="text-xs font-medium text-rose-600">
                      {form.formState.errors.startsAt.message}
                    </p>
                  ) : null}
                </label>

                {/* Receber candidaturas até */}
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Receber candidaturas até</span>
                  <input
                    type="datetime-local"
                    min={nowInputMin}
                    max={expiresAtMax}
                    {...form.register("expiresAt", {
                      onChange: () => { hasManualExpiresAt.current = true; },
                    })}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-900"
                  />
                  {form.formState.errors.expiresAt ? (
                    <p className="text-xs font-medium text-rose-600">
                      {form.formState.errors.expiresAt.message}
                    </p>
                  ) : null}
                </label>

                {/* Onde acontece? */}
                <div className="space-y-3 md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Onde acontece?</span>

                  {useCompanyAddressValue ? (
                    /* ── Endereço salvo compacto ── */
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <MapPin className="size-4 shrink-0 text-[#895af6]" />
                        <span className="truncate text-sm font-medium text-slate-800">
                          {formatProfileAddress(user?.profile)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={switchToCustomAddress}
                        className="shrink-0 text-xs font-semibold text-[#895af6] underline underline-offset-2 hover:opacity-70"
                      >
                        Alterar endereço
                      </button>
                    </div>
                  ) : (
                    /* ── Inline form ── */
                    <div className="space-y-3">
                      {companyHasAddress ? (
                        <button
                          type="button"
                          onClick={switchToCompanyAddress}
                          className="text-xs font-semibold text-[#895af6] underline underline-offset-2 hover:opacity-70"
                        >
                          ← Usar endereço cadastrado
                        </button>
                      ) : null}

                      {/* CEP */}
                      <div className="space-y-1.5">
                        <label htmlFor="zipCode" className="text-xs font-semibold text-slate-600">
                          CEP
                        </label>
                        <div className="relative">
                          <input
                            id="zipCode"
                            type="text"
                            inputMode="numeric"
                            maxLength={9}
                            value={zipCodeValue ?? ""}
                            onChange={handleCepChange}
                            placeholder="00000-000"
                            className={cn(
                              "h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-900",
                              cepIcon && "pr-10"
                            )}
                          />
                          {cepIcon ? (
                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                              {cepIcon}
                            </span>
                          ) : null}
                        </div>
                        {cepHint ? (
                          <p className="text-xs text-slate-400">{cepHint}</p>
                        ) : null}
                        {form.formState.errors.zipCode ? (
                          <p className="text-xs font-medium text-rose-600">
                            {form.formState.errors.zipCode.message}
                          </p>
                        ) : null}
                      </div>

                      {/* Logradouro */}
                      <div className="space-y-1.5">
                        <label htmlFor="street" className="text-xs font-semibold text-slate-600">
                          Logradouro
                        </label>
                        <input
                          id="street"
                          type="text"
                          {...form.register("street")}
                          placeholder="Rua, Avenida, Travessa…"
                          className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-900"
                        />
                        {form.formState.errors.street ? (
                          <p className="text-xs font-medium text-rose-600">
                            {form.formState.errors.street.message}
                          </p>
                        ) : null}
                      </div>

                      {/* Número */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label htmlFor="number" className="text-xs font-semibold text-slate-600">
                            Número
                          </label>
                          <input
                            id="number"
                            type="text"
                            {...form.register("number")}
                            placeholder="Ex: 123"
                            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-900"
                          />
                          {form.formState.errors.number ? (
                            <p className="text-xs font-medium text-rose-600">
                              {form.formState.errors.number.message}
                            </p>
                          ) : null}
                        </div>
                        <div />
                      </div>

                      {/* Cidade + Estado */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label htmlFor="city" className="text-xs font-semibold text-slate-600">
                            Cidade
                          </label>
                          <input
                            id="city"
                            type="text"
                            {...form.register("city")}
                            placeholder="Cidade"
                            disabled={cityStateLocked}
                            title={cityStateLocked ? "Definida pelo CEP" : undefined}
                            className={cn(
                              "h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-900",
                              cityStateLocked && "cursor-not-allowed bg-slate-50 text-slate-400"
                            )}
                          />
                          {form.formState.errors.city ? (
                            <p className="text-xs font-medium text-rose-600">
                              {form.formState.errors.city.message}
                            </p>
                          ) : null}
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="state" className="text-xs font-semibold text-slate-600">
                            Estado
                          </label>
                          <input
                            id="state"
                            type="text"
                            {...form.register("state")}
                            placeholder="UF"
                            maxLength={2}
                            disabled={cityStateLocked}
                            title={cityStateLocked ? "Definido pelo CEP" : undefined}
                            className={cn(
                              "h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm uppercase text-slate-900",
                              cityStateLocked && "cursor-not-allowed bg-slate-50 text-slate-400"
                            )}
                          />
                          {form.formState.errors.state ? (
                            <p className="text-xs font-medium text-rose-600">
                              {form.formState.errors.state.message}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {cityStateLocked ? (
                        <p className="text-xs text-slate-400">
                          Cidade e estado são definidos pelo CEP. Para alterá-los, mude o CEP.
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>

                <input type="hidden" {...form.register("durationMinutes", { valueAsNumber: true })} />

                {/* Descreva o trabalho */}
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Descreva o trabalho</span>
                  <textarea
                    {...form.register("description")}
                    rows={8}
                    className="w-full rounded-[24px] border border-slate-200 px-4 py-3 text-sm text-slate-900"
                    placeholder="Explique o objetivo, o que será produzido, contexto da marca e observações importantes."
                  />
                  {form.formState.errors.description ? (
                    <p className="text-xs font-medium text-rose-600">
                      {form.formState.errors.description.message}
                    </p>
                  ) : null}
                </label>
              </section>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end xl:hidden">
                <Button type="button" variant="outline" onClick={() => navigate("/ofertas")}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="purple"
                  disabled={createMutation.isPending || jobTypesQuery.isLoading}
                >
                  {createMutation.isPending ? "Publicando..." : "Publicar oferta"}
                </Button>
              </div>
            </form>

            {/* ── Painel lateral ── */}
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <section className="rounded-[32px] bg-[#111318] p-6 text-white shadow-sm">

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                  Resumo da oferta
                </p>

                <h2 className="mt-3 text-2xl font-black">
                  {selectedJobType?.name ?? "Selecione um tipo"}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/70">
                  {descriptionValue?.trim() || "A descrição aparecerá aqui conforme você preencher o formulário."}
                </p>

                <div className="mt-6 rounded-[24px] bg-white/6 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Valor do trabalho
                  </p>
                  {amountValue ? (
                    <p className="mt-2 text-3xl font-black">{formatCurrency(amountValue, "BRL")}</p>
                  ) : (
                    <p className="mt-2 text-xl font-semibold text-white/35">Defina o valor</p>
                  )}
                  <p className="mt-3 text-xs text-white/55">
                    Transporte calculado apenas na seleção do creator.
                  </p>
                </div>

                <div className="my-5 border-t border-white/10" />

                <dl className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <dt className="shrink-0 text-white/45">Início</dt>
                    <dd className="text-right font-semibold">
                      {startsAtDate && !Number.isNaN(startsAtDate.getTime())
                        ? `${formatDateShort(startsAtDate.toISOString())} ${startsAtDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
                        : "Defina a data"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="shrink-0 text-white/45">Candidaturas até</dt>
                    <dd className="text-right font-semibold">
                      {expiresAtDate && !Number.isNaN(expiresAtDate.getTime())
                        ? `${formatDateShort(expiresAtDate.toISOString())} ${expiresAtDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
                        : "Defina o prazo"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="shrink-0 text-white/45">Duração</dt>
                    <dd className="text-right font-semibold">
                      {selectedJobType ? formatDuration(selectedJobType.durationMinutes) : "Selecione um tipo"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="shrink-0 text-white/45">Local</dt>
                    <dd className="min-w-0 flex-1 text-right font-semibold line-clamp-2">
                      {previewAddress || "Defina o local"}
                    </dd>
                  </div>
                </dl>

                <Button
                  type="submit"
                  form="open-offer-form"
                  variant="purple"
                  className="mt-6 w-full"
                  disabled={createMutation.isPending || jobTypesQuery.isLoading}
                >
                  {createMutation.isPending ? "Publicando..." : "Publicar oferta"}
                </Button>

              </section>
            </aside>
          </div>
        </div>
      </main>

      <BusinessBottomNav />
    </div>
  );
}
