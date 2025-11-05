import { useMutation } from "@tanstack/react-query";
import { useAuth, RegisterData } from "@/lib/authentication.ts";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";

// Registrace
export const useRegister = () => {
  const { register } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: () => {
      // Success toast je již v register funkci
    },
    onError: (error: AuthError | Error) => {
      let message = "Něco se nepovedlo, zkuste to prosím znovu.";

      if (error instanceof Error) {
        // Supabase specifické chyby
        if (error.message.includes("already registered")) {
          message = "Tento e-mail je již používán.";
        } else if (error.message.includes("invalid email")) {
          message = "Neplatná e-mailová adresa.";
        } else if (error.message.includes("password")) {
          message = "Heslo nesplňuje požadavky (min. 6 znaků).";
        }
      }

      toast.error("Při registraci se vyskytla chyba", {
        description: message,
      });
    },
  });
};

// Login
export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      login(data.email, data.password),
    onSuccess: () => {
      toast.success("Přihlášení bylo úspěšné");
      navigate({ to: "/" });
    },
    onError: (error: AuthError | Error) => {
      let message = "Něco se nepovedlo, zkuste to prosím znovu.";

      if (error instanceof Error) {
        // Supabase specifické chyby
        if (error.message.includes("Invalid login credentials")) {
          message =
            "Špatné přihlašovací údaje. Zkontrolujte prosím e-mail a heslo.";
        } else if (error.message.includes("Email not confirmed")) {
          message =
            "Váš e-mail není ověřený. Zkontrolujte schránku a ověřte svůj účet.";
        } else if (error.message.includes("not authorized")) {
          message = "Přihlášení není povoleno. Kontaktujte podporu.";
        }
      }

      toast.error("Při přihlášení se vyskytla chyba", {
        description: message,
      });
    },
  });
};

// Reset hesla - Žádost o reset
export const useForgotPassword = () => {
  const { forgotPassword } = useAuth();

  return useMutation({
    mutationFn: (data: { email: string }) => forgotPassword(data.email),
    onSuccess: () => {
      // Success toast je již ve forgotPassword funkci
    },
    onError: (error: AuthError | Error) => {
      let message =
        "Něco se nepovedlo, zkuste to prosím znovu nebo kontaktujte podporu.";

      if (error instanceof Error && error.message.includes("rate limit")) {
        message = "Příliš mnoho pokusů. Zkuste to prosím později.";
      }

      toast.error("Při obnově hesla se vyskytla chyba", {
        description: message,
      });
    },
  });
};

// Reset hesla - Potvrzení s novým heslem
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { password: string; confirmPassword: string }) => {
      if (data.password !== data.confirmPassword) {
        throw new Error("Hesla se neshodují");
      }

      // Supabase updateUser pro změnu hesla (po kliknutí na reset link)
      const { SB } = await import("@/lib/authentication.ts");
      const { error } = await SB.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      router.navigate({ to: "/login" });
      toast.success("Heslo bylo úspěšně obnoveno", {
        description: "Můžete se přihlásit s novým heslem.",
      });
    },
    onError: (error: Error) => {
      let message = "Zkuste to prosím znovu nebo kontaktujte podporu.";

      if (error.message === "Hesla se neshodují") {
        message = "Zadaná hesla se neshodují.";
      } else if (error.message.includes("same as the old password")) {
        message = "Nové heslo musí být jiné než staré heslo.";
      }

      toast.error("Při obnově hesla se vyskytla chyba", {
        description: message,
      });
    },
  });
};

// Odhlášení
export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return async () => {
    await logout();
    navigate({ to: "/login" });
    toast.success("Odhlášení bylo úspěšné", {
      description: "Byli jste úspěšně odhlášeni.",
    });
  };
};
