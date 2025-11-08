import { EditIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

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
import { patientsTable } from "@/db/schema";

import PatientsForm from "./patientForm";

const TableColumnsActions = ({
  patient,
}: {
  patient: typeof patientsTable.$inferSelect;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EditIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-foreground text-xs font-semibold">
              {patient.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <EditIcon className="h-4 w-4" />
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem>
              <Trash2Icon className="h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <PatientsForm
        isOpen={isOpen}
        onSuccess={() => {
          setIsOpen(false);
        }}
        patient={patient}
      />
    </Dialog>
  );
};

export default TableColumnsActions;
