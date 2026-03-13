import { Outlet } from "react-router";

export function MobileShellLayout() {
  return (
    <div className="min-h-screen bg-[#f6f5f8]">
      <Outlet />
    </div>
  );
}
