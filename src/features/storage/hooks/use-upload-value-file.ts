import { useMessage } from "@/hooks/use-message";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  type ValueFileUploadRequest,
  type ValueFileUploadResponse,
  uploadValueFile,
} from "../api";

interface UseUploadValueFileOptions {
  onSuccess?: (data: ValueFileUploadResponse) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export const useUploadValueFile = (options?: UseUploadValueFileOptions) => {
  const { t } = useTranslation();
  const message = useMessage();

  return useMutation({
    mutationFn: (request: ValueFileUploadRequest) =>
      uploadValueFile({
        ...request,
        onProgress: options?.onProgress,
      }),
    onSuccess: (data: ValueFileUploadResponse) => {
      message.success(t("file-uploaded-successfully"));
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error("File upload failed:", error.message);
      message.error(error.message);
      options?.onError?.(error);
    },
  });
};
