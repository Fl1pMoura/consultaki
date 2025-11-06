"use client";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import DoctorsForm from "./doctorsForm";

const AddDoctorButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Adicionar Médico
        </Button>
      </DialogTrigger>
      <DoctorsForm onSuccess={() => setOpen(false)} />
    </Dialog>
  );
};

export default AddDoctorButton;
