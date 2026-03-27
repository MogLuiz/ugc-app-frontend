import { Rocket, Star, Users2 } from "lucide-react";

// ── Login panel avatars (Figma, valid 7 days) ──────────────────────────────
const loginUser1 =
  "https://www.figma.com/api/mcp/asset/885aeade-d43c-447f-90b4-fad51d864bdf";
const loginUser2 =
  "https://www.figma.com/api/mcp/asset/3a5aea73-812f-47e5-8cf0-77c9d5537937";
const loginUser3 =
  "https://www.figma.com/api/mcp/asset/d6bfc2ba-1633-4b0b-91cf-3a04d7368c35";

// ── Register panel avatars (Figma 262:1780, valid 7 days) ─────────────────
const regUser1 =
  "https://www.figma.com/api/mcp/asset/d6aa3d73-629b-4af4-b659-e0a2ba4b253b";
const regUser2 =
  "https://www.figma.com/api/mcp/asset/b67352b5-f80e-496b-acf3-6f17534faa70";
const regUser3 =
  "https://www.figma.com/api/mcp/asset/4297e90f-5f50-4a21-9478-7e219ff76b14";

type AuthVisualPanelProps = {
  variant: "login" | "register";
};

export function AuthVisualPanel({ variant }: AuthVisualPanelProps) {
  if (variant === "login") return <LoginPanel />;
  return <RegisterPanel />;
}

// ─── Login Panel — Figma 259:1053 ─────────────────────────────────────────────

function LoginPanel() {
  return (
    <aside
      className="relative hidden h-screen flex-col items-start justify-between overflow-hidden p-16 lg:sticky lg:top-0 lg:flex lg:w-3/5"
      style={{
        background: [
          "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.08) 0%, transparent 55%)",
          "radial-gradient(ellipse 70% 90% at 0% 0%, rgba(108,78,255,1) 0%, transparent 50%)",
          "radial-gradient(ellipse 70% 90% at 100% 0%, rgba(127,91,255,1) 0%, transparent 50%)",
          "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(90,53,255,0.6) 0%, transparent 60%)",
          "radial-gradient(ellipse 70% 90% at 100% 100%, rgba(58,31,216,1) 0%, transparent 50%)",
          "rgb(58, 31, 216)",
        ].join(", "),
      }}
    >
      {/* Floating card 1 — top-right, rotate +3° */}
      <div className="absolute right-[69.6px] top-[126.77px] rotate-3">
        <div className="flex h-[210px] w-[320px] flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-[25px] shadow-[0px_20px_50px_0px_rgba(0,0,0,0.1)] backdrop-blur-[6px]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-white/10" />
            <div className="h-4 w-32 rounded-full bg-white/10" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-2 w-full rounded-full bg-white/5" />
            <div className="h-2 w-[216px] rounded-full bg-white/5" />
            <div className="h-2 w-[180px] rounded-full bg-white/5" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="h-8 w-24 rounded-full bg-white/10" />
            <div className="h-3 w-12 rounded-full bg-white/5" />
          </div>
        </div>
      </div>

      {/* Floating card 2 — middle-bottom right, rotate -3° */}
      <div className="absolute bottom-[215px] right-[-44px] -rotate-3">
        <div className="flex h-[260px] w-[384px] flex-col gap-6 rounded-[24px] border border-white/10 bg-white/5 p-[33px] shadow-[0px_30px_60px_0px_rgba(0,0,0,0.15)] backdrop-blur-[8px]">
          <div className="h-4 w-40 rounded-full bg-white/20" />
          <div className="grid h-[98px] grid-cols-3 gap-3">
            <div className="rounded-[40px] bg-white/5" />
            <div className="rounded-[40px] bg-white/5" />
            <div className="rounded-[40px] bg-white/5" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-start">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border border-white/10 bg-white/10"
                  style={{ marginRight: i < 2 ? "-8px" : 0 }}
                />
              ))}
            </div>
            <div className="h-2 w-20 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="relative flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-black tracking-tight text-white">
          UGC Local
        </span>
      </div>

      {/* Copy */}
      <div className="relative flex flex-1 flex-col items-start justify-end">
        <div className="flex max-w-[512px] flex-col gap-4">
          <p className="text-xs font-black uppercase tracking-[4.8px] text-white/60">
            O futuro da criação de conteúdo
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
        <div className="flex items-start">
          {[loginUser1, loginUser2, loginUser3].map((src, i) => (
            <div
              key={src}
              className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/20"
              style={{ marginRight: i < 2 ? "-12px" : 0, zIndex: 3 - i }}
            >
              <img
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                src={src}
              />
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm font-bold text-white">+100 criadores ativos</p>
          <p className="text-xs text-white/40">Crescendo 15% todo mês</p>
        </div>
      </div>
    </aside>
  );
}

// ─── Register Panel — Figma 262:1780 ──────────────────────────────────────────

function RegisterPanel() {
  return (
    <aside
      className="relative hidden h-screen flex-col overflow-hidden lg:sticky lg:top-0 lg:flex lg:w-3/5"
      style={{
        background:
          "linear-gradient(135deg, rgb(108,78,255) 0%, rgb(127,91,255) 35%, rgb(90,53,255) 70%, rgb(58,31,216) 100%)",
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.08) 0%, transparent 55%)",
        }}
      />

      {/* Decorative icon overlay — opacity 10% */}
      <div className="absolute bottom-[20%] right-0 top-[23%] flex items-center opacity-10">
        <Users2 className="h-[480px] w-[480px] text-white" strokeWidth={0.5} />
      </div>

      {/* Logo */}
      <div className="absolute left-16 top-16 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-black tracking-tight text-white">
          UGC Local
        </span>
      </div>

      {/* Content */}
      <div className="absolute left-16 top-[254px] flex max-w-[512px] flex-col gap-6">
        <p className="text-xs font-bold uppercase tracking-[3.6px] text-white/60">
          UGC Local Marketplace
        </p>
        <h2 className="text-[60px] font-black leading-[60px] tracking-[-3px] text-white">
          Conectando{"\n"}marcas a{"\n"}criadores locais
        </h2>
        <p className="text-[18px] font-medium leading-[29px] text-white/80">
          Encontre oportunidades, feche campanhas e produza conteúdo com
          agilidade. A plataforma premium para quem cria o futuro do varejo
          local.
        </p>
      </div>

      {/* Social proof — glassmorphism card */}
      <div className="absolute bottom-16 left-16 flex items-center gap-6 rounded-[24px] border border-white/15 bg-white/8 p-[25px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1)] backdrop-blur-[6px]">
        {/* Avatar stack */}
        <div className="flex items-start">
          {[regUser1, regUser2, regUser3].map((src, i) => (
            <div
              key={src}
              className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white/20"
              style={{ marginRight: i < 2 ? "-16px" : 0, zIndex: 3 - i }}
            >
              <img
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                src={src}
              />
            </div>
          ))}
          {/* +2k badge */}
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/20 bg-[#6c4eff] text-xs font-bold text-white"
            style={{ marginLeft: "-16px" }}
          >
            +2k
          </div>
        </div>
        {/* Text */}
        <div>
          <p className="text-[18px] font-bold text-white">
            +100 criadores ativos
          </p>
          <p className="text-sm text-white/60">
            Produzindo conteúdo agora mesmo
          </p>
        </div>
      </div>
    </aside>
  );
}
