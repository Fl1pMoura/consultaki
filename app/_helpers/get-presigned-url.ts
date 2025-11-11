"use client";

/**
 * Obtém uma presigned URL do S3 através da Lambda
 * @param fileName - Nome do arquivo a ser enviado
 * @param folder - Pasta no S3 (opcional, padrão: "uploads")
 * @returns Objeto com uploadUrl e key do S3
 */
export async function getPresignedUrl(
  fileName: string,
  folder?: string,
): Promise<{
  uploadUrl: string;
  key: string;
}> {
  const lambdaUrl = process.env.NEXT_PUBLIC_LAMBDA_PRESIGNED_URL;

  if (!lambdaUrl) {
    throw new Error("Lambda URL não configurada");
  }

  const response = await fetch(lambdaUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileName, folder }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Erro ao obter presigned URL",
    }));
    throw new Error(error.message || "Erro ao obter presigned URL");
  }

  const data = await response.json();
  return {
    uploadUrl: data.uploadUrl,
    key: data.key,
  };
}

