import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import { compileImplementation } from "../api/compile-implementation";
import { functionQueryKeys } from "./function-query-keys";

export const useImplementationCompileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      functionId,
      implementationId,
    }: {
      functionId: string;
      implementationId: string;
    }) => compileImplementation(functionId, implementationId),
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
