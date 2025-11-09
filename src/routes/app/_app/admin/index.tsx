import { createFileRoute, redirect } from "@tanstack/react-router";
import AdminDashboard from "@/components/page-components/admin/admin-dashboard.tsx";

export const Route = createFileRoute("/app/_app/admin/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!(context.user!.player_role === "admin")) {
      throw redirect({
        to: "/app",
      });
    }
  },
  head: () => ({
    meta: [
      {
        name: "meta",
        content: "CZU Kasíno, studenstký projekt kasína",
      },
      {
        title: "CZU Kasíno | Admin",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div>
      <AdminDashboard />
    </div>
  );
}
