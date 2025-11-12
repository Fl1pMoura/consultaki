"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Activity, useEffect } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";
dayjs.extend(utc);

import { useQuery } from "@tanstack/react-query";

import { upsertAppointment } from "@/app/_actions/appointments/upsert-appointment";
import { getDoctorAvailability } from "@/app/_actions/doctors/get-doctor-availability";
import type { Appointment } from "@/app/_data/appointments";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  appointmentStatusEnum,
  doctorsTable,
  patientsTable,
} from "@/db/schema";
import { authClient } from "@/lib/auth-clients";
import { cn } from "@/lib/utils";

import { ComboboxAppointments } from "./comboboxAppointments";
import DeleteAppointmentButton from "./deleteAppointmentButton";

const appointmentsSchema = z.object({
  patientId: z.string().min(1, { message: "Paciente é obrigatório" }),
  doctorId: z.string().min(1, { message: "Médico é obrigatório" }),
  date: z.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    { message: "Data deve ser maior ou igual à data atual" },
  ),
  time: z.string().min(1, { message: "Horário é obrigatório" }),
  appointmentPrice: z.number().min(0.01, { message: "Preço é obrigatório" }),
  status: z
    .enum(["pending", "confirmed", "cancelled"])
    .default("pending")
    .optional(),
});

interface AppointmentsFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
  appointment?: Appointment;
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
}

const AppointmentsForm = ({
  isOpen,
  onSuccess,
  appointment,
  patients,
  doctors,
}: AppointmentsFormProps) => {
  const { data: session } = authClient.useSession();

  // Obter horário e preço inicial do agendamento existente
  const getInitialTime = () => {
    if (appointment?.appointmentDate) {
      return dayjs(appointment.appointmentDate).format("HH:mm:ss");
    }
    return "09:00:00";
  };

  const getInitialPrice = () => {
    if (appointment) {
      // Se estiver editando, usar o preço do agendamento se existir
      if (appointment.appointmentPriceInCents) {
        return appointment.appointmentPriceInCents / 100;
      }
      // Caso contrário, pegar do médico
      const doctor = doctors.find((d) => d.id === appointment.doctorId);
      return doctor ? doctor.appointmentPriceInCents / 100 : 0;
    }
    return 0;
  };

  const form = useForm<z.infer<typeof appointmentsSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(appointmentsSchema),
    defaultValues: {
      patientId: appointment?.patientId ?? "",
      doctorId: appointment?.doctorId ?? "",
      date: appointment?.appointmentDate
        ? new Date(appointment.appointmentDate)
        : new Date(),
      time: getInitialTime(),
      appointmentPrice: getInitialPrice(),
      status: appointment?.status ?? "pending",
    },
  });

  // Observar mudanças no doctorId para atualizar o preço
  const selectedDoctorId = form.watch("doctorId");
  const selectedPatientId = form.watch("patientId");
  const isCalendarDisabled = !selectedPatientId || !selectedDoctorId;
  const selectedDate = form.watch("date");

  const { data: availability } = useQuery({
    queryKey: ["availability", selectedDoctorId, selectedDate],
    queryFn: () =>
      getDoctorAvailability({
        doctorId: selectedDoctorId,
        selectedDate: dayjs(selectedDate).format("YYYY-MM-DD"),
      }),
    enabled: !!selectedDoctorId && !!selectedDate,
  });

  // console.log(availability);

  useEffect(() => {
    if (selectedDoctorId) {
      const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
      if (selectedDoctor) {
        const doctorPrice = selectedDoctor.appointmentPriceInCents / 100;
        form.setValue("appointmentPrice", doctorPrice);
      }
    }
  }, [selectedDoctorId, doctors, form]);
  const upsertAppointmentAction = useAction(upsertAppointment, {
    onSuccess: () => {
      toast.success(
        `Agendamento ${appointment ? "editado" : "adicionado"} com sucesso`,
      );
      onSuccess?.();
      // Reset do formulário e limpeza dos estados locais
      form.reset({
        patientId: "",
        doctorId: "",
        date: new Date(),
        time: "09:00:00",
        appointmentPrice: 0,
        status: "pending",
      });
    },
    onError: (error) => {
      console.log("Error:", error);
      toast.error(
        `Erro ao ${appointment ? "editar" : "adicionar"} agendamento`,
      );
    },
  });
  function onSubmit(values: z.infer<typeof appointmentsSchema>) {
    // console.log("Form values:", values);
    // console.log("Form errors:", form.formState.errors);

    // Combinar data e hora
    const [hours, minutes, seconds] = values.time.split(":").map(Number);
    const appointmentDate = dayjs(values.date)
      .set("hour", hours)
      .set("minute", minutes)
      .set("second", seconds || 0)
      .toDate();

    upsertAppointmentAction.execute({
      id: appointment?.id,
      clinicId: session?.user.clinicId ?? "",
      appointmentDate,
      status:
        values.status as (typeof appointmentStatusEnum.enumValues)[number],
      patientId: values.patientId,
      doctorId: values.doctorId,
      appointmentPriceInCents: Math.round(values.appointmentPrice * 100),
    });
  }

  // Log de erros quando o formulário tentar submeter
  const handleFormSubmit = form.handleSubmit(onSubmit, (errors) => {
    console.log("Validation errors:", errors);
    toast.error("Por favor, preencha todos os campos obrigatórios");
  });
  useEffect(() => {
    if (!isOpen) {
      // Limpar estados quando o diálogo fechar
      return;
    }

    const appointmentDate = appointment?.appointmentDate ?? new Date();
    const appointmentTime = appointment?.appointmentDate
      ? dayjs(appointment.appointmentDate).format("HH:mm:ss")
      : "09:00:00";
    const appointmentPrice = appointment
      ? appointment.appointmentPriceInCents
        ? appointment.appointmentPriceInCents / 100
        : (doctors.find((d) => d.id === appointment.doctorId)
            ?.appointmentPriceInCents ?? 0) / 100
      : 0;

    form.reset({
      patientId: appointment?.patientId ?? "",
      doctorId: appointment?.doctorId ?? "",
      date: appointmentDate,
      time: appointmentTime,
      appointmentPrice,
      status: appointment?.status ?? "pending",
    });
  }, [isOpen, form, appointment, doctors]);

  const isDateAvailable = (date: Date) => {
    if (!selectedDoctorId) return false;
    const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
    if (!selectedDoctor) return false;
    const dayOfWeek = dayjs(date).day();
    return (
      dayOfWeek >= (selectedDoctor.availableFromWeekDay ?? 0) &&
      dayOfWeek <= (selectedDoctor.availableToWeekDay ?? 6)
    );
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {appointment ? "Editar Agendamento" : "Adicionar Agendamento"}
        </DialogTitle>
        <DialogDescription>
          {appointment
            ? "Edite as informações do agendamento"
            : "Adicione um novo agendamento à sua clínica."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Paciente</FormLabel>
                  <FormControl>
                    <ComboboxAppointments
                      data={patients}
                      selectText="Selecione um paciente"
                      placeholder="Pesquisar paciente"
                      emptyText="Nenhum paciente encontrado"
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Médico</FormLabel>
                  <FormControl>
                    <ComboboxAppointments
                      data={doctors}
                      selectText="Selecione um médico"
                      placeholder="Pesquisar médico"
                      emptyText="Nenhum médico encontrado"
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do Agendamento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild disabled={isCalendarDisabled}>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              dayjs(field.value).format("DD/MM/YYYY")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          locale={ptBR}
                          selected={selectedDate}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            !isDateAvailable(date) ||
                            isCalendarDisabled
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <Select
                      disabled={!selectedDate || !isDateAvailable(selectedDate)}
                      onValueChange={field.onChange}
                      value={field.value ?? "09:00:00"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availability?.data?.map((timeSlot) => (
                          <SelectItem
                            key={timeSlot.value}
                            value={timeSlot.value}
                            disabled={!timeSlot.available}
                          >
                            {timeSlot.value}
                            {!timeSlot.available && "(Indisponível)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="appointmentPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço da Consulta</FormLabel>
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
                      placeholder="R$ 0,00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="flex items-center justify-between">
            <Activity mode={appointment ? "visible" : "hidden"}>
              <DeleteAppointmentButton appointmentId={appointment?.id ?? ""} />
            </Activity>
            <Button type="submit" disabled={upsertAppointmentAction.isPending}>
              <Activity
                mode={upsertAppointmentAction.isPending ? "visible" : "hidden"}
              >
                <Loader2 className="h-5 w-5 animate-spin" />
              </Activity>
              {!upsertAppointmentAction.isPending &&
                (appointment ? "Salvar" : "Adicionar")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AppointmentsForm;
