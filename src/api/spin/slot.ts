import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SB } from "@/lib/authentication.ts";
import { queryClient } from "@/lib/query-client";
import { QK } from "@/types/enums.ts";

// --- Typy pro Automat ---

// Co posíláme do Edge Funkce
export interface SlotSpinRequest {
  betAmount: number;
}

// Co očekáváme zpět z Edge Funkce
export interface SlotSpinResponse {
  grid: string[][];
  netResult: number;
  totalWinnings: number;
  newRound: any; // Můžete upřesnit typ podle vaší DB
}

/**
 * Hook pro zavolání Edge Funkce na roztočení automatu.
 */
export const useSpinSlotMachine = () => {
  return useMutation({
    // Návratový typ Promise<SlotSpinResponse> je správný
    mutationFn: async ({
      betAmount,
    }: SlotSpinRequest): Promise<SlotSpinResponse> => {
      const { data, error } = await SB.functions.invoke<SlotSpinResponse>(
        "spin-slot",
        {
          body: { betAmount },
        },
      );

      // 1. Zkontrolujeme chybu funkce
      if (error) {
        throw new Error(error.message);
      }

      // 2. OŠETŘENÍ CHYBY TYPU (OPRAVA)
      // Zkontrolujeme, zda data skutečně dorazila
      if (!data) {
        throw new Error("Funkce nevrátila žádná data, ale ani chybu.");
      }

      // Nyní TypeScript ví, že 'data' je typu SlotSpinResponse
      return data;
    },

    onSuccess: async (data) => {
      // 1. Invalidujeme dotaz na uživatele (QK.USER), aby se načetl nový zůstatek
      await queryClient.invalidateQueries({ queryKey: [QK.USER] });

      // 2. Zobrazíme toast podle výsledku
      // if (data.netResult > 0) {
      //   toast.success(`Výhra!`, {
      //     description: `Vyhráli jste ${data.totalWinnings} Kč.`,
      //   });
      // } else {
      //   toast.info(`Kolo dokončeno`, {
      //     description: `Nevyhráli jste. Zkuste to znovu!`,
      //   });
      // }
    },

    onError: (error: Error) => {
      console.error("Slot machine spin error:", error);
      // Zobrazíme specifickou chybu vrácenou z funkce
      // (např. "Insufficient funds" nebo "Nedostatek prostředků")
      toast.error("Roztočení selhalo", {
        description: error.message,
      });
    },
  });
};
