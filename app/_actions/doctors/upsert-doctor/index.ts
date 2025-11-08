"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { UpsertDoctorSchema } from "./schema";

export const upsertDoctor = actionClient
  .inputSchema(UpsertDoctorSchema)
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
    if (data.id && data.id !== "") {
      const existingDoctor = await db.query.doctorsTable.findFirst({
        where: and(
          eq(doctorsTable.id, data.id),
          eq(doctorsTable.clinicId, session.user.clinicId),
        ),
      });
      if (existingDoctor && existingDoctor.clinicId !== session.user.clinicId) {
        throw new Error("Médico não pertence à clínica");
      }
    }
    const [doctor] = await db
      .insert(doctorsTable)
      .values({
        clinicId: session.user.clinicId,
        id: data.id,
        ...data,
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...data,
        },
      })
      .returning();

    revalidatePath("/doctors");
    return doctor;
  });
