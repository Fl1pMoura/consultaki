import { getPatients } from "@/app/_data/patients/get-patients";
import { requireAuth } from "@/app/_helpers/require-auth";
import { requireClinic } from "@/app/_helpers/require-clinic";
import { DataTable } from "@/components/ui/data-table";

import {
  PageContainer,
  PageContent,
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageTitle,
} from "../_components/pageContainer";
import AddPatientButton from "./_components/addPatientButton";
import { columns } from "./_components/table-columns";

const PatientsPage = async () => {
  const session = await requireAuth();
  await requireClinic(session.user.id);
  const patients = await getPatients();
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageHeaderDescription>
            Gerencie seus pacientes aqui.
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <AddPatientButton />
        </PageHeaderActions>
      </PageHeader>
      <PageContent>
        <DataTable columns={columns} data={patients} />
      </PageContent>
    </PageContainer>
  );
};

export default PatientsPage;
