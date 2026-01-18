"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth as useFirebaseAuth } from "@/firebase";
import { initiateEmailSignIn } from "@/firebase/non-blocking-login";
import React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const loginFormSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse e-mail valide."),
  password: z.string().min(1, "Le mot de passe ne peut pas être vide."),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = React.useState(false);
  const auth = useFirebaseAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsPending(true);
    try {
      await initiateEmailSignIn(auth, data.email, data.password);
      toast({
        title: "Connexion réussie",
        description: "Bon retour ! Vous êtes maintenant connecté.",
      });
      router.push("/");
    } catch (error: any) {
      let description = "Une erreur inattendue est survenue. Veuillez réessayer.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          description = "L'e-mail ou le mot de passe que vous avez entré est incorrect. Veuillez vérifier vos informations et réessayer.";
      }
      toast({
        variant: "destructive",
        title: "Échec de la connexion",
        description: description,
      });
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="animate-in fade-in-0 slide-in-from-top-5 duration-500" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
              <FormLabel>Adresse e-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="nom@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="animate-in fade-in-0 slide-in-from-top-5 duration-500" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
              <FormLabel>Mot de passe</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full animate-in fade-in-0 zoom-in-95 duration-500" disabled={isPending} style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
          {isPending ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>
    </Form>
  );
}
