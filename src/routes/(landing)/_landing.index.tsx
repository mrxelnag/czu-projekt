import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

export const Route = createFileRoute("/(landing)/_landing/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="">
      <Hero />
      <Features />
      <Cta />
    </div>
  );
}

function Hero() {
  return (
    <section
      className="container mx-auto px-4 py-16 text-center md:py-24"
      id="o-nas"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Vítejte v EduCasino
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl">
          Studentský projekt simulující prostředí online casina pro výukové
          účely. Hrajte demo hry zdarma a bezpečně — bez skutečných peněz.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button size="lg" asChild>
            <Link to="/registrace">Začít zdarma</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/login">Mám účet</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      title: "Demo hry",
      desc: "Vyzkoušejte si hrací automat a ruletu bez rizika ztráty peněz.",
    },
    {
      title: "Zodpovědné hraní",
      desc: "Naučte se zásady bezpečného hraní a správy bankrollu.",
    },
    {
      title: "Další popis",
      desc: "Projekt je vytvořen pro studijní účely a je snadno rozšiřitelný.",
    },
  ] as const;

  return (
    <section className="container mx-auto px-4 py-12 md:py-16" id="hry">
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((it) => (
          <Card key={it.title} className="h-full">
            <CardHeader>
              <CardTitle>{it.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{it.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-20" id="bezpecnost">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">
          Hrajte zodpovědně
        </h2>
        <p className="text-muted-foreground">
          EduCasino je pouze studentský projekt. Neprobíhají zde žádné finanční
          transakce. Cílem je vzdělávání a ukázka práce s moderními webovými
          technologiemi.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button asChild size="lg">
            <Link to="/registrace">Vytvořit účet</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Přihlásit se</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
