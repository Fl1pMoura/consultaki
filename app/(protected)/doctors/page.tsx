import { getDoctors } from "@/app/_data/doctors/get-doctors";
import { requireAuth } from "@/app/_helpers/require-auth";
import { requireClinic } from "@/app/_helpers/require-clinic";

import {
  PageContainer,
  PageContent,
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageTitle,
} from "../_components/pageContainer";
import AddDoctorButton from "./_components/addDoctorButton";
import DoctorCard from "./_components/doctorCard";

const DoctorsPage = async () => {
  const session = await requireAuth();
  await requireClinic(session.user.id);
  const doctors = await getDoctors();
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
          <AddDoctorButton />
        </PageHeaderActions>
      </PageHeader>
      <PageContent>
        <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
