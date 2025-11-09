import * as z from "zod";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { useForgotPassword } from "@/api/auth.ts";
import { Link, useRouter } from "@tanstack/react-router";
import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { FieldGroup } from "@/components/ui/field.tsx";
import { useAppForm } from "@/components/form/use-forms.tsx";

const formSchema = z.object({
  email: z.string().email({
    message: "Zadejte prosím platnou e-mailovou adresu.",
  }),
});

export function ForgotPasswordForm() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      forgotPassword(value, {
        onSuccess: () => {},
      });
    },
  });

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {!form.state.isSubmitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="p-6 md:p-8"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Zapomenuté heslo</h1>
                  <p className="text-muted-foreground text-balance">
                    Zadejte svůj e-mail a my vám pošleme odkaz pro obnovení
                    hesla
                  </p>
                </div>
                <FieldGroup>
                  <form.AppField name="email">
                    {(field) => (
                      <field.Input
                        label="E-mail"
                        type="email"
                        placeholder="j@priklad.cz"
                      />
                    )}
                  </form.AppField>
                </FieldGroup>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending}
                  aria-label="pdesůat"
                >
                  {isPending ? "Odesílání..." : "Odeslat odkaz pro obnovení"}
                </Button>
                <div className="text-center text-sm">
                  Vzpomněli jste si na heslo?{" "}
                  <Link to={"/login"} className="underline underline-offset-4">
                    Přihlašte se
                  </Link>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 md:p-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <CheckCircle className="text-primary h-12 w-12" />
                <h1 className="text-2xl font-bold">E-mail odeslán</h1>
                <p className="text-muted-foreground text-balance">
                  Pokud je e-mail {form.state.values.email} registrován v našem
                  systému, poslali jsme vám odkaz pro obnovení hesla.
                  Zkontrolujte prosím svou e-mailovou schránku.
                </p>
                <Link
                  to={"/login"}
                  className="underline underline-offset-4"
                  aria-label="login"
                >
                  <Button
                    className="mt-4 w-full"
                    onClick={() => {
                      form.reset();
                    }}
                  >
                    Zpět na přihlášení
                  </Button>
                </Link>
                <div className="text-center text-sm"></div>
              </div>
            </div>
          )}
          <div className="relative hidden md:block">
            <img
              src="/logo.svg"
              alt="Image"
              className="object-fit absolute inset-0 h-full w-full rounded-r-2xl p-8 dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
