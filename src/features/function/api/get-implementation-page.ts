import type {
  ImplementationDetail,
  ImplementationFilter,
} from "@/features/function/types/implementation-types.ts";
import type { PageRequest, ResponseBody, ResponsePage } from "@/types/api";
import { sortToSearchParam } from "@/utils/api-utils";

import { functionAxios } from "./axios-config";

export const getImplementationPage = async (
  functionId: string,
  filter: ImplementationFilter = {},
  pageRequest: PageRequest = {},
): Promise<ResponsePage<ImplementationDetail>> => {
  const params = {
    keyword: filter.keyword || "",
    page: pageRequest.page || 0,
    size: pageRequest.size || 20,
    sort: pageRequest.sorts?.map(sortToSearchParam),
  };

  const response = await functionAxios.get<
    ResponseBody<ResponsePage<ImplementationDetail>>
  >(`/functions/${functionId}/implementations`, { params });
  return response.data.data;
};
