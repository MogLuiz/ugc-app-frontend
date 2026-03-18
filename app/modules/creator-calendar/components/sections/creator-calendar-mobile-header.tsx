import { ArrowLeft, Bell, Calendar } from "lucide-react";

type MobileHeaderProps = {
  title: string;
  leadingAction?: () => void;
};

export function MobileHeader({ title, leadingAction }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[rgba(137,90,246,0.08)] bg-[#f6f5f8]/95 px-4 py-4 backdrop-blur-md">
      <button type="button" onClick={leadingAction} className="rounded-full p-2 text-slate-700">
        {leadingAction ? <ArrowLeft className="size-5" /> : <Calendar className="size-5 text-[#895af6]" />}
      </button>
      <h1 className="text-lg font-bold tracking-[-0.02em] text-slate-900">{title}</h1>
      <button type="button" className="relative rounded-full p-2 text-slate-700">
        <Bell className="size-5" />
        <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-[#f6f5f8] bg-red-500" />
      </button>
    </header>
  );
}
