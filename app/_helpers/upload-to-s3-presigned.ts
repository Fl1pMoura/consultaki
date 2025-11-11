"use client";

import { getPresignedUrl } from "./get-presigned-url";
import {
  optimizeImageClient,
  OptimizeImageOptions,
} from "./optimize-image-client";

export interface UploadToS3PresignedOptions extends OptimizeImageOptions {
  folder?: string;
  onProgress?: (progress: number) => void;
}

/**
 * Faz upload de uma imagem diretamente para o S3 usando presigned URL
 * A imagem é otimizada no cliente antes do upload
 * @param file - Arquivo de imagem a ser enviado
 * @param options - Opções de upload e otimização
 * @returns URL pública da imagem no S3
 */
export async function uploadToS3Presigned(
  file: File,
  options: UploadToS3PresignedOptions = {},
): Promise<string> {
  const {
    folder = "uploads",
    maxWidth = 100,
    maxHeight = 100,
    quality = 0.9,
    fileType = "image/jpeg",
    onProgress,
  } = options;

  // Valida tipo de arquivo
  if (!file.type.startsWith("image/")) {
    throw new Error("Arquivo deve ser uma imagem");
  }

  // Valida tamanho (máximo 10MB antes de otimização)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error("Imagem muito grande. Máximo 10MB");
  }

  // Otimiza a imagem no cliente
  onProgress?.(10);
  const optimizedFile = await optimizeImageClient(file, {
    maxWidth,
    maxHeight,
    quality,
    fileType,
  });

  // Gera nome do arquivo com timestamp
  const timestamp = Date.now();
  const fileExtension = optimizedFile.name.split(".").pop() || "jpg";
  const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

  // Obtém presigned URL da Lambda
  onProgress?.(30);
  const { uploadUrl, key } = await getPresignedUrl(fileName, folder);

  // Faz upload direto para o S3
  onProgress?.(50);
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: optimizedFile,
    headers: {
      "Content-Type": optimizedFile.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error("Erro ao fazer upload para o S3");
  }

  onProgress?.(100);

  // Constrói a URL pública da imagem
  // O bucket é público, então podemos construir a URL diretamente
  const region = process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1";
  const bucketName =
    process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || "consultaki-images";

  // Se usar CloudFront, substitua pela URL do CloudFront
  // Caso contrário, use a URL direta do S3
  const imageUrl = process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL
    ? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${key}`
    : `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

  return imageUrl;
}
