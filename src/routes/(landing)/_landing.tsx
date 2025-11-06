import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";

export const Route = createFileRoute("/(landing)/_landing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="bg-primary text-primary-foreground inline-flex h-8 w-8 items-center justify-center rounded-md font-bold">
            C
          </span>
          <Link to="/" className="text-lg font-semibold">
            EduCasino
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <a href="#o-nas" className="hover:text-primary transition-colors">
            O projektu
          </a>
          <a href="#hry" className="hover:text-primary transition-colors">
            Hry
          </a>
          <a
            href="#bezpecnost"
            className="hover:text-primary transition-colors"
          >
            Zodpovědné hraní
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Přihlásit se</Link>
          </Button>
          <Button asChild>
            <Link to="/registrace">Registrace</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t">
      <div className="text-muted-foreground container mx-auto space-y-3 px-4 py-8 text-sm">
        <div className="bg-muted/30 rounded-md border p-3">
          <p className="text-foreground font-medium">
            Upozornění: studentský projekt
          </p>
          <p>
            Tento web byl vytvořen pouze pro studijní účely. Nejedná se o
            skutečné online casino a není možné zde sázet skutečné peníze.
          </p>
        </div>
        <p className="">© {year} EduCasino — Studentský projekt</p>
      </div>
    </footer>
  );
}
