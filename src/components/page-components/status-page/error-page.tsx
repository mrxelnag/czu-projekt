import { ErrorComponentProps, useNavigate } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function ErrorPage({ error }: ErrorComponentProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-background flex h-full w-full items-center justify-center p-4">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="bg-destructive/10 text-destructive mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Něco se pokazilo</CardTitle>
            <CardDescription>
              Došlo k neočekávané chybě. Můžete to zkusit znovu.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {error?.message && (
              <p className="text-muted-foreground text-center text-sm break-words">
                {error.message}
              </p>
            )}
            <a href="/" className="w-full">
              Zpět na hlavní stránku
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
