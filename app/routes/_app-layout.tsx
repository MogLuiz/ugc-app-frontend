import { MobileShellLayout } from "~/components/layout/mobile-shell";
import { QueryClientProviderWrapper } from "~/lib/query/query-client-provider";
import { AuthProvider } from "~/modules/auth/context";

export default function AppLayoutRoute() {
  return (
    <QueryClientProviderWrapper>
      <AuthProvider>
        <MobileShellLayout />
      </AuthProvider>
    </QueryClientProviderWrapper>
  );
}
