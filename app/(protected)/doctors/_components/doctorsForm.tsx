"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Activity, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";
dayjs.extend(utc);

import Image from "next/image";

import { upsertDoctor } from "@/app/_actions/doctors/upsert-doctor";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileInput } from "@/components/ui/file-inputs";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorsTable } from "@/db/schema";
import { authClient } from "@/lib/auth-clients";

import DeleteDoctorButton from "./deleteDoctorButton";

const doctorsSchema = z
  .object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z.email({ message: "Email inválido" }),
    speciality: z
      .string()
      .trim()
      .min(1, { message: "Especialidade é obrigatória" }),
    availableFromWeekDay: z
      .string()
      .min(0, { message: "Dia da semana é obrigatório" })
      .max(6, { message: "Dia da semana é obrigatório" }),
    availableToWeekDay: z
      .string()
      .min(0, { message: "Dia da semana é obrigatório" })
      .max(6, { message: "Dia da semana é obrigatório" }),
    availableFromHour: z
      .string()
      .min(1, { message: "Hora de início é obrigatória" }),
    availableToHour: z
      .string()
      .min(1, { message: "Hora de término é obrigatória" }),
    appointmentPrice: z.number().min(1, { message: "Preço é obrigatório" }),
    image: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.availableFromHour < data.availableToHour;
    },
    {
      path: ["availableToHour"],
      message: "A hora de término deve ser maior que a hora de início",
    },
  )
  .refine(
    (data) => {
      return data.availableFromWeekDay < data.availableToWeekDay;
    },
    {
      path: ["availableToWeekDay"],
      message: "O dia final deve ser maior que o dia inicial",
    },
  );

interface DoctorsFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
  doctor?: typeof doctorsTable.$inferSelect;
}

const DoctorsForm = ({ isOpen, onSuccess, doctor }: DoctorsFormProps) => {
  const { data: session } = authClient.useSession();
  const [file, setFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const form = useForm<z.infer<typeof doctorsSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(doctorsSchema),
    defaultValues: {
      name: doctor?.name ?? "",
      email: doctor?.email ?? "",
      speciality: doctor?.speciality ?? "",
      availableFromWeekDay: doctor?.availableFromWeekDay?.toString() ?? "1",
      availableToWeekDay: doctor?.availableToWeekDay?.toString() ?? "5",
      availableFromHour: doctor?.availableFromHour ?? "",
      availableToHour: doctor?.availableToHour ?? "",
      appointmentPrice: doctor?.appointmentPriceInCents
        ? doctor.appointmentPriceInCents / 100
        : 0,
      image: doctor?.imageUrl ?? undefined,
    },
  });
  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success(
        doctor ? "Médico editado com sucesso" : "Médico adicionado com sucesso",
      );
      onSuccess?.();
      form.reset({
        name: "",
        email: "",
        speciality: "",
        availableFromWeekDay: "1",
        availableToWeekDay: "5",
        availableFromHour: "05:00:00",
        availableToHour: "23:30:00",
        appointmentPrice: 0,
        image: undefined,
      });
      setFile(null);
    },
    onError: () => {
      toast.error(
        doctor ? "Erro ao editar médico" : "Erro ao adicionar médico",
      );
    },
  });
  async function onSubmit(values: z.infer<typeof doctorsSchema>) {
    upsertDoctorAction.execute({
      id: doctor?.id,
      clinicId: session?.user.clinicId ?? "",
      ...values,
      appointmentPriceInCents: values.appointmentPrice * 100,
      availableFromWeekDay: parseInt(values.availableFromWeekDay),
      availableToWeekDay: parseInt(values.availableToWeekDay),
      availableFromHour: dayjs()
        .set("hour", parseInt(values.availableFromHour.split(":")[0]))
        .set("minute", parseInt(values.availableFromHour.split(":")[1]))
        .set("second", parseInt(values.availableFromHour.split(":")[2]))
        .utc()
        .format("HH:mm:ss"),
      availableToHour: dayjs()
        .set("hour", parseInt(values.availableToHour.split(":")[0]))
        .set("minute", parseInt(values.availableToHour.split(":")[1]))
        .set("second", parseInt(values.availableToHour.split(":")[2]))
        .utc()
        .format("HH:mm:ss"),
      image: values.image,
    });
  }
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: doctor?.name ?? "",
        email: doctor?.email ?? "",
        speciality: doctor?.speciality ?? "",
        availableFromWeekDay: doctor?.availableFromWeekDay?.toString() ?? "1",
        availableToWeekDay: doctor?.availableToWeekDay?.toString() ?? "5",
        availableFromHour: doctor?.availableFromHour ?? "05:00:00",
        availableToHour: doctor?.availableToHour ?? "23:30:00",
        appointmentPrice: doctor?.appointmentPriceInCents
          ? doctor.appointmentPriceInCents / 100
          : 0,
        image: doctor?.imageUrl ?? undefined,
      });
    }
  }, [isOpen, form, doctor]);
  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {doctor ? "Editar Médico" : "Adicionar Médico"}
        </DialogTitle>
        <DialogDescription>
          {doctor
            ? "Edite as informações do médico"
            : "Adicione um novo médico à sua clínica."}
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
                    <Input placeholder="Digite o nome do médico" {...field} />
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
                    <Input placeholder="Digite o email do médico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <FileInput
                        className="w-full"
                        value={file}
                        onChange={async (selectedFile) => {
                          setFile(selectedFile);
                          if (selectedFile) {
                            setIsUploadingImage(true);
                            try {
                              // Faz upload via API route
                              const formData = new FormData();
                              formData.append("image", selectedFile);
                              formData.append("folder", "doctors");
                              formData.append("maxWidth", "100");
                              formData.append("quality", "100");

                              const response = await fetch(
                                "/api/upload-image",
                                {
                                  method: "POST",
                                  body: formData,
                                },
                              );

                              if (!response.ok) {
                                const error = await response.json();
                                throw new Error(
                                  error.error || "Erro ao fazer upload",
                                );
                              }

                              const { url } = await response.json();
                              field.onChange(url);
                              toast.success("Imagem enviada com sucesso");
                            } catch (error) {
                              console.error("Erro ao fazer upload:", error);
                              toast.error(
                                error instanceof Error
                                  ? error.message
                                  : "Erro ao fazer upload da imagem",
                              );
                              setFile(null);
                              field.onChange(undefined);
                            } finally {
                              setIsUploadingImage(false);
                            }
                          } else {
                            field.onChange(undefined);
                          }
                        }}
                        disabled={
                          form.formState.isSubmitting || isUploadingImage
                        }
                        accept="image/*"
                      />
                      {isUploadingImage && (
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Otimizando e enviando imagem...</span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {file && (
                    <div className="relative mt-2 aspect-square h-40 overflow-hidden rounded-md">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Imagem do médico"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {!file && field.value && (
                    <div className="relative mt-2 aspect-square h-40 overflow-hidden rounded-md">
                      <Image
                        src={field.value}
                        alt="Imagem do médico"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="speciality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidade</FormLabel>
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a especialidade" />
                          <SelectContent>
                            <SelectItem value="cardiologia">
                              Cardiologia
                            </SelectItem>
                            <SelectItem value="neurologia">
                              Neurologia
                            </SelectItem>
                            <SelectItem value="pediatria">Pediatria</SelectItem>
                            <SelectItem value="geriatria">Geriatria</SelectItem>
                            <SelectItem value="endocrinologia">
                              Endocrinologia
                            </SelectItem>
                            <SelectItem value="ginecologia">
                              Ginecologia
                            </SelectItem>
                          </SelectContent>
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                  </FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço da consulta</FormLabel>
                  <FormControl>
                    <NumericFormat
                      value={field.value ?? 0}
                      onValueChange={(value) =>
                        field.onChange(value.floatValue ?? 0)
                      }
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      allowNegative={false}
                      allowLeadingZeros={false}
                      fixedDecimalScale={true}
                      prefix="R$"
                      customInput={Input}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableFromWeekDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia inicial de disponibilidade</FormLabel>
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? "1"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o dia da semana" />
                          <SelectContent>
                            <SelectItem value="0">Domingo</SelectItem>
                            <SelectItem value="1">Segunda</SelectItem>
                            <SelectItem value="2">Terça</SelectItem>
                            <SelectItem value="3">Quarta</SelectItem>
                            <SelectItem value="4">Quinta</SelectItem>
                            <SelectItem value="5">Sexta</SelectItem>
                            <SelectItem value="6">Sábado</SelectItem>
                          </SelectContent>
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                  </FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableToWeekDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia final de disponibilidade</FormLabel>
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? "5"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o dia da semana" />
                          <SelectContent>
                            <SelectItem value="0">Domingo</SelectItem>
                            <SelectItem value="1">Segunda</SelectItem>
                            <SelectItem value="2">Terça</SelectItem>
                            <SelectItem value="3">Quarta</SelectItem>
                            <SelectItem value="4">Quinta</SelectItem>
                            <SelectItem value="5">Sexta</SelectItem>
                            <SelectItem value="6">Sábado</SelectItem>
                          </SelectContent>
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                  </FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="availableFromHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de início de disponibilidade</FormLabel>
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? "05:00:00"}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o horário" />
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Manhã</SelectLabel>
                                <SelectItem value="05:00:00">05:00</SelectItem>
                                <SelectItem value="05:30:00">05:30</SelectItem>
                                <SelectItem value="06:00:00">06:00</SelectItem>
                                <SelectItem value="06:30:00">06:30</SelectItem>
                                <SelectItem value="07:00:00">07:00</SelectItem>
                                <SelectItem value="07:30:00">07:30</SelectItem>
                                <SelectItem value="08:00:00">08:00</SelectItem>
                                <SelectItem value="08:30:00">08:30</SelectItem>
                                <SelectItem value="09:00:00">09:00</SelectItem>
                                <SelectItem value="09:30:00">09:30</SelectItem>
                                <SelectItem value="10:00:00">10:00</SelectItem>
                                <SelectItem value="10:30:00">10:30</SelectItem>
                                <SelectItem value="11:00:00">11:00</SelectItem>
                                <SelectItem value="11:30:00">11:30</SelectItem>
                                <SelectItem value="12:00:00">12:00</SelectItem>
                                <SelectItem value="12:30:00">12:30</SelectItem>
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel>Tarde</SelectLabel>
                                <SelectItem value="13:00:00">13:00</SelectItem>
                                <SelectItem value="13:30:00">13:30</SelectItem>
                                <SelectItem value="14:00:00">14:00</SelectItem>
                                <SelectItem value="14:30:00">14:30</SelectItem>
                                <SelectItem value="15:00:00">15:00</SelectItem>
                                <SelectItem value="15:30:00">15:30</SelectItem>
                                <SelectItem value="16:00:00">16:00</SelectItem>
                                <SelectItem value="16:30:00">16:30</SelectItem>
                                <SelectItem value="17:00:00">17:00</SelectItem>
                                <SelectItem value="17:30:00">17:30</SelectItem>
                                <SelectItem value="18:00:00">18:00</SelectItem>
                                <SelectItem value="18:30:00">18:30</SelectItem>
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel>Noite</SelectLabel>
                                <SelectItem value="19:00:00">19:00</SelectItem>
                                <SelectItem value="19:30:00">19:30</SelectItem>
                                <SelectItem value="20:00:00">20:00</SelectItem>
                                <SelectItem value="20:30:00">20:30</SelectItem>
                                <SelectItem value="21:00:00">21:00</SelectItem>
                                <SelectItem value="21:30:00">21:30</SelectItem>
                                <SelectItem value="22:00:00">22:00</SelectItem>
                                <SelectItem value="22:30:00">22:30</SelectItem>
                                <SelectItem value="23:00:00">23:00</SelectItem>
                                <SelectItem value="23:30:00">23:30</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </SelectTrigger>
                        </FormControl>
                      </Select>
                    </FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableToHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de término de disponibilidade</FormLabel>
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? "23:30:00"}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o horário" />
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Manhã</SelectLabel>
                                <SelectItem value="05:00:00">05:00</SelectItem>
                                <SelectItem value="05:30:00">05:30</SelectItem>
                                <SelectItem value="06:00:00">06:00</SelectItem>
                                <SelectItem value="06:30:00">06:30</SelectItem>
                                <SelectItem value="07:00:00">07:00</SelectItem>
                                <SelectItem value="07:30:00">07:30</SelectItem>
                                <SelectItem value="08:00:00">08:00</SelectItem>
                                <SelectItem value="08:30:00">08:30</SelectItem>
                                <SelectItem value="09:00:00">09:00</SelectItem>
                                <SelectItem value="09:30:00">09:30</SelectItem>
                                <SelectItem value="10:00:00">10:00</SelectItem>
                                <SelectItem value="10:30:00">10:30</SelectItem>
                                <SelectItem value="11:00:00">11:00</SelectItem>
                                <SelectItem value="11:30:00">11:30</SelectItem>
                                <SelectItem value="12:00:00">12:00</SelectItem>
                                <SelectItem value="12:30:00">12:30</SelectItem>
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel>Tarde</SelectLabel>
                                <SelectItem value="13:00:00">13:00</SelectItem>
                                <SelectItem value="13:30:00">13:30</SelectItem>
                                <SelectItem value="14:00:00">14:00</SelectItem>
                                <SelectItem value="14:30:00">14:30</SelectItem>
                                <SelectItem value="15:00:00">15:00</SelectItem>
                                <SelectItem value="15:30:00">15:30</SelectItem>
                                <SelectItem value="16:00:00">16:00</SelectItem>
                                <SelectItem value="16:30:00">16:30</SelectItem>
                                <SelectItem value="17:00:00">17:00</SelectItem>
                                <SelectItem value="17:30:00">17:30</SelectItem>
                                <SelectItem value="18:00:00">18:00</SelectItem>
                                <SelectItem value="18:30:00">18:30</SelectItem>
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel>Noite</SelectLabel>
                                <SelectItem value="19:00:00">19:00</SelectItem>
                                <SelectItem value="19:30:00">19:30</SelectItem>
                                <SelectItem value="20:00:00">20:00</SelectItem>
                                <SelectItem value="20:30:00">20:30</SelectItem>
                                <SelectItem value="21:00:00">21:00</SelectItem>
                                <SelectItem value="21:30:00">21:30</SelectItem>
                                <SelectItem value="22:00:00">22:00</SelectItem>
                                <SelectItem value="22:30:00">22:30</SelectItem>
                                <SelectItem value="23:00:00">23:00</SelectItem>
                                <SelectItem value="23:30:00">23:30</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </SelectTrigger>
                        </FormControl>
                      </Select>
                    </FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between">
            <Activity mode={doctor ? "visible" : "hidden"}>
              <DeleteDoctorButton doctorId={doctor?.id ?? ""} />
            </Activity>
            <Button type="submit" disabled={upsertDoctorAction.isPending}>
              <Activity
                mode={upsertDoctorAction.isPending ? "visible" : "hidden"}
              >
                <Loader2 className="h-5 w-5 animate-spin" />
              </Activity>
              {!upsertDoctorAction.isPending &&
                (doctor ? "Editar" : "Adicionar")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default DoctorsForm;
