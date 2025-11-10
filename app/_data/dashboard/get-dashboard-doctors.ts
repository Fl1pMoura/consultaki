import "server-only";

import dayjs from "dayjs";
import { and, count, eq, gte, lte } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface GetDashboardDoctorsParams {
  from?: Date;
  to?: Date;
}

export const getDashboardDoctors = async ({
  from,
  to,
}: GetDashboardDoctorsParams = {}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!session.user.clinicId) {
    throw new Error("Clínica não encontrada");
  }
  const doctors = await db
    .select({ count: count() })
    .from(doctorsTable)
    .where(
      and(
        eq(doctorsTable.clinicId, session.user.clinicId),
        gte(doctorsTable.createdAt, from ?? dayjs().startOf("day").toDate()),
        lte(doctorsTable.createdAt, to ?? dayjs().endOf("day").toDate()),
      ),
    );
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return doctors[0].count ?? 0;
};
