import "server-only";

import { redirect } from "next/navigation";

import { getClinics } from "@/app/_data/clinics/get-clinics";

/**
 * Verifica se o usuário tem pelo menos uma clínica associada.
 * Redireciona para /clinics se não tiver clínica.
 * @param userId - ID do usuário
 * @returns Array de clínicas do usuário
 */
export async function requireClinic(userId: string) {
  const clinics = await getClinics(userId);

  if (!clinics.length) {
    redirect("/clinics");
  }

  return clinics;
}

