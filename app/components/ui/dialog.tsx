import { useState, type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type DialogProps = {
  title: string;
  description?: string;
  triggerLabel: string;
  children: ReactNode;
};

export function Dialog({ title, description, triggerLabel, children }: DialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className={cn("w-full max-w-md rounded-2xl bg-white p-5 shadow-xl")}>
            <div className="mb-4">
              <h3 className="text-base font-semibold">{title}</h3>
              {description ? <p className="text-sm text-slate-600">{description}</p> : null}
            </div>
            <div className="mb-4">{children}</div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
