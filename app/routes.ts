import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  route("/", "routes/_app-layout.tsx", [
    index("routes/home.tsx"),
    route("auth/login", "routes/auth.login.tsx"),
    route("auth/register", "routes/auth.register.tsx"),
    route("empresa", "routes/business.dashboard.tsx"),
    route("mapa", "routes/mapa.tsx"),
    route("criadora", "routes/creator.dashboard.tsx"),
    route("jobs/novo", "routes/jobs.new.tsx")
  ])
] satisfies RouteConfig;
