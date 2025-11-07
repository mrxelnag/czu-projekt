import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as z from "zod";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/form/use-forms";
import { AuthUser } from "@/lib/authentication.ts";
import { useUpdateUser } from "@/api/user.ts";

// 2. Definice schématu a typů pro formulář
const formSchema = z.object({
  username: z
    .string()
    .min(3, "Uživatelské jméno musí mít alespoň 3 znaky.")
    .max(50, "Uživatelské jméno nesmí být delší než 50 znaků."),
});

type Props = {
  user: AuthUser;
};

/**
 * Formulář pro aktualizaci uživatelských dat (např. uživatelského jména).
 * Očekává `user` jako prop.
 */
export function UpdateUserForm({ user, ...props }: Props) {
  // 4. Použití mutačního hooku
  const { mutate: updateUser, isPending } = useUpdateUser();

  // 5. Inicializace formuláře
  const form = useAppForm({
    defaultValues: {
      username: user.username,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // 'value' obsahuje pouze pole definovaná ve formSchema (např. { username: "nové_jméno" })
      // Toto 'value' je kompatibilní s typem PlayerUpdate
      updateUser(value);
    },
  });

  // 6. Struktura komponenty
  return (
    <Card className={cn("w-full")} {...props}>
      <CardHeader>
        <CardTitle>Veřejný profil</CardTitle>
        <CardDescription>
          Zde si můžete změnit své veřejné údaje.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          <FieldGroup>
            <form.AppField name="username">
              {(field) => (
                <field.Input
                  label="Uživatelské jméno"
                  type="text"
                  placeholder="Vaše veřejné jméno"
                />
              )}
            </form.AppField>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full sm:ml-auto sm:w-auto"
            disabled={isPending || !form.state.canSubmit}
          >
            {isPending ? "Ukládání..." : "Uložit změny"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
