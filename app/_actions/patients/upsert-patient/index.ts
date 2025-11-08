"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { UpsertPatientSchema } from "./schema";

export const upsertPatient = actionClient
  .inputSchema(UpsertPatientSchema)
  .action(async ({ parsedInput: data }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("Unauthorized");
    }
    if (!session.user.clinicId) {
      throw new Error("Clínica não encontrada");
    }
    if (data.clinicId && data.clinicId !== session.user.clinicId) {
      throw new Error("Paciente não pertence à clínica");
    }
    const [patient] = await db
      .insert(patientsTable)
      .values({
        id: data.id,
        clinicId: session.user.clinicId,
        ...data,
      })
      .onConflictDoUpdate({
        target: [patientsTable.id],
        set: {
          ...data,
        },
      })
      .returning();

    revalidatePath("/patients");
    return patient;
  });
