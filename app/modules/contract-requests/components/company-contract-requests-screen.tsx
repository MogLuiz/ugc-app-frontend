import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { useMyCompanyContractRequestsQuery } from "../queries";
import type { ContractRequestStatus } from "../types";
import {
  formatCurrency,
  formatDateTime,
  getContractRequestStatusMeta,
} from "../utils";

const STATUS_OPTIONS: Array<{ value: "" | ContractRequestStatus; label: string }> = [
  { value: "", label: "Todos os status" },
  { value: "PENDING_ACCEPTANCE", label: "Pendentes" },
  { value: "ACCEPTED", label: "Aceitas" },
  { value: "REJECTED", label: "Recusadas" },
  { value: "CANCELLED", label: "Canceladas" },
  { value: "COMPLETED", label: "Concluídas" },
];

export function CompanyContractRequestsScreen() {
  const [status, setStatus] = useState<ContractRequestStatus | undefined>(undefined);
  const contractRequestsQuery = useMyCompanyContractRequestsQuery(status);
  const items = contractRequestsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 pb-24 pt-6 lg:p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Solicitações da Empresa</h1>
            <p className="mt-1 text-sm text-slate-500">
              Acompanhe o status das contratações enviadas aos creators.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="hidden items-center gap-2 text-sm font-medium text-slate-600 lg:inline-flex"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </header>

        <section className="rounded-[32px] bg-white p-5 shadow-sm lg:rounded-[48px] lg:p-6">
          <label className="flex max-w-xs flex-col gap-2 text-sm font-semibold text-slate-700">
            Filtrar por status
            <select
              value={status ?? ""}
              onChange={(event) =>
                setStatus(
                  event.target.value ? (event.target.value as ContractRequestStatus) : undefined
                )
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none focus:border-[#895af6]"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        {contractRequestsQuery.isLoading && items.length === 0 ? (
          <p className="text-sm text-slate-600">Carregando solicitações...</p>
        ) : contractRequestsQuery.error ? (
          <div className="rounded-[32px] bg-white p-6 text-sm text-slate-600 shadow-sm">
            {contractRequestsQuery.error instanceof Error
              ? contractRequestsQuery.error.message
              : "Não foi possível carregar as solicitações."}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600 shadow-sm">
            Nenhuma solicitação encontrada para o filtro selecionado.
          </div>
        ) : (
          <section className="flex flex-col gap-4">
            {items.map((item) => {
              const statusMeta = getContractRequestStatusMeta(item.status);
              return (
                <article
                  key={item.id}
                  className="rounded-[32px] bg-white p-5 shadow-sm lg:rounded-[48px] lg:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">
                          {item.creatorNameSnapshot}
                        </h2>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusMeta.className}`}
                        >
                          {statusMeta.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{item.description}</p>
                      <p className="text-sm text-slate-500">
                        {formatDateTime(item.startsAt)} • {item.durationMinutes} min
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.jobFormattedAddress ?? item.jobAddress}
                      </p>
                    </div>

                    <div className="min-w-[180px] rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase text-slate-400">Total</p>
                      <p className="mt-1 text-xl font-bold text-[#895af6]">
                        {formatCurrency(item.totalPrice, item.currency)}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Base: {formatCurrency(item.creatorBasePrice, item.currency)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Transporte: {formatCurrency(item.transportFee, item.currency)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      <BusinessBottomNav />
    </div>
  );
}
