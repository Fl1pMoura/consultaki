"use client";

import { useQueries } from "@tanstack/react-query";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { getDoctors } from "@/app/_data/doctors/get-doctors";
import { getPatients } from "@/app/_data/patients/get-patients";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

import AppointmentsForm from "./appointmentsForm";
import DeleteAppointmentButton from "./deleteAppointmentButton";

const TableColumnsActions = ({
  appointment,
}: {
  appointment: typeof appointmentsTable.$inferSelect & {
    patient: typeof patientsTable.$inferSelect;
    doctor: typeof doctorsTable.$inferSelect;
  };
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { "0": doctorsData, "1": patientsData } = useQueries({
    queries: [
      {
        queryKey: ["get-doctors"],
        queryFn: () => getDoctors(),
      },
      {
        queryKey: ["get-patients"],
        queryFn: () => getPatients(),
      },
    ],
  });
  console.log(doctorsData);
  console.log(patientsData);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EditIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-foreground text-xs font-semibold">
            {appointment.patient.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <EditIcon className="h-4 w-4" />
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
            <AppointmentsForm
              isOpen={isOpen}
              onSuccess={() => {
                setIsOpen(false);
              }}
              appointment={appointment}
              patients={patientsData.data ?? []}
              doctors={doctorsData.data ?? []}
            />
          </Dialog>
          <DeleteAppointmentButton
            appointmentId={appointment.id}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2Icon className="h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableColumnsActions;
