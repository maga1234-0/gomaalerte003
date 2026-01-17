"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth as useFirebaseAuth } from "@/firebase";
import { initiateEmailSignUp } from "@/firebase/non-blocking-login";
import React from "react";

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
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const auth = useFirebaseAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignupFormValues) {
    startTransition(() => {
      initiateEmailSignUp(auth, data.email, data.password)
        .then(() => {
          toast({
            title: "Account Created",
            description: "You will be redirected shortly.",
          });
          router.push("/");
        })
        .catch((error) => {
          let description = "An unexpected error occurred. Please try again.";
          if (error.code === 'auth/email-already-in-use') {
            description = "This email is already registered. Please log in.";
          } else if (error.code === 'auth/weak-password') {
            description = "The password is too weak. Please use at least 6 characters.";
          } else if (error.code === 'auth/invalid-email') {
            description = "Please enter a valid email address.";
          }
          toast({
            variant: "destructive",
            title: "Sign Up Failed",
            description: description,
          });
        });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@gomaalert.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
