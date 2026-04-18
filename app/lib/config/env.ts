import { getApiBaseUrlEnv } from "~/lib/env";

type Environment = "dev" | "test" | "prod";

const ENVIRONMENT_BY_MODE: Record<string, Environment> = {
  development: "dev",
  test: "test",
  staging: "dev",
  production: "prod"
};

export function getEnvironment(): Environment {
  return ENVIRONMENT_BY_MODE[import.meta.env.MODE] ?? "dev";
}

export function getApiBaseUrl() {
  return getApiBaseUrlEnv();
}
