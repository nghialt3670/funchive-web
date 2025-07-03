import type {
  FunctionCreateDto,
  FunctionDetailDto,
} from "@/features/function/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useTranslation } from "react-i18next";

import { createFunction } from "../api/create-function";
import { functionQueryKeys } from "./function-query-keys";

export const useFunctionCreateMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FunctionCreateDto) => createFunction(data),
    onSuccess: (functionDetail: FunctionDetailDto) => {
      queryClient.invalidateQueries({
        queryKey: functionQueryKeys.lists(),
      });

      queryClient.setQueryData(
        functionQueryKeys.detail(functionDetail.id),
        functionDetail,
      );

      message.success(t("function-created-successfully"));
    },
    onError: (error) => {
      console.error(error.message);
      message.error(error.message);
    },
  });
};
