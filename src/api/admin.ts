import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Database } from "@/types/supabase.ts";
import { QK } from "@/types/enums.ts";
import { SB } from "@/lib/authentication.ts";
import { queryClient } from "@/lib/query-client.ts";
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

/**
 * Typ pro data z formuláře "Přidat prostředky"
 */
type AddBalancePayload = {
  email: string;
  amount: number;
};

/**
 * Načte VŠECHNY transakce (pouze pro admina).
 * Pokud uživatel není admin, RLS vrátí prázdné pole (nebo jen jeho).
 */
export const useGetAllTransactions = () => {
  return useQuery({
    queryKey: [QK.ADMIN_TRANSACTIONS],
    queryFn: async () => {
      const { data, error } = await SB.from("transactions")
        .select("*") // Příklad JOINu pro email
        .order("transaction_time", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

/**
 * Zavolá RPC funkci v Supabase pro přidání prostředků uživateli.
 */
export const useAddBalanceByEmail = () => {
  return useMutation({
    mutationFn: async ({ email, amount }: AddBalancePayload) => {
      const { data, error } = await SB.rpc("add_balance_by_email", {
        user_email: email,
        deposit_amount: amount,
      });

      if (error) {
        // RPC vrací chybu v 'error.message'
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: async () => {
      toast.success("Prostředky byly úspěšně přidány.");
      // Invalidace dotazů pro refresh dat
      await queryClient.invalidateQueries({
        queryKey: [QK.ADMIN_TRANSACTIONS],
      });
      // Také invalidujeme uživatele, pokud by to byl on sám
      await queryClient.invalidateQueries({ queryKey: [QK.USER] });
    },
    onError: (error: Error) => {
      console.error("Add balance error:", error);
      toast.error("Nepodařilo se přidat prostředky", {
        description: error.message,
      });
    },
  });
};
