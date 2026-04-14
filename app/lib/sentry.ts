import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router";
import { getApiBaseUrl } from "~/lib/config/env";

const TRACES_SAMPLE_RATE = 0.05;
const REPLAYS_SESSION_SAMPLE_RATE = 0.01;
const REPLAYS_ON_ERROR_SAMPLE_RATE = 1.0;

function getSentryRelease(): string | undefined {
  const fromRelease = import.meta.env.VITE_SENTRY_RELEASE?.trim();
  if (fromRelease) return fromRelease;
  const fromVercel = import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.trim();
  if (fromVercel) return fromVercel;
  return undefined;
}

function escapeOriginForRegex(origin: string): string {
  return origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTracePropagationTargets(): (string | RegExp)[] {
  const targets: (string | RegExp)[] = [];
  if (typeof window !== "undefined") {
    targets.push(new RegExp(`^${escapeOriginForRegex(window.location.origin)}`));
  }
  try {
    const origin = new URL(getApiBaseUrl()).origin;
    targets.push(new RegExp(`^${escapeOriginForRegex(origin)}`));
  } catch {
    // getApiBaseUrl inválido neste ambiente
  }
  return targets;
}

function isAbortError(exception: unknown): boolean {
  if (!exception || typeof exception !== "object") return false;
  const name = (exception as { name?: string }).name;
  if (name === "AbortError") return true;
  if (exception instanceof DOMException && exception.name === "AbortError") {
    return true;
  }
  return false;
}

function isLikelyExtensionOnlyError(exception: unknown): boolean {
  if (!(exception instanceof Error) || !exception.stack) return false;
  const stack = exception.stack;
  return (
    /chrome-extension:\/\//i.test(stack) ||
    /moz-extension:\/\//i.test(stack) ||
    /safari-web-extension:\/\//i.test(stack)
  );
}

let initialized = false;

export function isSentryEnabled(): boolean {
  const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();
  return Boolean(dsn) && import.meta.env.VITE_SENTRY_ENABLED !== "false";
}

export function initSentry(): void {
  if (!isSentryEnabled() || initialized) return;
  initialized = true;

  const release = getSentryRelease();

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment:
      import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE,
    ...(release ? { release } : {}),
    sendDefaultPii: false,
    integrations: [
      Sentry.reactRouterV7BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration({
        maskAllInputs: true,
        blockAllMedia: true,
        mask: [".sentry-mask", "[data-sentry-mask]"],
        block: [".sentry-block", "[data-sentry-block]"],
      }),
    ],
    tracesSampleRate: TRACES_SAMPLE_RATE,
    replaysSessionSampleRate: REPLAYS_SESSION_SAMPLE_RATE,
    replaysOnErrorSampleRate: REPLAYS_ON_ERROR_SAMPLE_RATE,
    tracePropagationTargets: buildTracePropagationTargets(),
    denyUrls: [
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
      /^safari-web-extension:\/\//i,
    ],
    ignoreErrors: [
      /^AbortError$/,
      /^The user aborted a request\.?$/i,
      /^signal is aborted without reason$/i,
    ],
    beforeSend(event, hint) {
      const ex = hint.originalException;
      if (isAbortError(ex)) return null;
      if (isLikelyExtensionOnlyError(ex)) return null;
      return event;
    },
  });
}
