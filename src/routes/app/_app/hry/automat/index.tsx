import { createFileRoute } from "@tanstack/react-router";
import Slot from "@/components/page-components/games/slot.tsx";

export const Route = createFileRoute("/app/_app/hry/automat/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        name: "meta",
        content: "CZU Kasíno, studenstký projekt kasína",
      },
      {
        title: "CZU Kasíno | Automat",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div className="border-primary rounded-lg border-2">
      <Slot />
    </div>
  );
}
