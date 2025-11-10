import { CalendarDaysIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import {
  StatsCard,
  StatsCardDescription,
  StatsCardHeader,
  StatsCardIcon,
  StatsCardTitle,
} from "./statsCard";

export const AppointmentsCard = () => {
  return (
    <StatsCard>
      <StatsCardHeader>
        <StatsCardIcon>
          <CalendarDaysIcon size={16} className="text-accent-foreground" />
        </StatsCardIcon>
        <StatsCardDescription>Agendamentos</StatsCardDescription>
      </StatsCardHeader>
      <StatsCardTitle>100</StatsCardTitle>
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
