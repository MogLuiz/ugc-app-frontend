import { useState, type ReactNode } from "react";
import { cn } from "~/lib/utils";

type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  defaultTabId?: string;
  /** Ativa scroll horizontal — necessário quando há mais de 3 tabs. */
  scrollable?: boolean;
};

export function Tabs({ items, defaultTabId, scrollable = false }: TabsProps) {
  const [active, setActive] = useState(defaultTabId ?? items[0]?.id ?? "");
  const activeTab = items.find((item) => item.id === active);

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "rounded-xl bg-slate-100 p-1",
          scrollable ? "flex gap-2 overflow-x-auto" : "flex gap-2",
        )}
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition whitespace-nowrap",
              scrollable ? "shrink-0" : "flex-1",
              item.id === active ? "bg-white font-medium text-slate-900 shadow-sm" : "text-slate-600"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div>{activeTab?.content}</div>
    </div>
  );
}
