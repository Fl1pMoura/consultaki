import {
  PageContainer,
  PageContent,
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageTitle,
} from "../_components/pageContainer";

const PlansPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Planos</PageTitle>
          <PageHeaderDescription>
            Acesse um resumo das métricas e dados dos planos.
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div className="h-full w-full bg-slate-100">teste</div>
      </PageContent>
    </PageContainer>
  );
};

export default PlansPage;
