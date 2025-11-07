import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/lib/authentication.ts";

export const Route = createFileRoute("/app/_app/admin/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!(context.user!.player_role === "admin")) {
      throw redirect({
        to: "/app",
      });
    }
  },
});

function RouteComponent() {
  return <div>Hello "/app/_app/admin/"!</div>;
}
