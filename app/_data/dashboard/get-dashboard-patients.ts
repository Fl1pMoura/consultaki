import "server-only";

import dayjs from "dayjs";
import { and, count, eq, gte, lte } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface GetDashboardPatientsParams {
  from?: Date;
  to?: Date;
}

export const getDashboardPatients = async ({
  from,
  to,
}: GetDashboardPatientsParams = {}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!session.user.clinicId) {
    throw new Error("Clínica não encontrada");
  }
  const patients = await db
    .select({ count: count() })
    .from(patientsTable)
    .where(
      and(
        eq(patientsTable.clinicId, session.user.clinicId),
        gte(patientsTable.createdAt, from ?? dayjs().startOf("day").toDate()),
        lte(patientsTable.createdAt, to ?? dayjs().endOf("day").toDate()),
      ),
    );
  return patients[0].count ?? 0;
};
