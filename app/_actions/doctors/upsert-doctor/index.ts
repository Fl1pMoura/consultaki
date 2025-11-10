"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { deleteImageFromS3 } from "@/app/_helpers/upload-to-s3";
import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { UpsertDoctorSchema } from "./schema";

export const upsertDoctor = actionClient
  .inputSchema(UpsertDoctorSchema)
  .action(async ({ parsedInput: data }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("Unauthorized");
    }
    if (!session.user.clinicId) {
      throw new Error("Clínica não encontrada");
    }

    let existingDoctor = null;
    if (data.id && data.id !== "") {
      existingDoctor = await db.query.doctorsTable.findFirst({
        where: and(
          eq(doctorsTable.id, data.id),
          eq(doctorsTable.clinicId, session.user.clinicId),
        ),
      });
      if (existingDoctor && existingDoctor.clinicId !== session.user.clinicId) {
        throw new Error("Médico não pertence à clínica");
      }
    }

    // Processa a imagem
    // A imagem já vem como URL do S3 (upload feito via API route)
    let imageUrl: string | null = null;

    if (data.image && data.image.startsWith("http")) {
      // Nova imagem já foi enviada via API route, vem como URL
      imageUrl = data.image;

      // Se está editando e tinha uma imagem antiga diferente, deleta ela
      if (
        existingDoctor?.imageUrl &&
        existingDoctor.imageUrl !== imageUrl &&
        existingDoctor.imageUrl.startsWith("http")
      ) {
        try {
          await deleteImageFromS3(existingDoctor.imageUrl);
        } catch (error) {
          // Log do erro mas não falha a operação
          console.error("Erro ao deletar imagem antiga do S3:", error);
        }
      }
    } else if (!data.image && existingDoctor?.imageUrl) {
      // Se não enviou imagem e já tinha uma, mantém a existente
      imageUrl = existingDoctor.imageUrl;
    }

    // Remove o campo image do data (não existe no schema do banco)
    // e adiciona imageUrl
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image, ...doctorData } = data;

    const [doctor] = await db
      .insert(doctorsTable)
      .values({
        clinicId: session.user.clinicId,
        id: data.id,
        ...doctorData,
        imageUrl: imageUrl || null,
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...doctorData,
          imageUrl: imageUrl || null,
        },
      })
      .returning();

    revalidatePath("/doctors");
    return doctor;
  });
