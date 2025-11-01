import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";

const AuthPage = () => {
  return (
    <section className="flex h-screen w-screen items-center justify-center">
      <Tabs defaultValue="login" className="w-full max-w-lg">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Criar Conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AuthPage;
