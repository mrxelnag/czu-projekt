import { createFileRoute } from "@tanstack/react-router";
import Transaction from "@/components/page-components/transaction/transaction-fonm.tsx";

export const Route = createFileRoute("/app/_app/transakce/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        name: "meta",
        content: "CZU Kasíno, studenstký projekt kasína",
      },
      {
        title: "CZU Kasíno | Transakce",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center">
      <Transaction />
    </div>
  );
}
