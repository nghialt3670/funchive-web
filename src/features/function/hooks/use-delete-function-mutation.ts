import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useTranslation } from "react-i18next";

import { deleteFunction } from "../api/delete-function";
import { functionQueryKeys } from "./function-query-keys";

export const useDeleteFunctionMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (functionId: string) => deleteFunction(functionId),
    onSuccess: (_, functionId) => {
      queryClient.removeQueries({
        queryKey: functionQueryKeys.detail(functionId),
      });

      queryClient.invalidateQueries({
        queryKey: functionQueryKeys.lists(),
      });

      message.success(t("function-deleted-successfully"));
    },
    onError: (error) => {
      console.error(error.message);
      message.error(error.message);
    },
  });
};
