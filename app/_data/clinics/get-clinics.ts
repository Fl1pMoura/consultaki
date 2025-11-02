import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";

export const getClinics = async (userId: string) => {
  const clinics = await db
    .select()
    .from(usersToClinicsTable)
    .where(eq(usersToClinicsTable.userId, userId));

  return clinics;
};
