import { useNavigate, useSearchParams } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { cn } from "~/lib/utils";
import {
  useAcceptContractRequestMutation,
  useCreatorOffersHubQuery,
  useRejectContractRequestMutation,
} from "../queries";
import type { CreatorHubItem } from "../creator-hub.types";
import { CreatorHubCard } from "./creator-hub-card";
import { CreatorOffersEmptyState, OffersEmptyState } from "./offers-empty-state";

type Tab = "PENDING" | "ACCEPTED" | "FINALIZED";

const TABS: { id: Tab; label: string }[] = [
  { id: "PENDING", label: "Pendentes" },
  { id: "ACCEPTED", label: "Em andamento" },
  { id: "FINALIZED", label: "Finalizadas" },
];

function parseTab(value: string | null): Tab {
  if (value === "ACCEPTED" || value === "confirmed") return "ACCEPTED";
  if (value === "FINALIZED" || value === "finalized") return "FINALIZED";
  return "PENDING";
}

function StatusFilter({
  activeTab,
  onTabChange,
  counts,
}: {
  activeTab: Tab;
  onTabChange: (id: Tab) => void;
  counts: Record<Tab, number | null>;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar ofertas por status"
      className="flex min-w-0 w-full rounded-full bg-[#e7e6e9] p-1 lg:w-fit lg:self-start"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts[tab.id];
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden rounded-full px-2 py-2 text-xs transition lg:flex-none lg:gap-1.5 lg:px-4 lg:py-2 lg:text-sm",
              isActive
                ? "bg-white font-bold text-slate-900 shadow-sm"
                : "font-semibold text-slate-600 hover:text-slate-800"
            )}
          >
            <span className="min-w-0 truncate">{tab.label}</span>
            {count != null && (
              <span
                className={cn(
                  "shrink-0 tabular-nums text-[10px] font-bold leading-none lg:text-xs lg:font-semibold",
                  isActive ? "text-slate-800" : "text-slate-600"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="h-[260px] animate-pulse rounded-[28px] bg-white shadow-sm" />
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{label}</h2>
      <span className="text-xs font-semibold text-slate-400">({count})</span>
    </div>
  );
}

function PendingTabContent({
  invites,
  applications,
  onAccept,
  onReject,
}: {
  invites: CreatorHubItem[];
  applications: CreatorHubItem[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const hasInvites = invites.length > 0;
  const hasApplications = applications.length > 0;

  if (!hasInvites && !hasApplications) {
    return (
      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <CreatorOffersEmptyState />
      </section>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-8">
      {hasInvites && (
        <section className="flex min-w-0 flex-col gap-3">
          <SectionHeader label="Convites" count={invites.length} />
          <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
            {invites.map((item) => (
              <CreatorHubCard
                key={item.id}
                item={item}
                onAccept={onAccept}
                onReject={onReject}
              />
            ))}
          </div>
        </section>
      )}

      {hasApplications && (
        <section className="flex min-w-0 flex-col gap-3">
          <SectionHeader label="Candidaturas enviadas" count={applications.length} />
          <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
            {applications.map((item) => (
              <CreatorHubCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FinalizedTabContent({ hub }: { hub: NonNullable<ReturnType<typeof useCreatorOffersHubQuery>["data"]> }) {
  const all = [
    ...hub.finalized.completed,
    ...hub.finalized.rejected,
    ...hub.finalized.cancelled,
    ...hub.finalized.expired,
  ];

  if (all.length === 0) {
    return (
      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <OffersEmptyState
          title="Nenhuma oferta finalizada"
          description="Propostas concluídas, recusadas ou canceladas aparecerão aqui."
        />
      </section>
    );
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
      {all.map((item) => (
        <CreatorHubCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function CreatorPendingContractRequestsScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = parseTab(searchParams.get("tab"));

  const hubQuery = useCreatorOffersHubQuery();
  const hub = hubQuery.data;

  const acceptMutation = useAcceptContractRequestMutation();
  const rejectMutation = useRejectContractRequestMutation();

  function setActiveTab(tab: Tab) {
    setSearchParams(tab === "PENDING" ? {} : { tab }, { replace: true });
  }

  function handleAccept(contractRequestId: string) {
    acceptMutation.mutate(contractRequestId);
  }

  function handleReject(contractRequestId: string) {
    void navigate(`/ofertas/${contractRequestId}`, { state: { fromHub: true } });
  }

  const tabCounts: Record<Tab, number | null> = {
    PENDING: hub
      ? hub.summary.pendingInvitesCount + hub.summary.pendingApplicationsCount
      : null,
    ACCEPTED: hub?.summary.inProgressCount ?? null,
    FINALIZED: hub
      ? hub.finalized.completed.length +
        hub.finalized.rejected.length +
        hub.finalized.cancelled.length +
        hub.finalized.expired.length
      : null,
  };

  const content = (() => {
    if (hubQuery.isLoading) {
      return (
        <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (!hub) return null;

    if (activeTab === "PENDING") {
      return (
        <PendingTabContent
          invites={hub.pending.invites}
          applications={hub.pending.applications}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      );
    }

    if (activeTab === "ACCEPTED") {
      if (hub.inProgress.length === 0) {
        return (
          <section className="rounded-[28px] bg-white p-6 shadow-sm">
            <OffersEmptyState
              title="Nenhum trabalho em andamento"
              description="Quando você aceitar uma proposta, ela aparecerá aqui."
            />
          </section>
        );
      }
      return (
        <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          {hub.inProgress.map((item) => (
            <CreatorHubCard key={item.id} item={item} />
          ))}
        </div>
      );
    }

    return <FinalizedTabContent hub={hub} />;
  })();

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 pb-24 pt-4 lg:p-8">
        <div className="flex min-w-0 flex-1 flex-col px-4 lg:px-0">
          <header className="flex min-w-0 flex-col rounded-[32px] bg-[radial-gradient(circle_at_top_left,rgba(137,90,246,0.18),transparent_45%),linear-gradient(135deg,#15171a,#23262b)] px-6 py-5 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">
              Ofertas
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] lg:text-4xl">
              Suas propostas de trabalho
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Revise e responda no seu tempo.
            </p>
          </header>

          <div className="mt-3 min-w-0">
            <StatusFilter
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={tabCounts}
            />
          </div>

          <div className="mt-4 min-w-0">{content}</div>
        </div>
      </main>

      <CreatorBottomNav />
    </div>
  );
}
