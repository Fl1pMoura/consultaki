import { Loader2, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Activity, type ReactNode } from "react";
import { toast } from "sonner";

import { deletePatient } from "@/app/_actions/patients/delete-patient";
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

interface DeletePatientButtonProps {
  patientId: string;
  trigger?: ReactNode;
}

const DeletePatientButton = ({
  patientId,
  trigger,
}: DeletePatientButtonProps) => {
  const deletePatientAction = useAction(deletePatient, {
    onSuccess: () => {
      toast.success("Paciente excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir paciente");
    },
  });
  function onDeletePatient() {
    deletePatientAction.execute({ id: patientId });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant={"destructive"} className="mr-auto">
            <TrashIcon />
            Excluir Paciente
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja excluir este paciente?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso irá excluir o paciente
            permanentemente e remover seus dados do nosso servidor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDeletePatient}
            disabled={deletePatientAction.isPending}
          >
            <Activity
              mode={deletePatientAction.isPending ? "visible" : "hidden"}
            >
              <Loader2 className="h-5 w-5 animate-spin" />
            </Activity>
            {!deletePatientAction.isPending && "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePatientButton;
