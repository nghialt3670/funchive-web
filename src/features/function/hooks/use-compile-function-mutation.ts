import { useMessage } from "@/hooks/use-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { compileFunction } from "../api/compile-function.ts";
import { functionQueryKeys } from "./function-query-keys";

export const useCompileFunctionMutation = () => {
  const queryClient = useQueryClient();
  const message = useMessage();

  return useMutation({
    mutationFn: ({
      functionId,
      implementationId,
    }: {
      functionId: string;
      implementationId: string;
    }) => compileFunction(functionId, implementationId),
    onSuccess: (updatedFunction, variables) => {
      queryClient.setQueryData(
        functionQueryKeys.detail(variables.functionId),
        updatedFunction,
      );

      queryClient.invalidateQueries({
        queryKey: functionQueryKeys.lists(),
      });
    },
    onError: (error) => {
      console.error(error.message);
      message.error(error.message);
    },
  });
};
