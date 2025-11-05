import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  CalendarDays,
  ForkKnife,
  Settings,
  Clock,
  CreditCard,
  Users,
} from "lucide-react";
import { Header1 } from "@/components/typography/header1.tsx";

interface QuickLink {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const quickLinks: QuickLink[] = [
  {
    title: "Denní menu",
    description: "Upravit dnešní nabídku jídel",
    icon: Calendar,
    path: "/menu/denni",
  },
  {
    title: "Týdenní menu",
    description: "Naplánovat jídla na týden",
    icon: CalendarDays,
    path: "/menu/tydenni",
  },
  {
    title: "Stálé menu",
    description: "Spravovat stálou nabídku",
    icon: ForkKnife,
    path: "/menu/stale",
  },
  {
    title: "Nastavení restaurace",
    description: "Základní informace a údaje",
    icon: Settings,
    path: "/restaurace/nastaveni",
  },
  {
    title: "Otevírací doba",
    description: "Nastavit provozní hodiny",
    icon: Clock,
    path: "/restaurace/oteviraci-doba",
  },
  {
    title: "Předplatné",
    description: "Spravovat platební údaje",
    icon: CreditCard,
    path: "/restaurace/predplatne",
  },
  {
    title: "Správci",
    description: "Správa uživatelů a oprávnění",
    icon: Users,
    path: "/spravci",
  },
];

export default function QuickNavigation() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl space-y-10 p-6">
      <div className="text-center">
        <Header1 primaryColor>CZU Kasíno</Header1>
        <p className="text-muted-foreground mt-1 text-sm">
          Místo, kde správa restaurace a jídelních lístků konečně dává smysl.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link, i) => {
          const Icon = link.icon;
          return (
            <Card onClick={() => navigate({ to: link.path })} key={link.path}>
              <CardHeader className="flex items-center gap-4 pb-2">
                <div className="bg-primary/10 group-hover:bg-primary/15 flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                  <Icon className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-foreground text-center text-lg font-semibold">
                  {link.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-center text-sm">
                  {link.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
