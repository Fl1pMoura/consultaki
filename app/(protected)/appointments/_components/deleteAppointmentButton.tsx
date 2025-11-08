import { Loader2, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Activity, type ReactNode } from "react";
import { toast } from "sonner";

import { deleteAppointment } from "@/app/_actions/appointments/delete-appointment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteAppointmentButtonProps {
  appointmentId: string;
  trigger?: ReactNode;
}

const DeleteAppointmentButton = ({
  appointmentId,
  trigger,
}: DeleteAppointmentButtonProps) => {
  const deleteAppointmentAction = useAction(deleteAppointment, {
    onSuccess: () => {
      toast.success("Agendamento excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir agendamento");
    },
  });
  function onDeleteAppointment() {
    deleteAppointmentAction.execute({ id: appointmentId });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant={"destructive"} className="mr-auto">
            <TrashIcon />
            Excluir Agendamento
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja excluir este agendamento?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso irá excluir o agendamento
            permanentemente e remover o agendamento do nosso servidor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDeleteAppointment}
            disabled={deleteAppointmentAction.isPending}
          >
            <Activity
              mode={deleteAppointmentAction.isPending ? "visible" : "hidden"}
            >
              <Loader2 className="h-5 w-5 animate-spin" />
            </Activity>
            {!deleteAppointmentAction.isPending && "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAppointmentButton;
