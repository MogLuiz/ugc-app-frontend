import { Rocket, Star } from "lucide-react";

// Avatar images from Figma (valid for 7 days)
const imgUser1 =
  "https://www.figma.com/api/mcp/asset/885aeade-d43c-447f-90b4-fad51d864bdf";
const imgUser2 =
  "https://www.figma.com/api/mcp/asset/3a5aea73-812f-47e5-8cf0-77c9d5537937";
const imgUser3 =
  "https://www.figma.com/api/mcp/asset/d6bfc2ba-1633-4b0b-91cf-3a04d7368c35";

type AuthVisualPanelProps = {
  variant: "login" | "register";
};

export function AuthVisualPanel({ variant }: AuthVisualPanelProps) {
  if (variant === "login") return <LoginPanel />;
  return <RegisterPanel />;
}

// ─── Login Panel — exact Figma 259:1053 ───────────────────────────────────────

const LOGIN_BG = {
  background: [
    "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.08) 0%, transparent 55%)",
    "radial-gradient(ellipse 70% 90% at 0% 0%, rgba(108,78,255,1) 0%, transparent 50%)",
    "radial-gradient(ellipse 70% 90% at 100% 0%, rgba(127,91,255,1) 0%, transparent 50%)",
    "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(90,53,255,0.6) 0%, transparent 60%)",
    "radial-gradient(ellipse 70% 90% at 100% 100%, rgba(58,31,216,1) 0%, transparent 50%)",
    "rgb(58, 31, 216)",
  ].join(", "),
};

function LoginPanel() {
  return (
    <aside
      className="relative hidden h-screen flex-col items-start justify-between overflow-hidden p-16 lg:flex lg:w-3/5 lg:sticky lg:top-0"
      style={LOGIN_BG}
    >
      {/* Floating card 1 — top-right, rotate +3° */}
      <div className="absolute right-[69.6px] top-[126.77px] rotate-3">
        <div className="flex h-[210px] w-[320px] flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-[25px] shadow-[0px_20px_50px_0px_rgba(0,0,0,0.1)] backdrop-blur-[6px]">
          {/* Header: avatar + name */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-white/10" />
            <div className="h-4 w-32 rounded-full bg-white/10" />
          </div>
          {/* Body lines */}
          <div className="flex flex-col gap-3">
            <div className="h-2 w-full rounded-full bg-white/5" />
            <div className="h-2 w-[216px] rounded-full bg-white/5" />
            <div className="h-2 w-[180px] rounded-full bg-white/5" />
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="h-8 w-24 rounded-full bg-white/10" />
            <div className="h-3 w-12 rounded-full bg-white/5" />
          </div>
        </div>
      </div>

      {/* Floating card 2 — middle-bottom right, rotate -3° */}
      <div className="absolute bottom-[215px] right-[-44px] -rotate-3">
        <div className="flex h-[260px] w-[384px] flex-col gap-6 rounded-[24px] border border-white/10 bg-white/5 p-[33px] shadow-[0px_30px_60px_0px_rgba(0,0,0,0.15)] backdrop-blur-[8px]">
          {/* Title line */}
          <div className="h-4 w-40 rounded-full bg-white/20" />
          {/* 3-col grid */}
          <div className="grid h-[98px] grid-cols-3 gap-3">
            <div className="rounded-[40px] bg-white/5" />
            <div className="rounded-[40px] bg-white/5" />
            <div className="rounded-[40px] bg-white/5" />
          </div>
          {/* Avatar row */}
          <div className="flex items-center gap-2">
            <div className="flex items-start pr-2">
              <div className="h-8 w-8 rounded-full border border-white/10 bg-white/10" style={{ marginRight: "-8px" }} />
              <div className="h-8 w-8 rounded-full border border-white/10 bg-white/10" style={{ marginRight: "-8px" }} />
              <div className="h-8 w-8 rounded-full border border-white/10 bg-white/10" />
            </div>
            <div className="h-2 w-20 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* Logo — top-left */}
      <div className="relative flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-black tracking-tight text-white">
          UGC Local
        </span>
      </div>

      {/* Main copy — bottom area */}
      <div className="relative flex flex-1 flex-col items-start justify-end">
        <div className="flex max-w-[512px] flex-col gap-4">
          <p className="text-xs font-black uppercase tracking-[4.8px] text-white/60">
            SaaS para Creators
          </p>
          <h2 className="text-[60px] font-black leading-[60px] tracking-[-1.5px] text-white">
            Impulsione sua{"\n"}marca com{"\n"}conteúdo local.
          </h2>
          <p className="pt-2 text-[20px] font-medium leading-[32.5px] text-white/70">
            A plataforma completa para gerenciar campanhas de UGC e conectar-se
            com os melhores talentos da sua região.
          </p>
        </div>
      </div>

      {/* Social proof */}
      <div className="relative flex items-center gap-5 rounded-[32px] border border-white/5 bg-black/10 p-[21px] backdrop-blur-[12px]">
        {/* Avatar stack */}
        <div className="flex items-start">
          {[imgUser1, imgUser2, imgUser3].map((src, i) => (
            <div
              key={src}
              className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/20"
              style={{ marginRight: i < 2 ? "-12px" : 0, zIndex: 3 - i }}
            >
              <img alt="" className="absolute inset-0 h-full w-full object-cover" src={src} />
            </div>
          ))}
        </div>
        {/* Text */}
        <div>
          <p className="text-sm font-bold text-white">+2.000 criadores ativos</p>
          <p className="text-xs text-white/40">Crescendo 15% todo mês</p>
        </div>
      </div>
    </aside>
  );
}

// ─── Register Panel — CSS-only ────────────────────────────────────────────────

const CSS_AVATARS = ["AM", "LC", "RB"];

function RegisterPanel() {
  return (
    <aside className="relative hidden min-h-screen lg:flex lg:w-1/2 flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#895af6] via-[#6d3fe0] to-[#4a1fb8]" />
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />

      <div className="relative flex h-full flex-col justify-between p-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">UGC Local</span>
        </div>

        <div className="space-y-3">
          <RegisterCards />
        </div>

        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
            Junte-se à rede
          </div>
          <h2 className="text-[36px] font-black leading-[1.15] tracking-tight text-white">
            Conectando marcas a criadores locais.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/75">
            A maior plataforma de conteúdo gerado pelo usuário para empresas que
            buscam autenticidade e resultados reais.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {CSS_AVATARS.map((initials, i) => (
                <div
                  key={initials}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-sm"
                  style={{
                    background: `hsl(${260 + i * 20}, 70%, ${45 + i * 5}%)`,
                    zIndex: CSS_AVATARS.length - i,
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-white/80">
              +2.000 criadores ativos hoje
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function RegisterCards() {
  return (
    <>
      <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7c4aed] text-sm font-bold text-white">
            AM
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">Ana Martins</p>
            <p className="text-xs text-white/60">Criadora de conteúdo · São Paulo</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#4ade80]/20 px-2.5 py-0.5 text-xs font-bold text-[#4ade80]">
            Match
          </span>
        </div>
        <div className="flex gap-2">
          {["Beleza", "Lifestyle", "Gastronomia"].map((tag) => (
            <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
        <div>
          <p className="text-xs text-white/60">Retorno da última campanha</p>
          <p className="mt-0.5 text-2xl font-black text-white">4,2× ROI</p>
          <p className="text-xs text-[#4ade80]">312 leads gerados</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/20">
          <Star className="h-7 w-7 text-yellow-400" />
        </div>
      </div>
    </>
  );
}
