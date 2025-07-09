import type { ResponseBody } from "@/types/api";

import { storageAxios } from "./axios-config";

export interface ValueFileUploadResponse {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  url?: string;
}

export interface ValueFileUploadRequest {
  file: File;
  metadata?: Record<string, any>;
  onProgress?: (progress: number) => void;
}

export const uploadValueFile = async (
  request: ValueFileUploadRequest,
): Promise<ValueFileUploadResponse> => {
  const formData = new FormData();
  formData.append("file", request.file);

  if (request.metadata) {
    formData.append("metadata", JSON.stringify(request.metadata));
  }

  const response = await storageAxios.post<
    ResponseBody<ValueFileUploadResponse>
  >("/values/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (request.onProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        request.onProgress(progress);
      }
    },
  });

  return response.data.data;
};
