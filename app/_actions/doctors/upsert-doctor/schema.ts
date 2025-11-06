import z from "zod";

export const UpsertDoctorSchema = z
  .object({
    id: z.uuid().optional(),
    clinicId: z.uuid().optional(),
    name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
    email: z.email({ message: "Email inválido" }),
    speciality: z
      .string()
      .trim()
      .min(1, { message: "Especialidade é obrigatória" }),
    availableFromWeekDay: z
      .number()
      .min(0, { message: "Dia da semana é obrigatório" })
      .max(6, { message: "Dia da semana é obrigatório" }),
    availableToWeekDay: z
      .number()
      .min(0, { message: "Dia da semana é obrigatório" })
      .max(6, { message: "Dia da semana é obrigatório" }),
    availableFromHour: z
      .string()
      .trim()
      .min(0, { message: "Hora de início é obrigatória" })
      .max(23, { message: "Hora de início é obrigatória" }),
    availableToHour: z
      .string()
      .trim()
      .min(0, { message: "Hora de término é obrigatória" })
      .max(23, { message: "Hora de término é obrigatória" }),
    appointmentPriceInCents: z
      .number()
      .min(1, { message: "Preço é obrigatório" }),
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

export type UpsertDoctorSchema = z.infer<typeof UpsertDoctorSchema>;
