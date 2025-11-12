import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/**
 * Verifica se o usuário está autenticado.
 * Redireciona para /auth se não estiver logado.
 * @returns A sessão do usuário autenticado
 */
export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth");
  }

  return session;
}

