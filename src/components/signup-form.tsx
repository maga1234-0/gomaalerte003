"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth as useFirebaseAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { initiateEmailSignUp } from "@/firebase/non-blocking-login";
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { doc, serverTimestamp } from "firebase/firestore";

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

const signupFormSchema = z.object({
  email: z.string().email("Veuillez entrer un e-mail valide."),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = React.useState(false);
  const auth = useFirebaseAuth();
  const firestore = useFirestore();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignupFormValues) {
    if (!firestore) return;
    setIsPending(true);

    try {
      const userCredential = await initiateEmailSignUp(auth, data.email, data.password);
      if (userCredential.user) {
        const userRef = doc(firestore, 'users', userCredential.user.uid);
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          createdAt: serverTimestamp(),
        };
        setDocumentNonBlocking(userRef, userData, {});
      }
      toast({
        title: "Compte créé",
        description: "Bienvenue ! Votre inscription a été réussie.",
      });
      router.push("/");
    } catch (error: any) {
        let description = "Une erreur inattendue est survenue. Veuillez réessayer.";
        if (error.code === 'auth/email-already-in-use') {
          description = "Cette adresse e-mail est déjà utilisée. Veuillez vous connecter ou utiliser un autre e-mail.";
        } else if (error.code === 'auth/weak-password') {
          description = "Le mot de passe est trop faible. Veuillez utiliser au moins 6 caractères.";
        } else if (error.code === 'auth/invalid-email') {
          description = "L'adresse e-mail n'est pas valide. Veuillez vérifier et réessayer.";
        }
        toast({
          variant: "destructive",
          title: "Échec de l'inscription",
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
          {isPending ? "Création du compte en cours..." : "S'inscrire"}
        </Button>
      </form>
    </Form>
  );
}
