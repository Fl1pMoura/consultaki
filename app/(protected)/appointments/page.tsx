import { getDoctors } from "@/app/_data/doctors/get-doctors";
import { getPatients } from "@/app/_data/patients/get-patients";

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

const AppointmentsPage = async () => {
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
      <PageContent></PageContent>
    </PageContainer>
  );
};

export default AppointmentsPage;
