import { render, screen } from "@testing-library/react";
import { DashboardOverview } from "~/modules/dashboard/components/dashboard-overview";

describe("DashboardOverview", () => {
  it("deve renderizar variacao para empresa", () => {
    render(<DashboardOverview role="business" />);
    expect(screen.getByText("Painel da empresa")).toBeInTheDocument();
  });

  it("deve renderizar variacao para criadora", () => {
    render(<DashboardOverview role="creator" />);
    expect(screen.getByText("Painel da criadora")).toBeInTheDocument();
  });
});
