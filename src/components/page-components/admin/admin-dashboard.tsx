import type React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/page-components/admin/transaction-list.tsx";
import AddBalanceForm from "@/components/page-components/admin/add-balance-form.tsx";

export default function AdminDashboard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>Nástěnka</CardTitle>
        <CardDescription>
          Správa transakcí a uživatelských prostředků.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Všechny transakce</TabsTrigger>
            <TabsTrigger value="add_balance">Přidat prostředky</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="pt-6">
            <TransactionList />
          </TabsContent>
          <TabsContent value="add_balance" className="pt-6">
            <AddBalanceForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
