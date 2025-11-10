import dayjs from "dayjs";
import { StethoscopeIcon } from "lucide-react";
import Link from "next/link";

import { getTopDoctors } from "@/app/_data/dashboard/get-top-doctors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { StatsCard, StatsCardDescription, StatsCardHeader } from "./statsCard";

interface TopDoctorsCardProps {
  searchParams: {
    from: string;
    to: string;
  };
}

export const TopDoctorsCard = async ({ searchParams }: TopDoctorsCardProps) => {
  const { from, to } = searchParams;
  const topDoctors = await getTopDoctors({
    from: dayjs(from).toDate(),
    to: dayjs(to).toDate(),
  });
  return (
    <StatsCard>
      <StatsCardHeader className="gap-3">
        <StethoscopeIcon size={16} className="text-accent-foreground" />
        <StatsCardDescription className="text-foreground">
          Médicos
        </StatsCardDescription>
        <Link
          href="/doctors"
          className="text-muted-foreground hover:text-primary ml-auto text-sm font-semibold transition-colors"
        >
          Ver todos
        </Link>
      </StatsCardHeader>
      <ul className="border-muted-foreground/20 mt-6 space-y-6 border-t pt-6">
        {topDoctors.map((doctor) => {
          const doctorInitial = doctor.name
            .split(" ")
            .slice(0, 2)
            .map((name) => name[0])
            .join("");
          return (
            <li key={doctor.id} className="flex items-center gap-3">
              <Avatar className="size-14">
                <AvatarImage src={doctor.imageUrl ?? undefined} />
                <AvatarFallback>{doctorInitial}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{doctor.name}</p>
                <p className="text-muted-foreground text-sm capitalize">
                  {doctor.speciality}
                </p>
              </div>
              <span className="text-muted-foreground ml-auto text-sm font-semibold">
                {doctor.appointmentsCount} agend.
              </span>
            </li>
          );
        })}
      </ul>
    </StatsCard>
  );
};

export function SkeletonTopDoctorsCard() {
  return (
    <StatsCard>
      <StatsCardHeader className="gap-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-xl" />
        <Skeleton className="ml-auto h-4 w-16 rounded-xl" />
      </StatsCardHeader>
      <ul className="border-muted-foreground/20 mt-6 space-y-6 border-t pt-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className="flex items-center gap-3">
            <Skeleton className="size-14 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 rounded-xl" />
            </div>
            <Skeleton className="ml-auto h-4 w-16 rounded-xl" />
          </li>
        ))}
      </ul>
    </StatsCard>
  );
}
