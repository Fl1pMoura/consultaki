import dayjs from "dayjs";
import { DollarSignIcon } from "lucide-react";

import { getRevenue } from "@/app/_data/dashboard/get-revenue";
import { formatCurrencyInCents } from "@/app/_helpers/formatCurrencyInCents";
import { Skeleton } from "@/components/ui/skeleton";

import {
  StatsCard,
  StatsCardDescription,
  StatsCardHeader,
  StatsCardIcon,
  StatsCardTitle,
} from "./statsCard";

interface RevenueCardProps {
  searchParams: {
    from: string;
    to: string;
  };
}

export const RevenueCard = async ({ searchParams }: RevenueCardProps) => {
  const { from, to } = searchParams;
  const revenueInCents = await getRevenue({
    from: dayjs(from).toDate(),
    to: dayjs(to).toDate(),
  });

  const formattedRevenue = formatCurrencyInCents(Number(revenueInCents));

  return (
    <StatsCard>
      <StatsCardHeader>
        <StatsCardIcon>
          <DollarSignIcon size={16} className="text-accent-foreground" />
        </StatsCardIcon>
        <StatsCardDescription>Faturamento</StatsCardDescription>
      </StatsCardHeader>
      <StatsCardTitle>{formattedRevenue}</StatsCardTitle>
    </StatsCard>
  );
};

export function SkeletonCard() {
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
