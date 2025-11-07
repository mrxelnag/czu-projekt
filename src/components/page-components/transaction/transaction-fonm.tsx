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
import DepositForm from "@/components/page-components/transaction/deposit-form.tsx";
import WithdrawalForm from "@/components/page-components/transaction/withdrawal-form.tsx";

export default function Transaction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("w-full max-w-md", className)} {...props}>
      <CardHeader>
        <CardTitle>Transakce</CardTitle>
        <CardDescription>
          Proveďte vklad nebo výběr ze svého účtu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Vklad</TabsTrigger>
            <TabsTrigger value="withdrawal">Výběr</TabsTrigger>
          </TabsList>
          <TabsContent value="deposit" className="pt-6">
            <DepositForm />
          </TabsContent>
          <TabsContent value="withdrawal" className="pt-6">
            <WithdrawalForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
