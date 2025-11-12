import dayjs from "dayjs";
import { CalendarRange } from "lucide-react";
import Link from "next/link";

import { getDashboardAppointments } from "@/app/_data/dashboard/get-dashboard-appointments";
import { Skeleton } from "@/components/ui/skeleton";

import { AppointmentsChart } from "./appointmentsChart";
import { StatsCard, StatsCardDescription, StatsCardHeader } from "./statsCard";

interface AppointmentsChartsCardProps {
  searchParams: {
    from: string;
    to: string;
  };
}

export const AppointmentsChartsCard = async ({
  searchParams,
}: AppointmentsChartsCardProps) => {
  const { from, to } = searchParams;

  const selectedRange = {
    from: dayjs(from).toDate(),
    to: dayjs(to).toDate(),
  };

  const selectedRangeDays = dayjs(selectedRange.to).diff(
    dayjs(selectedRange.from),
    "day",
  );
  const chartData = Array.from(
    { length: selectedRangeDays + 1 },
    (_, index) => ({
      date: dayjs(selectedRange.from).add(index, "day").toDate(),
      count: 0,
    }),
  );
  const appointments = await getDashboardAppointments({
    from: selectedRange.from,
    to: selectedRange.to,
  });

  appointments.forEach((appointment) => {
    const index = dayjs(appointment.appointmentDate).diff(
      dayjs(selectedRange.from),
      "day",
    );
    chartData[index].count = appointment.count;
  });
  // console.log(chartData);

  return (
    <StatsCard className="gap-0">
      <StatsCardHeader className="gap-3">
        <CalendarRange size={16} className="text-accent-foreground" />
        <StatsCardDescription className="text-foreground">
          Gráfico de agendamentos
        </StatsCardDescription>
        <Link
          href="/appointments"
          className="text-muted-foreground hover:text-primary ml-auto text-sm font-semibold transition-colors"
        >
          Ver todos
        </Link>
      </StatsCardHeader>
      <div className="border-muted-foreground/20 mt-6 h-[241px] overflow-y-auto border-t pt-6">
        <AppointmentsChart chartData={chartData} />
      </div>
    </StatsCard>
  );
};

export function SkeletonAppointmentsChartsCard() {
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
