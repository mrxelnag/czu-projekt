import * as z from "zod";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Link } from "@tanstack/react-router";
import { FieldGroup } from "@/components/ui/field.tsx";
import { useAppForm } from "@/components/form/use-forms.tsx";
import { Header2 } from "@/components/typography/header2.tsx";
import { CheckCircle } from "lucide-react";
import { passwordSchema } from "@/lib/validations.ts";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { register as registerUser } from "@/lib/authentication.ts";
import type React from "react";

const formSchema = z
  .object({
    email: z.string().email({
      message: "Zadejte prosím platnou e-mailovou adresu.",
    }),
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Hesla se neshodují",
    path: ["passwordConfirm"],
  });

type FormValues = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const {
    mutate: registerMutation,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: FormValues) => {
      await registerUser({
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: () => {
      toast.success("Registrace úspěšná!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Registrace selhala");
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      registerMutation(value);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="w-full overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex flex-col gap-4">
                <Header2>Registrace byla úspěšná</Header2>
                <p className="text-muted-foreground text-balance">
                  Nyní už jen stačí potvrdit registraci kliknutím na odkaz v
                  emailu, který byl odeslán na Vaši emailovou adresu:{" "}
                  <span className="text-foreground font-medium">
                    {form.state.values.email}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="p-6 md:p-8"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Vytvořit účet</h1>
                    <p className="text-muted-foreground text-balance">
                      Zaregistrujte se pro svůj účet
                    </p>
                  </div>
                  <FieldGroup>
                    <form.AppField name="email">
                      {(field) => (
                        <field.Input
                          label="E-mail"
                          type="email"
                          placeholder="jan@priklad.cz"
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="password">
                      {(field) => <field.Input label="Heslo" type="password" />}
                    </form.AppField>
                    <form.AppField name="passwordConfirm">
                      {(field) => (
                        <field.Input label="Potvrďte heslo" type="password" />
                      )}
                    </form.AppField>
                  </FieldGroup>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Registrace..." : "Registrovat"}
                  </Button>
                  <div className="text-center text-sm">
                    Už máte účet?{" "}
                    <Link
                      to={"/login"}
                      className="underline underline-offset-4"
                    >
                      Přihlašte se
                    </Link>
                  </div>
                </div>
              </form>
            </>
          )}
          <div className="bg-background relative hidden md:block">
            <img
              src="/logo.svg"
              alt="Image"
              className="object-fit absolute inset-0 h-full w-full rounded-r-2xl p-8 dark:brightness-[0.2] dark:grayscale"
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
