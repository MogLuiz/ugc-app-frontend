import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  route("/", "routes/_app-layout.tsx", [
    index("routes/home.tsx"),
    route("auth/login", "routes/auth.login.tsx"),
    route("auth/register", "routes/auth.register.tsx"),
    route("agenda", "routes/agenda.tsx"),
    route("empresa/:companyUserId", "routes/empresa.$companyUserId.tsx"),
    route("campanha/:contractRequestId", "routes/campanha.$contractRequestId.tsx"),
    route("mapa", "routes/mapa.tsx"),
    route("marketplace", "routes/marketplace.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("campanhas", "routes/campanhas.tsx"),
    route("criar", "routes/criar.tsx"),
    route("ofertas", "routes/ofertas.tsx"),
    route("ofertas/:id", "routes/ofertas.$id.tsx"),
    route("chat", "routes/chat.tsx"),
    route("perfil", "routes/perfil.tsx"),
    route("indicacoes", "routes/indicacoes.tsx"),
    route("criador/:creatorId", "routes/criador.$creatorId.tsx")
  ])
] satisfies RouteConfig;
