import { getAppointments } from "@/app/_data/appointments";
import { getDoctors } from "@/app/_data/doctors/get-doctors";
import { getPatients } from "@/app/_data/patients/get-patients";
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
import AddAppointmentButton from "./_components/addAppointmentButton";
import { columns } from "./_components/table-columns";

const AppointmentsPage = async () => {
  const appointments = await getAppointments();
  // console.log(appointments);
  const patients = await getPatients();
  const doctors = await getDoctors();
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
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageHeaderActions>
      </PageHeader>
      <PageContent>
        <DataTable columns={columns} data={appointments} />
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentsPage;
