import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { ArrowLeft } from "lucide-react";
import { checkUserIsLoggedIn } from "@/lib/authentication.ts";

export const Route = createFileRoute("/(login)/_layout")({
  beforeLoad: async () => {
    if (await checkUserIsLoggedIn()) {
      throw redirect({
        to: "/app",
      });
    }
  },
  component: RouteComponent,
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
  const navigate = useNavigate();
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <a
        href={"/"}
        className={buttonVariants({
          variant: "secondary",
          className: "absolute top-2 left-2 md:top-6 md:left-6",
        })}
      >
        <ArrowLeft /> Zpět na hlavní stránku
      </a>
      <div className="w-full max-w-sm md:max-w-4xl">
        <Outlet />
      </div>
    </div>
  );
}
