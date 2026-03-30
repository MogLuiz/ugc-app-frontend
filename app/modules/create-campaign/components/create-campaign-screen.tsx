import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";

const CAMPAIGN_STEPS = [
  { number: 1, label: "Tipo de Conteúdo", description: "Foto, vídeo, reel, story…" },
  { number: 2, label: "Data",             description: "Quando acontece a campanha?" },
  { number: 3, label: "Local",            description: "Endereço ou região do estabelecimento" },
  { number: 4, label: "Valor",            description: "Quanto você pagará ao creator" },
  { number: 5, label: "Detalhes",         description: "Briefing, requisitos e observações" },
];

export function CreateCampaignScreen() {
  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 pb-24 pt-4 lg:gap-8 lg:p-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6 px-4 lg:gap-8 lg:px-0">

        <div>
          <h1 className="text-2xl font-black tracking-[-0.5px] text-slate-900 lg:text-3xl lg:tracking-[-0.75px]">
            Criar Campanha
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 lg:mt-2 lg:text-base">
            Publique uma nova campanha e encontre creators ideais para a sua marca.
          </p>
        </div>

        {/* Steps overview */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            Etapas da campanha
          </p>
          <ol className="flex flex-col gap-3">
            {CAMPAIGN_STEPS.map((step) => (
              <li
                key={step.number}
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[rgba(137,90,246,0.12)] text-xs font-bold text-[#895af6]">
                  {step.number}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{step.label}</p>
                  <p className="text-xs text-slate-400">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-center text-sm text-slate-400">
            Em breve você poderá criar campanhas diretamente aqui.
          </p>
        </section>
        </div>
      </main>

      <BusinessBottomNav />
    </div>
  );
}
