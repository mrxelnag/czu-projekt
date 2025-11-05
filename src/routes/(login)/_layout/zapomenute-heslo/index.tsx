import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/components/page-components/login/password-form.tsx";

export const Route = createFileRoute("/(login)/_layout/zapomenute-heslo/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        name: "meta",
        content:
          "CZU Kasíno, webová aplikace pro majitele restaurací, kde správa restaurace a jídelních lístků konečně dává smysl.",
      },
      {
        title: "CZU Kasíno | Zapomenuté heslo",
      },
    ],
  }),
});

function RouteComponent() {
  return <ForgotPasswordForm />;
}
