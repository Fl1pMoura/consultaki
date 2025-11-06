"use server";

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

    return doctor;
  });
