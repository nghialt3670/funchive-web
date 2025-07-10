import type { ResponseBody } from "@/types/api";

import { storageAxios } from "./axios-config";

export interface ValueFileUpdateResponse {
  id: string;
  name: string;
  contentType: string;
  size: number;
  uploadDate: string;
  checksum?: string;
}

export interface ValueFileUpdateRequest {
  id: string;
  file: File;
  metadata?: Record<string, any>;
  onProgress?: (progress: number) => void;
}

export const updateValueFile = async (
  request: ValueFileUpdateRequest,
): Promise<ValueFileUpdateResponse> => {
  const formData = new FormData();
  formData.append("file", request.file);

  if (request.metadata) {
    formData.append("metadata", JSON.stringify(request.metadata));
  }
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const response = await storageAxios.post<
    ResponseBody<ValueFileUpdateResponse>
  >(`/values/${request.id}`, formData, {
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
