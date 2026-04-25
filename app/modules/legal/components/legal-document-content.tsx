import type { LegalDocumentSection } from "../legal.types";

type LegalDocumentContentProps = {
  sections: LegalDocumentSection[];
};

export function LegalDocumentContent({ sections }: LegalDocumentContentProps) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            {section.heading}
          </h2>
          <div className="space-y-3 text-sm leading-7 text-slate-600 sm:text-[15px]">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
