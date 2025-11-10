import dayjs from "dayjs";
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
import {
  SkeletonSpecialitiesCard,
  SpecialitiesCard,
} from "./_components/specialitiesCard";
import {
  SkeletonTopDoctorsCard,
  TopDoctorsCard,
} from "./_components/topDoctorsCard";

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
  if (!from || !to) {
    redirect(
      "/dashboard?from=" +
        dayjs()
          .month(new Date().getMonth())
          .startOf("month")
          .format("YYYY-MM-DD") +
        "&to=" +
        dayjs()
          .month(new Date().getMonth())
          .endOf("month")
          .format("YYYY-MM-DD"),
    );
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
          <RangeDatePicker />
        </PageHeaderActions>
      </PageHeader>
      <PageContent className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <Suspense fallback={<SkeletonCard />}>
            <RevenueCard searchParams={{ from, to }} />
          </Suspense>
          <Suspense fallback={<SkeletonAppointmentsCard />}>
            <AppointmentsCard searchParams={{ from, to }} />
          </Suspense>
          <Suspense fallback={<SkeletonPatientsCard />}>
            <PatientsCard searchParams={{ from, to }} />
          </Suspense>
          <Suspense fallback={<SkeletonDoctorsCard />}>
            <DoctorsCard searchParams={{ from, to }} />
          </Suspense>
        </div>
        <div className="grid grid-cols-[2.5fr_1fr] gap-4">
          <Suspense fallback={<SkeletonTopDoctorsCard />}>
            <TopDoctorsCard searchParams={{ from, to }} />
          </Suspense>
          <Suspense fallback={<SkeletonTopDoctorsCard />}>
            <TopDoctorsCard searchParams={{ from, to }} />
          </Suspense>
        </div>
        <div className="grid grid-cols-[2.5fr_1fr] gap-4">
          <Suspense fallback={<SkeletonSpecialitiesCard />}>
            <SpecialitiesCard searchParams={{ from, to }} />
          </Suspense>
          <Suspense fallback={<SkeletonSpecialitiesCard />}>
            <SpecialitiesCard searchParams={{ from, to }} />
          </Suspense>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
