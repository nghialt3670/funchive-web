import { useMessage } from "@/hooks/use-message";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  type ValueFileUpdateRequest,
  type ValueFileUpdateResponse,
} from "../api";
import { updateValueFile } from "../api/update-value-file";

interface UseUpdateValueFileMutationOptions {
  onSuccess?: (data: ValueFileUpdateResponse) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export const useUpdateValueFileMutation = (
  options?: UseUpdateValueFileMutationOptions,
) => {
  const { t } = useTranslation();
  const message = useMessage();

  return useMutation({
    mutationFn: (request: ValueFileUpdateRequest) =>
      updateValueFile({
        ...request,
        onProgress: options?.onProgress,
      }),
    onSuccess: (data: ValueFileUpdateResponse) => {
      message.success(t("file-updated-successfully"));
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error("File upload failed:", error.message);
      message.error(error.message);
      options?.onError?.(error);
    },
  });
};
