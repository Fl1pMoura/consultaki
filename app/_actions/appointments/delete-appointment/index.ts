"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

export const deleteAppointment = actionClient
  .inputSchema(z.object({ id: z.uuid() }))
  .action(async ({ parsedInput: { id } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("Unauthorized");
    }
    if (!session.user.clinicId) {
      throw new Error("Clínica não encontrada");
    }
    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, id),
    });
    if (!appointment) {
      throw new Error("Agendamento não encontrado");
    }
    if (appointment.clinicId !== session.user.clinicId) {
      throw new Error("Agendamento não pertence à clínica");
    }
    await db.delete(appointmentsTable).where(eq(appointmentsTable.id, id));
    revalidatePath("/appointments");
  });
