import { useAppForm } from "@/components/form/use-forms.tsx";
import { FieldGroup } from "@/components/ui/field.tsx";
import { Button } from "@/components/ui/button.tsx";
import type React from "react";
import { useCreateTransaction } from "@/api/transactions.ts";
import { z } from "zod";

const withdrawalSchema = z.object({
  amount: z.coerce.number().positive("Částka musí být kladná."),
  walletAddress: z
    .string()
    .min(3, "Adresa peněženky je příliš krátká.")
    .max(99, "Adresa peněženky je příliš dlouhá."),
});

export default function WithdrawalForm() {
  const { mutate: createTransaction, isPending } = useCreateTransaction();

  const form = useAppForm({
    defaultValues: {
      amount: 100,
      walletAddress: "",
    },
    validators: {
      onSubmit: withdrawalSchema,
    },
    onSubmit: async ({ value }) => {
      createTransaction({
        type: "withdrawal",
        amount: value.amount,
      });
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <form.AppField name="amount">
          {(field) => (
            <field.Input
              label="Částka (sat)"
              type="number"
              min="0.0001"
              step="0.0001"
            />
          )}
        </form.AppField>
        <form.AppField name="walletAddress">
          {(field) => (
            <field.Input
              label="Adresa BTC peněženky"
              type="text"
              placeholder="bc1..."
            />
          )}
        </form.AppField>
      </FieldGroup>
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
        aria-label="vybrat"
      >
        {isPending ? "Zpracovávám..." : "Vybrat na peněženku"}
      </Button>
    </form>
  );
}
