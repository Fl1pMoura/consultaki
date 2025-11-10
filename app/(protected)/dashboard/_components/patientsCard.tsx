import dayjs from "dayjs";
import { Users2Icon } from "lucide-react";

import { getDashboardPatients } from "@/app/_data/dashboard/get-dashboard-patients";
import { Skeleton } from "@/components/ui/skeleton";

import {
  StatsCard,
  StatsCardDescription,
  StatsCardHeader,
  StatsCardIcon,
  StatsCardTitle,
} from "./statsCard";

interface PatientsCardProps {
  searchParams: {
    from: string;
    to: string;
  };
}

export const PatientsCard = async ({ searchParams }: PatientsCardProps) => {
  const { from, to } = searchParams;
  const patients = await getDashboardPatients({
    from: dayjs(from).toDate(),
    to: dayjs(to).toDate(),
  });
  return (
    <StatsCard>
      <StatsCardHeader>
        <StatsCardIcon>
          <Users2Icon size={16} className="text-accent-foreground" />
        </StatsCardIcon>
        <StatsCardDescription>Pacientes</StatsCardDescription>
      </StatsCardHeader>
      <StatsCardTitle>{patients}</StatsCardTitle>
    </StatsCard>
  );
};

export function SkeletonPatientsCard() {
  return (
    <StatsCard>
      <StatsCardHeader>
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24 rounded-xl" />
      </StatsCardHeader>
      <Skeleton className="h-8 w-full rounded-xl" />
    </StatsCard>
  );
}
