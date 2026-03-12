import { useState, type ReactNode } from "react";
import { Button } from "~/components/ui/button";

type SheetProps = {
  triggerLabel: string;
  title: string;
  children: ReactNode;
};

export function Sheet({ triggerLabel, title, children }: SheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-900/40">
          <aside className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white p-5 shadow-xl">
            <header className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">{title}</h3>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Fechar
              </Button>
            </header>
            {children}
          </aside>
        </div>
      ) : null}
    </>
  );
}
