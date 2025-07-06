import type {
  FunctionDetail,
  FunctionUpdate,
} from "@/features/function/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useTranslation } from "react-i18next";

import { updateFunction } from "../api/update-function";
import { functionQueryKeys } from "./function-query-keys";

export const useUpdateFunctionBasicInfoMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

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

      message.success(t("function-basic-info-updated-successfully"));
    },
    onError: (error) => {
      console.error(error.message);
      message.error(error.message);
    },
  });
};
