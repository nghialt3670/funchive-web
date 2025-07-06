import type { FunctionFilter } from "@/features/function/types";
import type { PageRequest } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

import { getFunctionPage } from "../api/get-function-page";
import { functionQueryKeys } from "./function-query-keys";

export const useGetFunctionPageQuery = (
  filter: FunctionFilter,
  pageRequest: PageRequest,
) => {
  return useQuery({
    queryKey: functionQueryKeys.list(filter, pageRequest),
    queryFn: () => getFunctionPage(filter, pageRequest),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
