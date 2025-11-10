import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { uploadImageToS3 } from "@/app/_helpers/upload-to-s3";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * API Route para upload de imagens
 * Aceita FormData com campo 'image' e 'folder'
 * Processa e otimiza a imagem antes de fazer upload para S3
 */
export async function POST(request: NextRequest) {
  try {
    // Verifica autenticação
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Obtém FormData
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";
    const maxWidth = parseInt((formData.get("maxWidth") as string) || "100"); // 100px é o tamanho máximo de um avatar
    const quality = parseInt((formData.get("quality") as string) || "100");

    if (!file) {
      return NextResponse.json(
        { error: "Nenhuma imagem fornecida" },
        { status: 400 },
      );
    }

    // Valida tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Arquivo deve ser uma imagem" },
        { status: 400 },
      );
    }

    // Valida tamanho (máximo 10MB antes de otimização)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Imagem muito grande. Máximo 10MB" },
        { status: 400 },
      );
    }

    // Converte File para base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const imageBase64 = `data:${file.type};base64,${base64}`;

    // Faz upload para S3 (já otimiza automaticamente)
    const imageUrl = await uploadImageToS3({
      imageBase64,
      folder,
      maxWidth,
      quality,
    });

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload da imagem" },
      { status: 500 },
    );
  }
}
