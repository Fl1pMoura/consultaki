"use client";

import { ColumnDef } from "@tanstack/react-table";

import { formatDocument } from "@/app/_helpers/format-document";
import { formatPhone } from "@/app/_helpers/format-phone";
import { patientsTable } from "@/db/schema";

import TableColumnsActions from "./tableColumnsActions";

type Patient = typeof patientsTable.$inferSelect;

export const columns: ColumnDef<Patient>[] = [
  {
    id: "name",
    header: "Nome",
    cell: ({ row }) => {
      return <div>{row.original.name}</div>;
    },
  },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div>{row.original.email}</div>;
    },
  },
  {
    id: "phone",
    header: "Telefone",
    cell: ({ row }) => {
      return <div>{formatPhone(row.original.phone)}</div>;
    },
  },
  {
    id: "sex",
    header: "Sexo",
    cell: ({ row }) => {
      return (
        <div>{row.original.sex === "male" ? "Masculino" : "Feminino"}</div>
      );
    },
  },
  {
    id: "document",
    header: "Documento",
    cell: ({ row }) => {
      return <div>{formatDocument(row.original.document)}</div>;
    },
  },
  {
    id: "agreement",
    header: "Convênio",
    cell: ({ row }) => {
      const agreement = row.original.agreement;
      if (agreement) {
        return <div>{agreement}</div>;
      }
      return <div className="bg-muted-foreground/60 h-px w-4 rounded-md"></div>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return (
        <div>
          <TableColumnsActions patient={row.original} />
        </div>
      );
    },
  },
];
