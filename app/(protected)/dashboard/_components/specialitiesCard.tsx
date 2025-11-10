import dayjs from "dayjs";
import { AlertCircleIcon, BabyIcon, HospitalIcon } from "lucide-react";
import Link from "next/link";

import { getDashboardSpecialities } from "@/app/_data/dashboard/get-dashboard-specialities";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import { StatsCard, StatsCardDescription, StatsCardHeader } from "./statsCard";

interface SpecialitiesCardProps {
  searchParams: {
    from: string;
    to: string;
  };
}

export const SpecialitiesCard = async ({
  searchParams,
}: SpecialitiesCardProps) => {
  const { from, to } = searchParams;
  const specialities = await getDashboardSpecialities({
    from: dayjs(from).toDate(),
    to: dayjs(to).toDate(),
  });
  return (
    <StatsCard>
      <StatsCardHeader className="gap-3">
        <HospitalIcon size={16} className="text-accent-foreground" />
        <StatsCardDescription className="text-foreground">
          Especialidades
        </StatsCardDescription>
        <Link
          href="/doctors"
          className="text-muted-foreground hover:text-primary ml-auto text-sm font-semibold transition-colors"
        >
          Ver todos
        </Link>
      </StatsCardHeader>
      <ul className="border-muted-foreground/20 mt-6 space-y-6 border-t pt-6">
        {specialities.specialities.length === 0 ? (
          <div className="flex w-full items-center justify-center">
            <AlertCircleIcon size={16} className="text-muted-foreground mr-2" />
            <p className="text-muted-foreground text-center text-sm font-medium">
              Nenhum agendamento encontrado no período selecionado
            </p>
          </div>
        ) : (
          specialities.specialities.map((speciality) => {
            const percentage =
              (speciality.appointmentsCount / specialities.totalAppointments) *
              100;
            return (
              <li
                key={speciality.name}
                className="flex w-full items-center gap-3"
              >
                <span className="bg-accent flex size-10.5 min-w-10.5 items-center justify-center rounded-full">
                  <BabyIcon size={20} className="text-accent-foreground" />
                </span>
                <div className="w-full">
                  <div className="flex w-full items-center justify-between">
                    <p className="text-sm font-semibold capitalize">
                      {speciality.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {speciality.appointmentsCount} agend.
                    </p>
                  </div>
                  <Progress value={percentage} className="mt-2" />
                </div>
              </li>
            );
          })
        )}
      </ul>
    </StatsCard>
  );
};

export function SkeletonSpecialitiesCard() {
  return (
    <StatsCard>
      <StatsCardHeader className="gap-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-xl" />
        <Skeleton className="ml-auto h-4 w-16 rounded-xl" />
      </StatsCardHeader>
      <ul className="border-muted-foreground/20 mt-6 space-y-6 border-t pt-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <li key={index} className="flex w-full items-center gap-3">
            <span className="bg-accent flex size-10.5 min-w-10.5 items-center justify-center rounded-full">
              <Skeleton className="size-10.5 min-w-10.5 rounded-full" />
            </span>
            <div className="w-full">
              <div className="flex w-full items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-xl" />
                <Skeleton className="ml-auto h-4 w-16 rounded-xl" />
              </div>
              <Skeleton className="mt-2 h-4 w-full rounded-xl" />
            </div>
          </li>
        ))}
      </ul>
    </StatsCard>
  );
}
