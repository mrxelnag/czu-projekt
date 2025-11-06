import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'

export const Route = createFileRoute('/(landing)/_landing')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">C</span>
          <Link to="/" className="font-semibold text-lg">EduCasino</Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#o-nas" className="hover:text-primary transition-colors">O projektu</a>
          <a href="#hry" className="hover:text-primary transition-colors">Hry</a>
          <a href="#bezpecnost" className="hover:text-primary transition-colors">Zodpovědné hraní</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/app/login">Přihlásit se</Link>
          </Button>
          <Button asChild>
            <Link to="/app/register">Registrace</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground space-y-3">
        <div className="rounded-md border bg-muted/30 p-3">
          <p className="font-medium text-foreground">Upozornění: studentský projekt</p>
          <p>
            Tento web byl vytvořen pouze pro studijní účely. Nejedná se o skutečné online casino a není možné zde sázet skutečné peníze.
          </p>
        </div>
        <p className="">© {year} EduCasino — Studentský projekt</p>
      </div>
    </footer>
  )
}
