import type { FunctionFilter } from "@/features/function/types";
import { usePageSearchParams } from "@/hooks/use-page-search-params";
import { useQuery } from "@tanstack/react-query";

import { getFunctionPage } from "../api/get-function-page";
import { functionQueryKeys } from "./function-query-keys";

export const useGetFunctionPageQuery = (filter: FunctionFilter = {}) => {
  const { page, size, sorts } = usePageSearchParams();

  return useQuery({
    queryKey: functionQueryKeys.list(filter, { page, size, sorts }),
    queryFn: () => getFunctionPage(filter, { page, size, sorts }),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
