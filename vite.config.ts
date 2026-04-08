import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const vercelSha = process.env.VERCEL_GIT_COMMIT_SHA ?? "";

  const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
  const sentryOrg = process.env.SENTRY_ORG;
  const sentryProject = process.env.SENTRY_PROJECT;

  const releaseName =
    env.VITE_SENTRY_RELEASE?.trim() || vercelSha.trim() || undefined;

  const enableSentryUpload =
    command === "build" &&
    Boolean(sentryAuthToken && sentryOrg && sentryProject);

  return {
    build: {
      sourcemap: true,
    },
    define: {
      "import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA": JSON.stringify(vercelSha),
    },
    plugins: [
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
      ...(enableSentryUpload
        ? [
            sentryVitePlugin({
              org: sentryOrg,
              project: sentryProject,
              authToken: sentryAuthToken,
              ...(releaseName
                ? {
                    release: {
                      name: releaseName,
                    },
                  }
                : {}),
              sourcemaps: {
                assets: "./build/client/**",
                filesToDeleteAfterUpload: ["./build/client/**/*.map"],
              },
            }),
          ]
        : []),
    ],
  };
});
