import { Search } from "lucide-react";
import { Link } from "react-router";

export function BusinessDashboardExploreHero() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0px_4px_6px_-1px_rgba(106,54,213,0.04),0px_20px_40px_-1px_rgba(44,47,48,0.08)] lg:p-8">
      <h2 className="text-2xl font-extrabold tracking-[-0.75px] text-[#2c2f30] lg:text-[30px] lg:leading-9">
        Explorar criadores
      </h2>
      <p className="mt-3 text-base leading-7 text-[#595c5d] lg:text-lg">
        Encontre creators disponíveis perto de você para suas campanhas de forma rápida e eficiente.
      </p>
      <Link
        to="/marketplace"
        className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-[#6a36d5] px-8 py-3.5 text-sm font-bold text-white shadow-[0px_20px_25px_-5px_rgba(106,54,213,0.25),0px_8px_10px_-6px_rgba(106,54,213,0.25)] transition hover:bg-[#5b2fc4]"
      >
        <Search className="size-4 shrink-0 opacity-95" aria-hidden />
        Explorar marketplace
      </Link>
    </section>
  );
}
