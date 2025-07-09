import type { FunctionCreate, FunctionDetail } from "@/features/function/types";
import { useMessage } from "@/hooks/use-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { createFunction } from "../api/create-function";
import { functionQueryKeys } from "./function-query-keys";

export const useCreateFunctionMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const message = useMessage();

  return useMutation({
    mutationFn: ({ data }: { data: FunctionCreate }) => createFunction(data),
    onSuccess: (functionDetail: FunctionDetail) => {
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
