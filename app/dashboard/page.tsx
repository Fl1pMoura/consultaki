import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/auth");
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <p> Bem-vindo, {session?.user?.name}!</p>
    </div>
  );
};

export default DashboardPage;
