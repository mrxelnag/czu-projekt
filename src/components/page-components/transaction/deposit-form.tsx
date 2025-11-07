import { useAppForm } from "@/components/form/use-forms.tsx";
import { FieldGroup } from "@/components/ui/field.tsx";
import { Button } from "@/components/ui/button.tsx";
import type React from "react";
import { useCreateTransaction } from "@/api/transactions.ts";
import { z } from "zod";

const depositSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Částka musí být kladná.")
    .min(100, "Minimální vklad je 100 BTC."),
  cardName: z.string().min(3, "Jméno je příliš krátké."),
  cardNumber: z.string().length(16, "Číslo karty musí mít 16 číslic."),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Platnost musí být ve formátu MM/RR."),
  cardCVC: z.string().min(3, "CVC musí mít 3-4 číslice.").max(4),
});

export default function DepositForm() {
  const { mutate: createTransaction, isPending } = useCreateTransaction();

  const form = useAppForm({
    defaultValues: {
      amount: 100,
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVC: "",
    },
    validators: {
      onSubmit: depositSchema,
    },
    onSubmit: async ({ value }) => {
      createTransaction({
        type: "deposit",
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
              min="100"
              step={1}
            />
          )}
        </form.AppField>
        <form.AppField name="cardName">
          {(field) => <field.Input label="Jméno na kartě" type="text" />}
        </form.AppField>
        <form.AppField name="cardNumber">
          {(field) => (
            <field.Input
              label="Číslo karty"
              type="text"
              placeholder="0000 0000 0000 0000"
              maxLength={16}
            />
          )}
        </form.AppField>
        <div className="flex gap-4">
          <form.AppField name="cardExpiry">
            {(field) => (
              <field.Input
                label="Platnost"
                type="text"
                placeholder="MM/RR"
                maxLength={5}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  let value = e.target.value;
                  const digits = value.replace(/\D/g, ""); // Odstraní vše kromě číslic

                  if (digits.length === 4) {
                    // Formát "1225" -> "12/25"
                    value = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
                  } else if (digits.length === 3) {
                    // Formát "125" -> "01/25"
                    value = `0${digits.slice(0, 1)}/${digits.slice(1, 3)}`;
                  }

                  field.setValue(value);
                }}
              />
            )}
          </form.AppField>
          <form.AppField name="cardCVC">
            {(field) => (
              <field.Input
                label="CVC"
                type="text"
                placeholder="123"
                maxLength={4}
              />
            )}
          </form.AppField>
        </div>
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Zpracovávám..." : "Vložit částku"}
      </Button>
    </form>
  );
}
