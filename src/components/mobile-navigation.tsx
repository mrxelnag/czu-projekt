import { Link, useLocation } from "@tanstack/react-router";
import { ForkKnife, HomeIcon, MenuIcon, StoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/authentication.ts";

export default function MobileNav() {
  const { toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  return (
    <div className="border-border bg-background fixed bottom-0 left-0 z-50 w-screen border-t">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-4">
        <Link
          to={"/"}
          activeOptions={{ exact: true }}
          className="[&.active]:text-primary hover:bg-accent hover:text-accent-foreground inline-flex flex-col items-center justify-center transition-colors"
        >
          <HomeIcon className="mb-1 h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Link>
        <Link
          to={"/menu/denni"}
          data-active={location.pathname.startsWith("/menu")}
          disabled={user!.restaurant === ""}
          className="data-[active=true]:text-primary hover:bg-accent hover:text-accent-foreground inline-flex flex-col items-center justify-center transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-20"
        >
          <ForkKnife className="mb-1 h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Link>
        <Link
          to={"/restaurace/nastaveni"}
          disabled={user!.restaurant === ""}
          data-active={location.pathname.startsWith("/restaurace")}
          className="data-[active=true]:text-primary hover:bg-accent hover:text-accent-foreground inline-flex flex-col items-center justify-center transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-20"
        >
          <StoreIcon className="mb-1 h-5 w-5" />
          <span className="sr-only">Restaurace</span>
        </Link>
        <div className="inline-flex flex-col items-center justify-center">
          <Button
            variant="link"
            onClick={toggleSidebar}
            className="hover:bg-accent text-foreground hover:text-accent-foreground h-full w-full rounded-none"
          >
            <MenuIcon className="mb-1 !h-5 !w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
