import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client.ts";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { createClient, User } from "@supabase/supabase-js";
import { QK } from "@/types/enums.ts";
import React, { useEffect } from "react";

// --- Typové definice ---

// Získáme typ řádku z vaší tabulky Players pro použití v TypeScriptu
type PlayerRecord = Database["public"]["Tables"]["players"]["Row"];

// Rozšíříme User typ o data z naší tabulky Players, která je propojena 1:1
// Supabase user (z auth) + Player data (z naší DB)
export type AuthUser = PlayerRecord & { auth_user: User };

// Typ pro registrační data
export interface RegisterData {
  email: string;
  password: string;
}

export interface Authentication {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
  googleLogin: () => Promise<void>;
}

// --- Supabase inicializace ---

// Vytvoření Supabase klienta s typovou bezpečností (silně typováno)
export const SB = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

// --- Auth state utilities ---

// Zjištění, zda je uživatel přihlášen
export async function checkUserIsLoggedIn(): Promise<boolean> {
  const {
    data: { user },
  } = await SB.auth.getUser();
  return user !== null;
}

// --- Logout ---

export async function logout(): Promise<void> {
  // Odhlášení ze Supabase
  const { error } = await SB.auth.signOut();
  if (error) console.error("Supabase sign out error:", error);

  // Zrušení lokálních dat a nevalidace dotazů
  queryClient.setQueryData([QK.USER], null);
  await queryClient.invalidateQueries({ queryKey: [QK.USER] });
}

// --- Query options ---

// Pomocná funkce pro načtení kombinovaných dat (Auth User + Player Record)
const fetchAuthUser = async (): Promise<AuthUser | null> => {
  const {
    data: { user },
  } = await SB.auth.getUser();

  if (!user) {
    return null;
  }

  // Načtení dat hráče z naší DB tabulky Players, kde player_id = auth.user.id
  const { data: player, error: dbError } = await SB.from("players")
    .select("*")
    .eq("player_id", user.id)
    .single();

  if (dbError || !player) {
    // Může nastat, pokud se záznam v Players ještě nevytvořil triggerem, nebo chyba
    console.error("Failed to fetch player data:", dbError);
    // Neprovádíme automatický logout zde, může to být timing issue při registraci
    return null;
  }

  // Kombinace Player dat a Auth dat
  return { ...player, auth_user: user } as AuthUser;
};

export const userQueryOptions = queryOptions({
  queryKey: [QK.USER],
  queryFn: fetchAuthUser,
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchInterval: false,
  retry: 1, // Omezení počtu opakování
});

// --- Auth functions ---

export async function login(email: string, password: string): Promise<void> {
  try {
    const {
      data: { user },
      error,
    } = await SB.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Po úspěšném přihlášení vynutíme refresh dotazu
    if (user) {
      await queryClient.invalidateQueries({ queryKey: [QK.USER] });
    }
  } catch (error) {
    await SB.auth.signOut(); // Zajištění, že žádná neúplná session nezůstane
    throw error;
  }
}

export async function register(data: RegisterData): Promise<void> {
  const { error } = await SB.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) throw error;

  // V tomto bodě je odeslán ověřovací e-mail.
  toast.success("Registrace úspěšná! Zkontrolujte email pro ověření.");
}

export async function forgotPassword(email: string): Promise<void> {
  const { error } = await SB.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;

  toast.success("Email pro obnovení hesla byl odeslán.");
}

export async function googleLogin(): Promise<void> {
  const { error } = await SB.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
}

// --- Hook pro získání tokenu ---
async function getAccessToken(): Promise<string | null> {
  const {
    data: { session },
  } = await SB.auth.getSession();
  return session?.access_token ?? null;
}

// --- useAuth hook ---

export const useAuth = (): Authentication => {
  const { data: authUser } = useSuspenseQuery(userQueryOptions);

  // Nastavení auth listener pouze jednou při mount
  useEffect(() => {
    const {
      data: { subscription },
    } = SB.auth.onAuthStateChange((event, session) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        // Vynutíme refresh dotazu k načtení Player dat při změně auth stavu
        queryClient.invalidateQueries({ queryKey: [QK.USER] });
      }
    });

    // Cleanup funkce pro odpojení listeneru
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Získání tokenu synchronně z query cache nebo async
  const [token, setToken] = React.useState<string | null>(null);

  useEffect(() => {
    getAccessToken().then(setToken);
  }, [authUser]);

  return {
    user: authUser ?? null,
    token,
    isAuthenticated: !!authUser,
    login,
    register,
    forgotPassword,
    logout,
    googleLogin,
  };
};
