import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  PageContainer,
  PageContent,
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageTitle,
} from "../_components/pageContainer";

const AppointmentsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageHeaderDescription>
            Acesse um resumo das métricas e dados dos agendamentos.
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button>
            <PlusIcon />
            Agendar consulta
          </Button>
        </PageHeaderActions>
      </PageHeader>
      <PageContent>
        <div className="h-full w-full bg-slate-100">teste</div>
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentsPage;
