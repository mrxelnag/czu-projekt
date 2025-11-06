import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/authentication.ts";

export const Route = createFileRoute("/app/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  return <div className="mx-auto max-w-4xl space-y-6 p-6"></div>;
}
