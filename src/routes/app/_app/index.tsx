import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/authentication.ts";
import QuickNavigation from "@/components/page-components/quick-navigation.tsx";

export const Route = createFileRoute("/app/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  return <QuickNavigation />;
}
