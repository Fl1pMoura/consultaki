import z from "zod";

export const UpsertAppointmentSchema = z.object({
  id: z.uuid().optional(),
  patientId: z.uuid().min(1, { message: "Paciente é obrigatório" }),
  doctorId: z.uuid().min(1, { message: "Médico é obrigatório" }),
  clinicId: z.uuid().min(1, { message: "Clínica é obrigatória" }),
  appointmentDate: z.date().min(new Date(), {
    message: "Data do agendamento deve ser maior que a data atual",
  }),
  appointmentPriceInCents: z.number().min(1, {
    message: "Preço é obrigatório",
  }),
  status: z
    .enum(["pending", "confirmed", "cancelled"])
    .default("pending")
    .optional(),
});

export type UpsertAppointmentSchema = z.infer<typeof UpsertAppointmentSchema>;
