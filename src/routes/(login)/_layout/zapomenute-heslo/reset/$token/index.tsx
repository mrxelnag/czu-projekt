// import type React from "react";
//
// import { cn } from "@/lib/utils.ts";
// import { Button } from "@/components/ui/button.tsx";
// import { Card, CardContent } from "@/components/ui/card.tsx";
// import * as z from "zod";
// import { Link, useNavigate } from "@tanstack/react-router";
// import { FieldGroup } from "@/components/ui/field.tsx";
// import { useAppForm } from "@/components/form/use-forms.tsx";
// import { createFileRoute } from "@tanstack/react-router";
// import { pa } from "@/api/auth.ts";
// import { passwordSchema } from "@/lib/validations.ts";
//
// export const Route = createFileRoute(
//   "/(login)/_layout/zapomenute-heslo/reset/$token/",
// )({
//   component: RouteComponent,
// });
//
// const formSchema = z
//   .object({
//     password: passwordSchema,
//     confirmPassword: passwordSchema,
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Hesla se neshodují.",
//     path: ["confirmPassword"],
//   });
//
// function PasswordResetForm({
//   className,
//   token,
//   ...props
// }: React.ComponentProps<"div"> & { token: string }) {
//   const navigate = useNavigate();
//
//   const { mutate: resetPassword } = useResetPassword();
//
//   const form = useAppForm({
//     defaultValues: {
//       password: "",
//       confirmPassword: "",
//     },
//     validators: {
//       onSubmit: formSchema,
//     },
//     onSubmit: async ({ value }) => {
//       resetPassword({
//         token,
//         password: value.password,
//         confirmPassword: value.confirmPassword,
//       });
//     },
//   });
//
//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card className="overflow-hidden">
//         <CardContent className="grid p-0 md:grid-cols-2">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               form.handleSubmit();
//             }}
//             className="p-6 md:p-8"
//           >
//             <div className="flex flex-col gap-6">
//               <div className="flex flex-col items-center text-center">
//                 <h1 className="text-2xl font-bold">Obnovení hesla</h1>
//                 <p className="text-muted-foreground text-balance">
//                   Zadejte nové heslo pro váš účet
//                 </p>
//               </div>
//               <FieldGroup>
//                 <form.AppField name="password">
//                   {(field) => (
//                     <field.Input label="Nové heslo" type="password" />
//                   )}
//                 </form.AppField>
//                 <form.AppField name="confirmPassword">
//                   {(field) => (
//                     <field.Input label="Potvrzení hesla" type="password" />
//                   )}
//                 </form.AppField>
//               </FieldGroup>
//
//               <Button type="submit" className="w-full">
//                 Obnovit heslo
//               </Button>
//
//               <div className="text-center text-sm">
//                 Vzpomněli jste si na heslo?{" "}
//                 <Link to={"/login"} className="underline underline-offset-4">
//                   Přihlásit se
//                 </Link>
//               </div>
//             </div>
//           </form>
//           <div className="bg-muted relative hidden md:block">
//             <img
//               src="/placeholder.png"
//               alt="Image"
//               className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
//             />
//           </div>
//         </CardContent>
//       </Card>
//       <div className="text-muted-foreground hover:[&_a]:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
//         Kliknutím na pokračovat souhlasíte s našimi{" "}
//         <a target="_blank" href={"/obchodni-podminky"}>
//           Obchodními podmínkami
//         </a>{" "}
//         a{" "}
//         <a target="_blank" href={"/ochrana-osobnich-udaju"}>
//           Zásadami ochrany osobních údajů
//         </a>{" "}
//       </div>
//     </div>
//   );
// }
//
// function RouteComponent() {
//   const { token } = Route.useParams();
//
//   return <PasswordResetForm token={token} />;
// }
