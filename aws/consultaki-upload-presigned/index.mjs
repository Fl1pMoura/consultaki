import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: "us-east-1" });

export const handler = async (event) => {
  const { fileName, folder } = JSON.parse(event.body);

  if (!fileName) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing fileName parameter"
      })
    };
  }

  // Usa o folder fornecido ou padrão "uploads"
  const s3Folder = folder || "uploads";
  const key = `${s3Folder}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: "consultaki-images",
    Key: key,
  });

  // URL válida por 5 minutos (300 segundos)
  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: presignedUrl,
      key: key
    })
  };
};
