import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import {
  checkUserIsLoggedIn,
  useAuth,
  userQueryOptions,
} from "@/lib/authentication.ts";
import MobileNav from "@/components/mobile-navigation.tsx";
import { useIsMobile } from "@/hooks/use-mobile.tsx";
import ErrorPage from "@/components/page-components/status-page/error-page.tsx";
import LoadingPage from "@/components/page-components/status-page/loading-page.tsx";
import React, { useEffect } from "react";
import JackpotTopbar from "@/components/page-components/jackpot-top-bar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { formatBTC, formatSAT } from "@/lib/utils.ts";

export const Route = createFileRoute("/app/_app")({
  beforeLoad: async ({ context, location }) => {
    if (!(await checkUserIsLoggedIn())) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(userQueryOptions),

  pendingComponent: () => <LoadingPage />,
  errorComponent: ErrorPage,
  component: LayoutComponent,
  head: () => ({
    meta: [
      {
        name: "meta",
        content:
          "CZU Kasíno, webová aplikace pro majitele restaurací, kde správa restaurace a jídelních lístků konečně dává smysl.",
      },
      {
        title: "CZU Kasíno | Admin",
      },
    ],
  }),
});

function LayoutComponent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  return (
    <SidebarProvider>
      <AppSidebar user={user!} />
      <SidebarInset>
        <JackpotTopbar />
        <Badge className="mx-auto mt-2 max-w-md min-w-[100px] text-center">
          Balance: {formatSAT(user?.current_balance || 0)}
        </Badge>
        <main
          className={`text-foreground flex h-full w-0 min-w-full flex-col p-2 [view-transition-name:main-content] md:p-5 ${
            isMobile
              ? "min-h-[calc(100svh-4rem)] pt-2 pb-20"
              : "min-h-svh pt-0 pb-4"
          }`}
        >
          <Outlet />
        </main>
        {isMobile && <MobileNav />}
      </SidebarInset>
    </SidebarProvider>
  );
}
