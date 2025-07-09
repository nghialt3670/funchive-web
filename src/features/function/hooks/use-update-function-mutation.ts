import type { FunctionDetail, FunctionUpdate } from "@/features/function/types";
import { useMessage } from "@/hooks/use-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { updateFunction } from "../api/update-function";
import { functionQueryKeys } from "./function-query-keys";

export const useUpdateFunctionMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const message = useMessage();

  return useMutation({
    mutationFn: ({
      functionId,
      data,
    }: {
      functionId: string;
      data: FunctionUpdate;
    }) => updateFunction(functionId, data),
    onSuccess: (updatedFunction: FunctionDetail, variables) => {
      queryClient.setQueryData(
        functionQueryKeys.detail(variables.functionId),
        updatedFunction,
      );

      queryClient.invalidateQueries({
        queryKey: functionQueryKeys.lists(),
      });

      message.success(t("function-updated-successfully"));
    },
    onError: (error) => {
      console.error(error.message);
      message.error(error.message);
    },
  });
};
