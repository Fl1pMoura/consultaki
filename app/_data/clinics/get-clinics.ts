import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";

export const getClinics = async (userId: string) => {
  const clinics = await db
    .select({
      id: clinicsTable.id,
      name: clinicsTable.name,
      email: clinicsTable.email,
    })
    .from(usersToClinicsTable)
    .where(eq(usersToClinicsTable.userId, userId))
    .innerJoin(clinicsTable, eq(usersToClinicsTable.clinicId, clinicsTable.id));

  return clinics;
};
