import { useAuth } from "~/hooks/use-auth";
import { CompanyProfileDesktop } from "./company-profile-desktop";
import { CompanyProfileMobile } from "./company-profile-mobile";

export function CompanyProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="hidden lg:block">
        <CompanyProfileDesktop user={user} />
      </div>
      <div className="lg:hidden">
        <CompanyProfileMobile user={user} />
      </div>
    </>
  );
}
