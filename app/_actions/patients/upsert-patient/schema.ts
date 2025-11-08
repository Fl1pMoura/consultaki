import z from "zod";

export const UpsertPatientSchema = z.object({
  id: z.uuid().optional(),
  clinicId: z.uuid().optional(),
  name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  email: z.email({ message: "Email inválido" }),
  phone: z.string().trim().min(1, { message: "Telefone é obrigatório" }),
  sex: z.enum(["male", "female"]),
  birthDate: z.date().optional(),
  document: z.string().trim().min(1, { message: "Documento é obrigatório" }),
  agreement: z.string().trim().optional(),
});

export type UpsertPatientSchema = z.infer<typeof UpsertPatientSchema>;
