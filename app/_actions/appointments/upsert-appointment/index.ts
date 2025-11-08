"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import type { appointmentStatusEnum } from "@/db/schema";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { UpsertAppointmentSchema } from "./schema";

export const upsertAppointment = actionClient
  .inputSchema(UpsertAppointmentSchema)
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
      const existingAppointment = await db.query.appointmentsTable.findFirst({
        where: and(
          eq(appointmentsTable.id, data.id),
          eq(appointmentsTable.clinicId, session.user.clinicId),
        ),
      });
      if (
        existingAppointment &&
        existingAppointment.clinicId !== session.user.clinicId
      ) {
        throw new Error("Agendamento não pertence à clínica");
      }
    }
    const [appointment] = await db
      .insert(appointmentsTable)
      .values({
        id: data.id,
        clinicId: session.user.clinicId,
        patientId: data.patientId,
        doctorId: data.doctorId,
        appointmentDate: data.appointmentDate,
        appointmentPriceInCents: data.appointmentPriceInCents,
        status:
          data.status as (typeof appointmentStatusEnum.enumValues)[number],
      })
      .onConflictDoUpdate({
        target: [appointmentsTable.id],
        set: {
          patientId: data.patientId,
          doctorId: data.doctorId,
          appointmentDate: data.appointmentDate,
          appointmentPriceInCents: data.appointmentPriceInCents,
          status:
            data.status as (typeof appointmentStatusEnum.enumValues)[number],
        },
      })
      .returning();

    revalidatePath("/appointments");
    return appointment;
  });
