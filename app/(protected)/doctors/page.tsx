import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import {
  PageContainer,
  PageContent,
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageTitle,
} from "../_components/pageContainer";
import DoctorsForm from "./_components/doctorsForm";

const DoctorsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageHeaderDescription>
            Gerencie seus médicos aqui.
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon />
                Adicionar Médico
              </Button>
            </DialogTrigger>
            <DoctorsForm />
          </Dialog>
        </PageHeaderActions>
      </PageHeader>
      <PageContent>
        <div className="h-full w-full bg-slate-100">teste</div>
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
