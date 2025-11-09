import { createFileRoute } from "@tanstack/react-router";
import { RegistrationForm } from "@/components/page-components/login/reg-form.tsx";

export const Route = createFileRoute("/(login)/_layout/registrace/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        name: "meta",
        content: "czu kasino",
      },
      {
        title: "CZU Kasíno | Registrace",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div>
      <RegistrationForm />
    </div>
  );
}
