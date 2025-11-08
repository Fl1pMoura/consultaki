import "server-only";

import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getPatients = async () => {
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
    .select()
    .from(patientsTable)
    .where(eq(patientsTable.clinicId, session.user.clinicId))
    .orderBy(asc(patientsTable.createdAt));

  return patients;
};
