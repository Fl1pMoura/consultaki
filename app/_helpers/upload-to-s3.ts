"use server";

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
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
