import { Loader2, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Activity } from "react";
import { toast } from "sonner";

import { deleteDoctor } from "@/app/_actions/doctors/delete-doctor";
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

interface DeleteDoctorButtonProps {
  doctorId: string;
}

const DeleteDoctorButton = ({ doctorId }: DeleteDoctorButtonProps) => {
  const deleteDoctorAction = useAction(deleteDoctor, {
    onSuccess: () => {
      toast.success("Médico excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir médico");
    },
  });
  function onDeleteDoctor() {
    deleteDoctorAction.execute({ id: doctorId });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant={"destructive"} className="mr-auto">
          <TrashIcon />
          Excluir Médico
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja excluir este médico?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso irá excluir o médico
            permanentemente e remover seus dados do nosso servidor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDeleteDoctor}
            disabled={deleteDoctorAction.isPending}
          >
            <Activity
              mode={deleteDoctorAction.isPending ? "visible" : "hidden"}
            >
              <Loader2 className="h-5 w-5 animate-spin" />
            </Activity>
            {!deleteDoctorAction.isPending && "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDoctorButton;
