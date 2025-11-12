import "server-only";

import dayjs from "dayjs";
import { and, count, eq, gte, lte } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface GetDashboardAppointmentsParams {
  from?: Date;
  to?: Date;
}

export const getDashboardAppointments = async ({
  from,
  to,
}: GetDashboardAppointmentsParams = {}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!session.user.clinicId) {
    throw new Error("Clínica não encontrada");
  }

  const appointments = await db
    .select({
      count: count(),
      appointmentDate: appointmentsTable.appointmentDate,
    })
    .from(appointmentsTable)
    .where(
      and(
        eq(appointmentsTable.clinicId, session.user.clinicId),
        gte(
          appointmentsTable.createdAt,
          from ?? dayjs().startOf("day").toDate(),
        ),
        lte(appointmentsTable.createdAt, to ?? dayjs().endOf("day").toDate()),
      ),
    )
    .groupBy(appointmentsTable.appointmentDate);
  return appointments;
};
