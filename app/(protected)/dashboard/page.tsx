import { PlusIcon } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getClinics } from "@/app/_data/clinics/get-clinics";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

import {
  PageContainer,
  PageContent,
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageTitle,
} from "../_components/pageContainer";

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
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageHeaderDescription>
            Acesse um resumo das métricas e dados dos pacientes.
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button>
            <PlusIcon />
            Adicionar Médico
          </Button>
        </PageHeaderActions>
      </PageHeader>
      <PageContent>
        <div className="h-full w-full bg-slate-100">teste</div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
