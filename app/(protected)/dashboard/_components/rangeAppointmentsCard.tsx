import dayjs from "dayjs";
import { CalendarRange } from "lucide-react";
import Link from "next/link";

import { getAppointments } from "@/app/_data/appointments";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { columns } from "./rangeAppointmentsCardColumns";
import { StatsCard, StatsCardDescription, StatsCardHeader } from "./statsCard";

interface RangeAppointmentsCardProps {
  searchParams: {
    from: string;
    to: string;
  };
}

export const RangeAppointmentsCard = async ({
  searchParams,
}: RangeAppointmentsCardProps) => {
  const { from, to } = searchParams;

  const appointments = await getAppointments({
    from: dayjs(from).toDate(),
    to: dayjs(to).toDate(),
  });

  return (
    <StatsCard className="gap-6">
      <StatsCardHeader className="gap-3">
        <CalendarRange size={16} className="text-accent-foreground" />
        <StatsCardDescription className="text-foreground">
          Agendamentos de {dayjs(from).format("DD/MM/YY")} a{" "}
          {dayjs(to).format("DD/MM/YY")}
        </StatsCardDescription>
        <Link
          href="/appointments"
          className="text-muted-foreground hover:text-primary ml-auto text-sm font-semibold transition-colors"
        >
          Ver todos
        </Link>
      </StatsCardHeader>
      <div className="max-h-[195px] overflow-y-auto">
        <DataTable columns={columns} data={appointments} />
      </div>
    </StatsCard>
  );
};

export function SkeletonRangeAppointmentsCard() {
  return (
    <StatsCard className="gap-6">
      <StatsCardHeader className="gap-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-xl" />
        <Skeleton className="ml-auto h-4 w-16 rounded-xl" />
      </StatsCardHeader>
      <Skeleton className="h-[195px] w-full rounded-xl" />
    </StatsCard>
  );
}
