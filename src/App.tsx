import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "@/lib/theme-provider.tsx";
import { routeTree } from "@/routeTree.gen.ts";
import { queryClient } from "./lib/query-client.ts";
import { useAuth } from "@/lib/authentication.ts";

// Create a new router instance
const router = createRouter({
  routeTree,
  scrollRestoration: true,
  context: {
    queryClient,
    user: null!,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { user } = useAuth();
  return (
    <RouterProvider
      router={router}
      basepath="/"
      context={{
        queryClient,
        user,
      }}
    />
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
