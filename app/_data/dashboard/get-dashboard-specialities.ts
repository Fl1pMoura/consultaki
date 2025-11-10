import "server-only";

import dayjs from "dayjs";
import { and, eq, gte, lte } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
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
  const specialities = await db.query.doctorsTable.findMany({
    where: and(
      eq(doctorsTable.clinicId, session.user.clinicId),
      gte(doctorsTable.createdAt, from ?? dayjs().startOf("day").toDate()),
      lte(doctorsTable.createdAt, to ?? dayjs().endOf("day").toDate()),
    ),
    with: {
      appointments: true,
    },
    columns: {
      speciality: true,
    },
  });
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return {
    specialities: specialities.map((doctor) => ({
      name: doctor.speciality,
      appointmentsCount: doctor.appointments.length,
    })),
    totalAppointments: specialities.reduce(
      (acc, doctor) => acc + doctor.appointments.length,
      0,
    ),
  };
};
