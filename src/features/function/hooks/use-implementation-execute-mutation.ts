import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import { executeImplementation } from "../api/execute-implementation";
import { functionQueryKeys } from "./function-query-keys";

export const useImplementationExecuteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      functionId,
      implementationId,
      inputValueId,
    }: {
      functionId: string;
      implementationId: string;
      inputValueId: string;
    }) => executeImplementation(functionId, implementationId, inputValueId),
    onSuccess: (updatedFunction, variables) => {
      // Update the function detail with the latest execution results
      queryClient.setQueryData(
        functionQueryKeys.detail(variables.functionId),
        updatedFunction,
      );

      queryClient.invalidateQueries({
        queryKey: functionQueryKeys.lists(),
      });

      message.success("Implementation executed successfully!");
    },
    onError: (error: any) => {
      message.error(
        `Failed to execute implementation: ${error.response?.data?.message || error.message}`,
      );
    },
  });
};
