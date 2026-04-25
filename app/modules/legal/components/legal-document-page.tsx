import { LegalLayout } from "./legal-layout";
import { LegalDocumentContent } from "./legal-document-content";
import type { LegalDocument } from "../legal.types";

type LegalDocumentPageProps = {
  document: LegalDocument;
};

export function LegalDocumentPage({ document }: LegalDocumentPageProps) {
  return (
    <LegalLayout>
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <article className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-36px_rgba(15,23,42,0.32)]">
          <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(137,90,246,0.12),_transparent_42%),linear-gradient(180deg,_#ffffff_0%,_#faf8ff_100%)] px-6 py-8 sm:px-10 sm:py-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7c4aed]">
              Documento legal
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {document.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              {document.description}
            </p>

            <dl className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3">
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Versão
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {document.version}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3">
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Última atualização
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {document.updatedAt}
                </dd>
              </div>
            </dl>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <LegalDocumentContent sections={document.content} />
          </div>
        </article>
      </div>
    </LegalLayout>
  );
}
