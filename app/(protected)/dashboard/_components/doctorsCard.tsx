import dayjs from "dayjs";
import { StethoscopeIcon } from "lucide-react";

import { getDashboardDoctors } from "@/app/_data/dashboard/get-dashboard-doctors";
import { Skeleton } from "@/components/ui/skeleton";

import {
  StatsCard,
  StatsCardDescription,
  StatsCardHeader,
  StatsCardIcon,
  StatsCardTitle,
} from "./statsCard";

interface DoctorsCardProps {
  searchParams: {
    from: string;
    to: string;
  };
}

export const DoctorsCard = async ({ searchParams }: DoctorsCardProps) => {
  const { from, to } = searchParams;
  const doctors = await getDashboardDoctors({
    from: dayjs(from).toDate(),
    to: dayjs(to).toDate(),
  });
  return (
    <StatsCard>
      <StatsCardHeader>
        <StatsCardIcon>
          <StethoscopeIcon size={16} className="text-accent-foreground" />
        </StatsCardIcon>
        <StatsCardDescription>Médicos</StatsCardDescription>
      </StatsCardHeader>
      <StatsCardTitle>{doctors}</StatsCardTitle>
    </StatsCard>
  );
};

export function SkeletonDoctorsCard() {
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
