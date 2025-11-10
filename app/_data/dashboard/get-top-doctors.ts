import "server-only";

import dayjs from "dayjs";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable, doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface GetTopDoctorsParams {
  from?: Date;
  to?: Date;
}

export const getTopDoctors = async ({ from, to }: GetTopDoctorsParams = {}) => {
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
    appointmentFilters.push(
      gte(
        appointmentsTable.appointmentDate,
        dayjs(from).startOf("day").toDate(),
      ),
    );
  }

  if (to) {
    appointmentFilters.push(
      lte(appointmentsTable.appointmentDate, dayjs(to).endOf("day").toDate()),
    );
  }

  const topDoctorsData = await db
    .select({
      id: doctorsTable.id,
      name: doctorsTable.name,
      email: doctorsTable.email,
      imageUrl: doctorsTable.imageUrl,
      speciality: doctorsTable.speciality,
      availableFromWeekDay: doctorsTable.availableFromWeekDay,
      availableToWeekDay: doctorsTable.availableToWeekDay,
      availableFromHour: doctorsTable.availableFromHour,
      availableToHour: doctorsTable.availableToHour,
      appointmentPriceInCents: doctorsTable.appointmentPriceInCents,
      clinicId: doctorsTable.clinicId,
      createdAt: doctorsTable.createdAt,
      updatedAt: doctorsTable.updatedAt,
      appointmentsCount: sql<number>`count(${appointmentsTable.id})`,
    })
    .from(doctorsTable)
    .leftJoin(
      appointmentsTable,
      and(
        eq(appointmentsTable.doctorId, doctorsTable.id),
        ...appointmentFilters,
      ),
    )
    .where(eq(doctorsTable.clinicId, session.user.clinicId))
    .groupBy(doctorsTable.id)
    .orderBy(desc(sql<number>`count(${appointmentsTable.id})`))
    .limit(5);

  return topDoctorsData;
};
