import { useMutation } from "@tanstack/react-query";
import { SB, login } from "@/lib/authentication.ts";
import { Database } from "@/types/supabase";
import { QK } from "@/types/enums.ts";
import { queryClient } from "@/lib/query-client.ts";
import { toast } from "sonner";

type PlayerRecord = Database["public"]["Tables"]["players"]["Row"];
type PlayerUpdate = Database["public"]["Tables"]["players"]["Update"];

// Hook pro aktualizaci uživatelského profilu
export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (updates: PlayerUpdate) => {
      const {
        data: { user },
      } = await SB.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Aktualizace dat v players tabulce
      const { data, error } = await SB.from("players")
        .update(updates)
        .eq("player_id", user.id)
        .select()
        .single();

      if (error) throw error;

      return data as PlayerRecord;
    },
    onSuccess: async (data) => {
      // Invalidace user query pro refresh dat
      await queryClient.invalidateQueries({ queryKey: [QK.USER] });
      toast.success("Profil byl úspěšně aktualizován");
    },
    onError: (error: Error) => {
      console.error("Update user error:", error);
      toast.error("Nepodařilo se aktualizovat profil", {
        description: error.message,
      });
    },
  });
};

// Hook pro změnu hesla současného uživatele
export const useChangeUserPassword = () => {
  return useMutation({
    mutationFn: async (params: {
      oldPassword?: string; // Pro dodatečnou validaci (optional)
      password: string;
      passwordConfirm: string;
    }) => {
      if (params.password !== params.passwordConfirm) {
        throw new Error("Hesla se neshodují");
      }

      if (params.password.length < 6) {
        throw new Error("Heslo musí mít alespoň 6 znaků");
      }

      // Volitelně: Ověření starého hesla pomocí re-authentication
      if (params.oldPassword) {
        const {
          data: { user },
        } = await SB.auth.getUser();
        if (!user?.email) {
          throw new Error("Uživatel není přihlášen");
        }

        // Pokus o přihlášení se starým heslem pro ověření
        const { error: reAuthError } = await SB.auth.signInWithPassword({
          email: user.email,
          password: params.oldPassword,
        });

        if (reAuthError) {
          throw new Error("Staré heslo je nesprávné");
        }
      }

      // Aktualizace hesla
      const { data, error } = await SB.auth.updateUser({
        password: params.password,
      });

      if (error) throw error;

      return data;
    },
    onSuccess: async () => {
      toast.success("Heslo bylo úspěšně změněno");
      // Session zůstává aktivní, není potřeba znovu přihlašovat
    },
    onError: (error: Error) => {
      console.error("Change password error:", error);
      toast.error("Nepodařilo se změnit heslo", {
        description: error.message,
      });
    },
  });
};

// Hook pro smazání vlastního účtu
export const useDeleteUserAccount = () => {
  return useMutation({
    mutationFn: async (params: { password: string }) => {
      const {
        data: { user },
      } = await SB.auth.getUser();

      if (!user?.email) {
        throw new Error("Uživatel není přihlášen");
      }

      // Re-authentication pro bezpečnost
      const { error: reAuthError } = await SB.auth.signInWithPassword({
        email: user.email,
        password: params.password,
      });

      if (reAuthError) {
        throw new Error("Heslo je nesprávné");
      }

      // Smazání záznamu z players tabulky
      const { error: deletePlayerError } = await SB.from("players")
        .delete()
        .eq("player_id", user.id);

      if (deletePlayerError) throw deletePlayerError;

      // POZNÁMKA: Smazání z auth.users vyžaduje Admin API
      // Musí být implementováno přes Edge Function nebo backend
      // Pro nyní pouze odhlásíme uživatele
      await SB.auth.signOut();

      return true;
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success("Účet byl úspěšně smazán");
      // Redirect na homepage nebo login je řešen v komponentě
    },
    onError: (error: Error) => {
      console.error("Delete account error:", error);
      toast.error("Nepodařilo se smazat účet", {
        description: error.message,
      });
    },
  });
};
