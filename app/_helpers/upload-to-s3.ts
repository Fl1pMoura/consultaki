"use server";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface UploadImageParams {
  imageBase64: string;
  folder?: string;
  fileName?: string;
  maxWidth?: number;
  quality?: number;
}

/**
 * Redimensiona e otimiza uma imagem usando Sharp
 * @param buffer - Buffer da imagem original
 * @param maxWidth - Largura máxima (padrão: 100px) - 100px é o tamanho máximo de um avatar
 * @param quality - Qualidade da compressão 1-100 (padrão: 100)
 * @returns Buffer otimizado da imagem
 */
async function optimizeImage(
  buffer: Buffer,
  maxWidth = 100, // 100px é o tamanho máximo de um avatar
  quality = 100,
): Promise<{ buffer: Buffer; mimeType: string }> {
  // 100% de qualidade
  try {
    // Redimensiona mantendo proporção e otimiza
    const optimizedBuffer = await sharp(buffer)
      .resize(maxWidth, undefined, {
        fit: "inside", // Mantém proporção, encaixa dentro das dimensões
        withoutEnlargement: true, // Não aumenta imagens menores
      })
      .jpeg({ quality, mozjpeg: true }) // Converte para JPEG otimizado
      .toBuffer();

    return {
      buffer: optimizedBuffer,
      mimeType: "image/jpeg",
    };
  } catch (error) {
    console.error("Erro ao otimizar imagem:", error);
    // Se falhar, retorna a imagem original
    return {
      buffer,
      mimeType: "image/jpeg",
    };
  }
}

/**
 * Faz upload de uma imagem em base64 para o S3
 * A imagem é automaticamente redimensionada e otimizada antes do upload
 * @param imageBase64 - String base64 da imagem (com ou sem data URL prefix)
 * @param folder - Pasta no S3 (ex: "doctors", "patients")
 * @param fileName - Nome do arquivo (opcional, será gerado um UUID se não fornecido)
 * @param maxWidth - Largura máxima da imagem (padrão: 100px)
 * @param quality - Qualidade da compressão 1-100 (padrão: 100)
 * @returns URL pública da imagem no S3
 */
export async function uploadImageToS3({
  imageBase64,
  folder = "uploads",
  fileName,
  maxWidth = 100,
  quality = 100,
}: UploadImageParams): Promise<string> {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials não configuradas");
  }

  if (!process.env.AWS_S3_BUCKET_NAME) {
    throw new Error("AWS S3 bucket name não configurado");
  }

  // Remove o prefixo data:image/...;base64, se existir
  const base64Data = imageBase64.includes(",")
    ? imageBase64.split(",")[1]
    : imageBase64;

  // Converte base64 para Buffer
  const originalBuffer = Buffer.from(base64Data, "base64");

  // Redimensiona e otimiza a imagem
  const { buffer: optimizedBuffer, mimeType } = await optimizeImage(
    originalBuffer,
    maxWidth,
    quality,
  );

  // Gera nome do arquivo se não fornecido (sempre JPEG após otimização)
  const finalFileName = fileName || `${randomUUID()}.jpg`;

  // Cria o caminho completo no S3
  const key = folder ? `${folder}/${finalFileName}` : finalFileName;

  // Faz upload para o S3
  // Nota: O acesso público deve ser configurado através da política do bucket,
  // não através de ACLs (que podem estar desabilitadas)
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: optimizedBuffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);

  // Retorna a URL pública da imagem
  const region = process.env.AWS_REGION || "us-east-1";
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  // Se você usar CloudFront, substitua pela URL do CloudFront
  // Caso contrário, use a URL direta do S3
  const imageUrl = process.env.AWS_CLOUDFRONT_URL
    ? `${process.env.AWS_CLOUDFRONT_URL}/${key}`
    : `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

  return imageUrl;
}

/**
 * Deleta uma imagem do S3
 * @param imageUrl - URL completa da imagem no S3
 */
export async function deleteImageFromS3(imageUrl: string): Promise<void> {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials não configuradas");
  }

  if (!process.env.AWS_S3_BUCKET_NAME) {
    throw new Error("AWS S3 bucket name não configurado");
  }

  // Extrai a key do S3 da URL
  const url = new URL(imageUrl);
  const key = url.pathname.startsWith("/")
    ? url.pathname.substring(1)
    : url.pathname;

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}
