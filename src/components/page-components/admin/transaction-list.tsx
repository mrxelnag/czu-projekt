import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllTransactions } from "@/api/admin.ts";

export default function TransactionList() {
  const { data: transactions, isLoading } = useGetAllTransactions();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <p className="text-muted-foreground">Nebyly nalezeny žádné transakce.</p>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Historie transakcí</CardTitle>
        <CardDescription>Přehled všech transakcí v systému.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Částka</TableHead>
                <TableHead>Datum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx: any) => (
                <TableRow key={tx.transaction_id}>
                  <TableCell>
                    <div className="text-muted-foreground text-sm">
                      {tx.players?.email || tx.player_id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.type === "DEPOSIT"
                          ? "default"
                          : tx.type === "WITHDRAWAL"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>
                    {new Date(tx.transaction_time).toLocaleString("cs-CZ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
