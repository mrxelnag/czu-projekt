// import { createFileRoute, Link } from "@tanstack/react-router";
// import { Button } from "@/components/ui/button.tsx";
// import { Card, CardContent } from "@/components/ui/card.tsx";
// import { CheckCircle } from "lucide-react";
//
// export const Route = createFileRoute(
//   "/(login)/_layout/registrace/potvrzeni-emailu/$token/",
// )({
//   loader: async ({ context, params }) => {
//     await PB.collection(C.USERS).confirmVerification(params.token);
//   },
//   component: RouteComponent,
// });
//
// function RouteComponent() {
//   return (
//     <div className="flex flex-col gap-6">
//       <Card className="overflow-hidden">
//         <CardContent className="grid p-0 md:grid-cols-2">
//           <div className="p-6 md:p-8">
//             <div className="flex flex-col items-center gap-6 text-center">
//               <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
//                 <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
//               </div>
//
//               <div className="flex flex-col gap-2">
//                 <h1 className="text-2xl font-bold">E-mail potvrzen!</h1>
//                 <p className="text-muted-foreground text-balance">
//                   Váš e-mail byl úspěšně ověřen. Nyní se můžete přihlásit do
//                   svého účtu.
//                 </p>
//               </div>
//
//               <Button asChild className="w-full">
//                 <Link to="/login">Přejít na přihlášení</Link>
//               </Button>
//             </div>
//           </div>
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
