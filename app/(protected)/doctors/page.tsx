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
          <AddDoctorButton />
        </PageHeaderActions>
      </PageHeader>
      <PageContent>
        <div className="h-full w-full bg-slate-100">teste</div>
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
