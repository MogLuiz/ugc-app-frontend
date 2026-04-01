import { AppLogoMark } from "~/components/ui/app-logo-mark";

export function AppLoadingSplash() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f6f5f8]">
      <AppLogoMark preset="splash" />
    </div>
  );
}
