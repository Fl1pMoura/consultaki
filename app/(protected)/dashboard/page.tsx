import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getClinics } from "@/app/_data/clinics/get-clinics";
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
import {
  AppointmentsCard,
  SkeletonAppointmentsCard,
} from "./_components/appointmentsCard";
import { DoctorsCard, SkeletonDoctorsCard } from "./_components/doctorsCard";
import { PatientsCard, SkeletonPatientsCard } from "./_components/patientsCard";
import { RangeDatePicker } from "./_components/rangeDatePicker";
import { RevenueCard, SkeletonCard } from "./_components/revenueCard";

interface DashboardPageProps {
  searchParams: {
    from?: string;
    to?: string;
  };
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
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
  const { from, to } = await searchParams;

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
          <RangeDatePicker />
        </PageHeaderActions>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-4 gap-4">
          <Suspense fallback={<SkeletonCard />}>
            <RevenueCard searchParams={{ from, to }} />
          </Suspense>
          <Suspense fallback={<SkeletonAppointmentsCard />}>
            <AppointmentsCard />
          </Suspense>
          <Suspense fallback={<SkeletonPatientsCard />}>
            <PatientsCard />
          </Suspense>
          <Suspense fallback={<SkeletonDoctorsCard />}>
            <DoctorsCard />
          </Suspense>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
