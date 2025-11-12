"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CheckIcon, ClockIcon, XIcon } from "lucide-react";

import type { Appointment } from "@/app/_data/appointments";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Appointment>[] = [
  {
    id: "patientName",
    header: "Nome do Paciente",
    cell: ({ row }) => {
      return <div>{row.original.patient?.name}</div>;
    },
  },
  {
    id: "date",
    header: "Data da Consulta",
    cell: ({ row }) => {
      return (
        <div>
          {dayjs(row.original.appointmentDate).format("DD/MM/YY, HH:mm")}
        </div>
      );
    },
  },
  {
    id: "doctorName",
    header: "Médico",
    cell: ({ row }) => {
      return <div>{row.original.doctor?.name}</div>;
    },
  },

  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          className="capitalize"
          variant={row.original.status === "pending" ? "outline" : "default"}
        >
          {row.original.status === "pending" ? (
            <ClockIcon className="h-4 w-4" />
          ) : row.original.status === "confirmed" ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <XIcon className="h-4 w-4" />
          )}
          {row.original.status}
        </Badge>
      );
    },
  },
];
