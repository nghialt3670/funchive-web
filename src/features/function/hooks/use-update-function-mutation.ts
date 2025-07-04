import type {
  FunctionDetailDto,
  FunctionUpdateDto,
} from "@/features/function/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useTranslation } from "react-i18next";

import { updateFunction } from "../api/update-function";
import { functionQueryKeys } from "./function-query-keys";

export const useUpdateFunctionMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      functionId,
      data,
    }: {
      functionId: string;
      data: FunctionUpdateDto;
    }) => updateFunction(functionId, data),
    onSuccess: (updatedFunction: FunctionDetailDto, variables) => {
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
