import React from "react";
import * as z from "zod";
import { useAppForm } from "@/components/form/use-forms";
import { useAddBalanceByEmail } from "@/api/admin.ts";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

// --- Schema and Type ---

export const addBalanceSchema = z.object({
  email: z.string().email("Prosím, zadejte platnou e-mailovou adresu."),
  amount: z.coerce
    .number()
    .positive("Částka musí být kladná.")
    .min(1, "Minimální vklad je 1 Kč."),
  notes: z.string().optional(),
});

export type AddBalanceFormValues = z.infer<typeof addBalanceSchema>;

// --- Component ---

export default function AddBalanceForm() {
  const { mutate: addBalance, isPending } = useAddBalanceByEmail();

  const form = useAppForm({
    defaultValues: {
      email: "",
      amount: 100,
    },
    validators: {
      onSubmit: addBalanceSchema,
    },
    onSubmit: async ({ value }) => {
      addBalance(value);
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="mx-auto flex max-w-md flex-col gap-6"
    >
      <FieldGroup>
        <form.AppField name="email">
          {(field) => (
            <field.Input
              label="E-mail uživatele"
              type="email"
              placeholder="uzivatel@email.cz"
            />
          )}
        </form.AppField>
        <form.AppField name="amount">
          {(field) => (
            <field.Input label="Částka (sats)" type="number" min="1" />
          )}
        </form.AppField>
      </FieldGroup>
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
        aria-label="přidat"
      >
        {isPending ? "Přidávám..." : "Přidat prostředky"}
      </Button>
    </form>
  );
}
