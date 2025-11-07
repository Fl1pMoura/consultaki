"use client";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
  CalendarDaysIcon,
  Clock4Icon,
  DollarSignIcon,
  VenusIcon,
} from "lucide-react";
import { useState } from "react";

import { formatCurrencyInCents } from "@/app/_helpers/formatCurrencyInCents";
import { getAvailability } from "@/app/_helpers/getAvailability";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { doctorsTable } from "@/db/schema";

import DoctorsForm from "./doctorsForm";

interface DoctorCardProps {
  doctor: typeof doctorsTable.$inferSelect;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const doctorInitial = doctor.name
    .split(" ")
    .slice(0, 2)
    .map((name) => name[0])
    .join("");
  const formattedAppointmentPrice = formatCurrencyInCents(
    doctor.appointmentPriceInCents,
  );
  const doctorNameAndSurname = doctor.name.split(" ").slice(0, 2).join(" ");
  const { from, to } = getAvailability(doctor);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card className="px-6 py-5">
      <CardHeader className="border-b-muted-foreground/20 flex items-center gap-3 border-b px-0 pb-6">
        <Avatar className="size-18">
          <AvatarImage src={doctor.imageUrl ?? undefined} />
          <AvatarFallback>{doctorInitial}</AvatarFallback>
        </Avatar>
        <div className="space-y-1.5">
          <CardTitle className="text-foreground text-sm font-bold">
            Dr. {doctorNameAndSurname}
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <Badge variant={"secondary"} className="text-primary size-6.5 p-0">
              <VenusIcon color="currentColor" />
            </Badge>
            <CardDescription className="text-muted-foreground text-sm font-medium capitalize">
              {doctor.speciality}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-0">
        <Badge
          variant={"secondary"}
          className="text-foreground flex items-center gap-2 text-xs font-medium"
        >
          <CalendarDaysIcon className="text-foreground size-4" />
          {from.format("dddd").split("-")[0]} a{" "}
          {to.format("dddd").split("-")[0]}
        </Badge>
        <Badge
          variant={"secondary"}
          className="text-foreground flex items-center gap-2 text-xs font-medium"
        >
          <Clock4Icon className="text-foreground size-4" />
          {from.format("HH:mm")} às {to.format("HH:mm")}
        </Badge>
        <Badge
          variant={"secondary"}
          className="text-foreground flex items-center gap-2 text-xs font-medium"
        >
          <DollarSignIcon className="text-foreground size-4" />
          {formattedAppointmentPrice}
        </Badge>
      </CardContent>
      <CardFooter className="border-t-muted-foreground/20 border-t px-0 pt-6">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Ver Detalhes</Button>
          </DialogTrigger>
          <DoctorsForm
            onSuccess={() => setIsOpen(false)}
            doctor={{
              ...doctor,
              availableToHour: to.format("HH:mm:ss"),
              availableFromHour: from.format("HH:mm:ss"),
            }}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
