type Environment = "dev" | "test" | "prod";

const ENVIRONMENT_BY_MODE: Record<string, Environment> = {
  development: "dev",
  test: "test",
  production: "prod"
};

export function getEnvironment(): Environment {
  return ENVIRONMENT_BY_MODE[import.meta.env.MODE] ?? "dev";
}

export function getApiBaseUrl() {
  const defaultByEnvironment: Record<Environment, string> = {
    dev: "http://localhost:3000",
    test: "http://localhost:3001",
    prod: "https://api.ugc-app.com.br"
  };

  const customUrl = import.meta.env.VITE_API_BASE_URL;
  return customUrl ?? defaultByEnvironment[getEnvironment()];
}
