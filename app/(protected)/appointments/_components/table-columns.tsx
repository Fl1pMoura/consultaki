"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CheckIcon, ClockIcon, XIcon } from "lucide-react";

import { formatCurrencyInCents } from "@/app/_helpers/formatCurrencyInCents";
import { Badge } from "@/components/ui/badge";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

import TableColumnsActions from "./tableColumnsActions";

type Appointment = typeof appointmentsTable.$inferSelect & {
  patient: typeof patientsTable.$inferSelect | null;
  doctor: typeof doctorsTable.$inferSelect | null;
};

export const columns: ColumnDef<Appointment>[] = [
  {
    id: "patientName",
    header: "Nome do Paciente",
    cell: ({ row }) => {
      console.log(row.original);
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
    id: "speciality",
    header: "Especialidade",
    cell: ({ row }) => {
      return (
        <div className="capitalize">{row.original.doctor?.speciality}</div>
      );
    },
  },
  {
    id: "price",
    header: "Preço",
    cell: ({ row }) => {
      return (
        <div>{formatCurrencyInCents(row.original.appointmentPriceInCents)}</div>
      );
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
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return <TableColumnsActions appointment={row.original} />;
    },
  },
];
