import { useQuery } from "@tanstack/react-query";

import { getFunctionDetail } from "../api/get-function-detail";
import { functionQueryKeys } from "./function-query-keys";

export const useGetFunctionDetailQuery = (functionId: string) => {
  return useQuery({
    queryKey: functionQueryKeys.detail(functionId),
    queryFn: () => getFunctionDetail(functionId),
    enabled: !!functionId,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};
