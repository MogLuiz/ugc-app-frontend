import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  route("/", "routes/_app-layout.tsx", [
    index("routes/home.tsx"),
    route("auth/login", "routes/auth.login.tsx"),
    route("auth/register", "routes/auth.register.tsx"),
    route("agenda", "routes/agenda.tsx"),
    route("mapa", "routes/mapa.tsx"),
    route("marketplace", "routes/marketplace.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("campanhas", "routes/campanhas.tsx"),
    route("ofertas", "routes/ofertas.tsx"),
    route("perfil", "routes/perfil.tsx"),
    route("criador/:creatorId", "routes/criador.$creatorId.tsx")
  ])
] satisfies RouteConfig;
