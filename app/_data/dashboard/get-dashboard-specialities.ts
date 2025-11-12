import "server-only";

import dayjs from "dayjs";
import { and, count, desc, eq, gte, lte } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable, doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface GetDashboardSpecialitiesParams {
  from?: Date;
  to?: Date;
}

export const getDashboardSpecialities = async ({
  from,
  to,
}: GetDashboardSpecialitiesParams = {}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!session.user.clinicId) {
    throw new Error("Clínica não encontrada");
  }
  const specialities = await db
    .select({
      speciality: doctorsTable.speciality,
      appointmentsCount: count(appointmentsTable.id),
    })
    .from(doctorsTable)
    .leftJoin(
      appointmentsTable,
      eq(doctorsTable.id, appointmentsTable.doctorId),
    )
    .where(
      and(
        eq(doctorsTable.clinicId, session.user.clinicId),
        gte(doctorsTable.createdAt, from ?? dayjs().startOf("day").toDate()),
        lte(doctorsTable.createdAt, to ?? dayjs().endOf("day").toDate()),
      ),
    )
    .groupBy(doctorsTable.speciality)
    .orderBy(desc(count(appointmentsTable.id)))
    .limit(3);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return {
    specialities: specialities.map((doctor) => ({
      name: doctor.speciality,
      appointmentsCount: doctor.appointmentsCount,
    })),
    totalAppointments: specialities.reduce(
      (acc, doctor) => acc + doctor.appointmentsCount,
      0,
    ),
  };
};
