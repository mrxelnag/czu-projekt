import { useMutation } from "@tanstack/react-query";
import { SB, useAuth } from "@/lib/authentication.ts";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client.ts";
import { QK } from "@/types/enums.ts";
import { Database } from "@/types/supabase.ts";

type TransactionInsert = Omit<
  Database["public"]["Tables"]["transactions"]["Insert"],
  "player_id"
>;

export const useCreateTransaction = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (transactionData: TransactionInsert) => {
      const { data, error } = await SB.from("transactions")
        .insert({
          ...transactionData,
          player_id: user?.player_id!,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: async () => {
      toast.success("Požadavek na transakci byl úspěšně odeslán.");

      await queryClient.invalidateQueries({ queryKey: [QK.USER] });
      await queryClient.invalidateQueries({ queryKey: [QK.TRANSACTIONS] });
    },
    onError: (error: Error) => {
      console.error("Create transaction error:", error);
      toast.error("Nepodařilo se vytvořit transakci", {
        description: error.message,
      });
    },
  });
};
