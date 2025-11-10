"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Activity } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-clients";

const magicLinkSchema = z.object({
  email: z.email({ message: "Email inválido" }),
});

const MagicLinkForm = () => {
  const form = useForm<z.infer<typeof magicLinkSchema>>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: z.infer<typeof magicLinkSchema>) {
    const { data, error } = await authClient.signIn.magicLink({
      email: values.email,
      callbackURL: "/dashboard",
      newUserCallbackURL: "/dashboard",
      errorCallbackURL: "/auth?error=true",
    });
    if (error) {
      toast.error(error.message);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Faça login em sua conta aqui. Clique em Entrar quando estiver pronto.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="w-full cursor-pointer"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              <Activity
                mode={form.formState.isSubmitting ? "visible" : "hidden"}
              >
                <Loader2 className="h-5 w-5 animate-spin" />
              </Activity>
              {!form.formState.isSubmitting && "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default MagicLinkForm;
