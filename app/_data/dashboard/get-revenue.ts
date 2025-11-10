import "server-only";

import dayjs from "dayjs";
import { and, eq, gte, lte, sum } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface GetRevenueParams {
  from?: Date;
  to?: Date;
}

export const getRevenue = async ({ from, to }: GetRevenueParams = {}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!session.user.clinicId) {
    throw new Error("Clínica não encontrada");
  }
  const revenue = await db
    .select({ sum: sum(appointmentsTable.appointmentPriceInCents) })
    .from(appointmentsTable)
    .where(
      and(
        and(
          eq(appointmentsTable.clinicId, session.user.clinicId),
          gte(
            appointmentsTable.appointmentDate,
            from ?? dayjs().startOf("day").toDate(),
          ),
          lte(
            appointmentsTable.appointmentDate,
            to ?? dayjs().endOf("day").toDate(),
          ),
        ),
        lte(
          appointmentsTable.appointmentDate,
          to ?? dayjs().endOf("day").toDate(),
        ),
      ),
    );
  return revenue[0].sum ?? 0;
};
