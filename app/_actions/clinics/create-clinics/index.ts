"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export interface CreateClinicDTO {
  name: string;
  email: string;
}

export const createClinic = async ({ name, email }: CreateClinicDTO) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }
  const existingClinic = await db
    .select()
    .from(clinicsTable)
    .where(eq(clinicsTable.email, email));
  if (existingClinic.length > 0) {
    throw new Error("Clínica com este email já existe");
  }
  const [clinic] = await db
    .insert(clinicsTable)
    .values({
      name,
      email,
    })
    .returning();
  await db
    .insert(usersToClinicsTable)
    .values({ clinicId: clinic.id, userId: session.user.id });

  redirect("/dashboard");
};
