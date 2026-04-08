import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import { useAuthContext } from "~/modules/auth/context";
import { isSentryEnabled } from "~/lib/sentry";

export function SentryUserScope() {
  const { user } = useAuthContext();

  useEffect(() => {
    if (!isSentryEnabled()) return;
    if (user) {
      Sentry.setUser({ id: user.id });
      Sentry.setTag("role", user.role);
    } else {
      Sentry.setUser(null);
      Sentry.setTag("role", "guest");
    }
  }, [user]);

  return null;
}
