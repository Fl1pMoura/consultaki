"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { InfoIcon, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Activity, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";
dayjs.extend(utc);

import { upsertPatient } from "@/app/_actions/patients/upsert-patient";
import {
  formatDateToString,
  parseDateString,
} from "@/app/_helpers/format-date";
import { formatDocument } from "@/app/_helpers/format-document";
import { formatPhone } from "@/app/_helpers/format-phone";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patientsTable } from "@/db/schema";

import DeletePatientButton from "./deletePatientButton";

const patientsSchema = z
  .object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z.email({ message: "Email inválido" }),
    phone: z.string().trim().min(1, { message: "Telefone é obrigatório" }),
    sex: z.enum(["male", "female"]),
    birthDate: z.date().optional().nullable(),
    document: z.string().trim().min(1, { message: "Documento é obrigatório" }),
    agreement: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.birthDate) {
        return data.birthDate < new Date(); // Data de nascimento deve ser menor que a data atual
      }
      return true;
    },
    {
      path: ["birthDate"],
      message: "Data de nascimento deve ser uma data válida",
    },
  );

interface PatientsFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
  patient?: typeof patientsTable.$inferSelect;
}

const PatientsForm = ({ isOpen, onSuccess, patient }: PatientsFormProps) => {
  const getInitialBirthDate = () => {
    if (patient?.birthDate) {
      return formatDateToString(new Date(patient.birthDate));
    }
    return "";
  };

  const [documentValue, setDocumentValue] = useState<string>(
    patient?.document ?? "",
  );
  const [birthDateValue, setBirthDateValue] = useState<string>(
    getInitialBirthDate(),
  );

  const form = useForm<z.infer<typeof patientsSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(patientsSchema),
    defaultValues: {
      name: patient?.name ?? "",
      email: patient?.email ?? "",
      phone: patient?.phone ?? "",
      sex: patient?.sex ?? "male",
      birthDate: patient?.birthDate ? new Date(patient.birthDate) : null,
      document: patient?.document ?? "",
      agreement: patient?.agreement ?? undefined,
    },
  });
  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success("Paciente adicionado com sucesso");
      onSuccess?.();
      form.reset();
      setDocumentValue("");
      setBirthDateValue("");
    },
    onError: () => {
      toast.error("Erro ao adicionar paciente");
    },
  });
  function onSubmit(values: z.infer<typeof patientsSchema>) {
    // Parse birthDate string to Date if provided
    let birthDate: Date | null = null;
    if (birthDateValue) {
      const parsedDate = parseDateString(birthDateValue);
      if (parsedDate) {
        birthDate = parsedDate;
      }
    }

    upsertPatientAction.execute({
      id: patient?.id,
      ...values,
      birthDate: birthDate ?? undefined,
    });
  }
  useEffect(() => {
    if (isOpen) {
      const birthDate = patient?.birthDate ? new Date(patient.birthDate) : null;
      const formattedBirthDate = birthDate ? formatDateToString(birthDate) : "";

      form.reset({
        name: patient?.name ?? "",
        email: patient?.email ?? "",
        phone: patient?.phone ?? "",
        sex: patient?.sex ?? "male",
        birthDate: birthDate,
        document: patient?.document ?? "",
        agreement: patient?.agreement ?? undefined,
      });

      // Usar setTimeout para evitar setState síncrono no effect
      setTimeout(() => {
        setDocumentValue(patient?.document ?? "");
        setBirthDateValue(formattedBirthDate);
      }, 0);
    }
  }, [isOpen, form, patient]);
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {patient ? "Editar Paciente" : "Adicionar Paciente"}
        </DialogTitle>
        <DialogDescription>
          {patient
            ? "Edite as informações do médico"
            : "Adicione um novo paciente à sua clínica."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do paciente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o email do paciente"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-7">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  const phoneValue = field.value || "";

                  return (
                    <FormItem className="w-full">
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          value={formatPhone(phoneValue)}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const formatted = formatPhone(inputValue);
                            // Salva apenas os números no campo do formulário
                            const numbers = formatted.replace(/\D/g, "");
                            field.onChange(numbers);
                          }}
                          placeholder="99 99999-9999"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>Documento</FormLabel>
                      <FormControl>
                        <Input
                          value={documentValue}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const formatted = formatDocument(inputValue);
                            setDocumentValue(formatted);
                            // Salva apenas os números no campo do formulário
                            const numbers = formatted.replace(/\D/g, "");
                            field.onChange(numbers);
                          }}
                          placeholder="CPF ou RG"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex gap-7">
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Sexo</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <PatternFormat
                        format="##/##/####"
                        mask="_"
                        value={birthDateValue}
                        onValueChange={(values) => {
                          setBirthDateValue(values.formattedValue);
                          const parsedDate = parseDateString(
                            values.formattedValue,
                          );
                          field.onChange(parsedDate);
                        }}
                        customInput={Input}
                        placeholder="00/00/0000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="agreement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="flex items-center gap-2"
                    title="O convênio é opcional. Se não for informado, o paciente será considerado sem convênio."
                  >
                    Convênio{" "}
                    <span
                      className="cursor-pointer text-xs text-gray-500"
                      onClick={() => {
                        toast.info(
                          "O convênio é opcional. Se não for informado, o paciente será considerado sem convênio.",
                        );
                      }}
                    >
                      <InfoIcon className="h-4 w-4" />
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o convênio do paciente (ex: SulAmérica, UNIMED, etc.)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="flex items-center justify-between">
            <Activity mode={patient ? "visible" : "hidden"}>
              <DeletePatientButton patientId={patient?.id ?? ""} />
            </Activity>
            <Button type="submit" disabled={upsertPatientAction.isPending}>
              <Activity
                mode={upsertPatientAction.isPending ? "visible" : "hidden"}
              >
                <Loader2 className="h-5 w-5 animate-spin" />
              </Activity>
              {!upsertPatientAction.isPending &&
                (patient ? "Editar" : "Adicionar")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default PatientsForm;
