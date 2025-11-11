import dayjs from "dayjs";
import { CalendarDaysIcon } from "lucide-react";

import { getDashboardAppointments } from "@/app/_data/dashboard/get-dashboard-appointments";
import { Skeleton } from "@/components/ui/skeleton";

import {
  StatsCard,
  StatsCardDescription,
  StatsCardHeader,
  StatsCardIcon,
  StatsCardTitle,
} from "./statsCard";

interface AppointmentsCardProps {
  searchParams: {
    from: string;
    to: string;
  };
}

export const AppointmentsCard = async ({
  searchParams,
}: AppointmentsCardProps) => {
  const { from, to } = searchParams;
  const appointments = await getDashboardAppointments({
    from: dayjs(from).toDate(),
    to: dayjs(to).toDate(),
  });
  return (
    <StatsCard>
      <StatsCardHeader>
        <StatsCardIcon>
          <CalendarDaysIcon size={16} className="text-accent-foreground" />
        </StatsCardIcon>
        <StatsCardDescription>Agendamentos</StatsCardDescription>
      </StatsCardHeader>
      <StatsCardTitle>{appointments}</StatsCardTitle>
    </StatsCard>
  );
};

export function SkeletonAppointmentsCard() {
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
