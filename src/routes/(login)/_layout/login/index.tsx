import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/page-components/login/login-form.tsx";

export const Route = createFileRoute("/(login)/_layout/login/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        name: "meta",
        content:
          "CZU Kasíno, webová aplikace pro majitele restaurací, kde správa restaurace a jídelních lístků konečně dává smysl.",
      },
      {
        title: "CZU Kasíno | Přihlášení",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
