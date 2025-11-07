import { createFileRoute } from "@tanstack/react-router";
import { UpdateUserForm } from "@/components/page-components/user/user-form.tsx";
import { useAuth } from "@/lib/authentication.ts";

export const Route = createFileRoute("/app/_app/nastaveni/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  return (
    <div>
      <UpdateUserForm user={user!} />
    </div>
  );
}
