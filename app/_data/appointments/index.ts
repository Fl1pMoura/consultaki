import "server-only";

import { and, asc, eq, gte, lte } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export type Appointment = typeof appointmentsTable.$inferSelect & {
  patient: typeof patientsTable.$inferSelect | null;
  doctor: typeof doctorsTable.$inferSelect | null;
};

export const getAppointments = async ({
  from,
  to,
}: {
  from?: Date;
  to?: Date;
}): Promise<Appointment[]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!session.user.clinicId) {
    throw new Error("Clínica não encontrada");
  }

  const appointmentFilters = [
    eq(appointmentsTable.clinicId, session.user.clinicId),
  ];

  if (from) {
    appointmentFilters.push(gte(appointmentsTable.appointmentDate, from));
  }

  if (to) {
    appointmentFilters.push(lte(appointmentsTable.appointmentDate, to));
  }

  const appointments = await db
    .select()
    .from(appointmentsTable)
    .leftJoin(patientsTable, eq(appointmentsTable.patientId, patientsTable.id))
    .leftJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
    .where(and(...appointmentFilters))
    .orderBy(asc(appointmentsTable.appointmentDate));

  await new Promise((resolve) => setTimeout(resolve, 10000));
  return appointments.map((appointment) => ({
    ...appointment.appointments,
    patient: appointment.patients,
    doctor: appointment.doctors,
  }));
};
