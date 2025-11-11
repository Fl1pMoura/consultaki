"use client";

import imageCompression from "browser-image-compression";

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  fileType?: string;
}

/**
 * Otimiza e redimensiona uma imagem no cliente usando browser-image-compression
 * @param file - Arquivo de imagem original
 * @param options - Opções de otimização
 * @returns Arquivo otimizado
 */
export async function optimizeImageClient(
  file: File,
  options: OptimizeImageOptions = {},
): Promise<File> {
  const {
    maxWidth = 100,
    maxHeight = 100,
    quality = 0.9,
    fileType = "image/jpeg",
  } = options;

  const optionsCompression = {
    maxSizeMB: 1,
    maxWidthOrHeight: Math.max(maxWidth, maxHeight),
    useWebWorker: true,
    fileType,
    initialQuality: quality,
  };

  try {
    const compressedFile = await imageCompression(file, optionsCompression);
    return compressedFile;
  } catch (error) {
    console.error("Erro ao otimizar imagem:", error);
    // Se falhar, retorna o arquivo original
    return file;
  }
}

