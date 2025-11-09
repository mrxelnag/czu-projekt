import type React from "react";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import * as z from "zod";
import { useLogin } from "@/api/auth.ts";
import { Link } from "@tanstack/react-router";
import { FieldGroup } from "@/components/ui/field.tsx";
import { useAppForm } from "@/components/form/use-forms.tsx";

const formSchema = z.object({
  email: z.string().email("Prosím, zadejte platnou e-mailovou adresu."),
  password: z.string().min(6, "Heslo musí mít alespoň 6 znaků."),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate: loginMutation, isPending } = useLogin();

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      loginMutation(value);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="p-6 md:p-8"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Vítejte zpět</h1>
                <p className="text-muted-foreground text-balance">
                  Jsme rádi, že vás znovu vidíme!
                </p>
              </div>
              <FieldGroup>
                <form.AppField name="email">
                  {(field) => (
                    <field.Input
                      label="E-mail"
                      type="email"
                      placeholder="vas@email.cz"
                      autoComplete="email"
                    />
                  )}
                </form.AppField>
                <form.AppField name="password">
                  {(field) => (
                    <field.Input
                      label="Heslo"
                      type="password"
                      autoComplete="current-password"
                    />
                  )}
                </form.AppField>

                <Link
                  to={"/zapomenute-heslo"}
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Zapomenuté heslo?
                </Link>
              </FieldGroup>

              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
                aria-label="přihlásit"
              >
                {isPending ? "Přihlašování..." : "Přihlásit se"}
              </Button>

              <div className="text-center text-sm">
                Ještě nemáte účet?{" "}
                <Link
                  to={"/registrace"}
                  className="underline underline-offset-4"
                >
                  Zaregistrujte se zde!
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden rounded-r-2xl md:block">
            <img
              src="/logo.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full rounded-r-2xl object-cover p-8"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground hover:[&_a]:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        Kliknutím na pokračovat souhlasíte s našimi{" "}
        <a target="_blank" href={"/obchodni-podminky"}>
          Obchodními podmínkami
        </a>{" "}
        a{" "}
        <a target="_blank" href={"/ochrana-osobnich-udaju"}>
          Zásadami ochrany osobních údajů
        </a>{" "}
      </div>
    </div>
  );
}
