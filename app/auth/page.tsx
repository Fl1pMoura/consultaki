import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";

import LoginForm from "./_components/loginForm";
import MagicLinkForm from "./_components/magicLinkForm";
import RegisterForm from "./_components/registerForm";

const AuthPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <section className="flex h-screen w-screen items-center justify-center">
      <Tabs defaultValue="login" className="w-full max-w-lg">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Criar Conta</TabsTrigger>
          <TabsTrigger value="magicLink">Link de Login</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
        <TabsContent value="magicLink">
          <MagicLinkForm />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AuthPage;
