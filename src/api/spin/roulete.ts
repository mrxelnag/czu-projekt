import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SB } from "@/lib/authentication.ts";
import { queryClient } from "@/lib/query-client";
import { QK } from "@/types/enums.ts";

// --- Typy pro Ruletu ---

interface RouletteBet {
  type: "number" | "color" | "parity";
  target: string;
  amount: number;
}

// Co posíláme do Edge Funkce
interface RouletteSpinRequest {
  bets: RouletteBet[];
}

// Co očekáváme zpět z Edge Funkce
interface RouletteSpinResponse {
  winningNumber: number;
  netResult: number;
  totalWinnings: number;
  newRound: any; // Můžete upřesnit typ
}

/**
 * Hook pro zavolání Edge Funkce na roztočení rulety.
 */
export const useSpinRoulette = () => {
  return useMutation({
    mutationFn: async ({
      bets,
    }: RouletteSpinRequest): Promise<RouletteSpinResponse> => {
      const { data, error } = await SB.functions.invoke<RouletteSpinResponse>(
        "spin-roulette",
        {
          body: { bets },
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

      // Nyní TypeScript ví, že 'data' je typu RouletteSpinResponse
      return data;
    },

    onSuccess: async (data) => {
      // 1. Invalidujeme dotaz na uživatele (QK.USER) pro nový zůstatek
      await queryClient.invalidateQueries({ queryKey: [QK.USER] });

      // 2. Zobrazíme toast
      toast.success(`Padlo číslo: ${data.winningNumber}!`, {
        description:
          data.netResult > 0
            ? `Vyhráli jste ${data.totalWinnings} Kč.`
            : `Bohužel, žádná výhra.`,
      });
    },

    onError: (error: Error) => {
      console.error("Roulette spin error:", error);
      toast.error("Sázka selhala", {
        description: error.message, // např. "Nedostatek prostředků"
      });
    },
  });
};
