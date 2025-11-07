import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  redirect,
  Scripts,
} from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner.tsx";
import { AuthUser } from "@/lib/authentication.ts";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: AuthUser | null;
}>()({
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <Toaster />
      <Scripts />
    </>
  ),
});
