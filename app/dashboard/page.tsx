import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { getClinics } from "../_data/clinics/get-clinics";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/auth");
  }
  const clinics = await getClinics(session?.user?.id);
  if (!clinics.length) {
    redirect("/clinics");
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <p> Bem-vindo, {session?.user?.name}!</p>
      <p> Suas clínicas: {clinics.map((clinic) => clinic.name).join(", ")}</p>
    </div>
  );
};

export default DashboardPage;
