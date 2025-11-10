import "server-only";

import dayjs from "dayjs";
import { and, count, eq, gte, lte } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface GetAppointmentsParams {
  from?: Date;
  to?: Date;
}

export const getAppointments = async ({
  from,
  to,
}: GetAppointmentsParams = {}) => {
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
    .select({ count: count() })
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
    );
  return appointments[0].count ?? 0;
};
