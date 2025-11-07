import { Link, useLocation } from "@tanstack/react-router";
import { DollarSignIcon, GamepadIcon, HomeIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export default function MobileNav() {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();
  return (
    <div className="border-border bg-background fixed bottom-0 left-0 z-50 w-screen border-t">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-4">
        <Link
          to={"/app"}
          activeOptions={{ exact: true }}
          className="[&.active]:text-primary hover:bg-accent hover:text-accent-foreground inline-flex flex-col items-center justify-center transition-colors"
        >
          <HomeIcon className="text-foreground mb-1 h-5 w-5" />
        </Link>
        <Link
          to={"/app/hry/automat"}
          data-active={location.pathname.startsWith("/app/hry")}
          className="data-[active=true]:text-primary hover:bg-accent hover:text-accent-foreground inline-flex flex-col items-center justify-center transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-20"
        >
          <GamepadIcon className="text-foreground mb-1 h-5 w-5" />
        </Link>
        <Link
          to={"/app/transakce"}
          data-active={location.pathname.startsWith("/app/transakce")}
          className="data-[active=true]:text-primary hover:bg-accent hover:text-accent-foreground inline-flex flex-col items-center justify-center transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-20"
        >
          <DollarSignIcon className="text-foreground mb-1 h-5 w-5" />
        </Link>
        <div className="inline-flex flex-col items-center justify-center">
          <Button
            variant="link"
            onClick={toggleSidebar}
            className="hover:bg-accent text-foreground hover:text-accent-foreground h-full w-full rounded-none"
          >
            <MenuIcon className="mb-1 !h-5 !w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
