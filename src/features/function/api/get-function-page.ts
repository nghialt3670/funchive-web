import type {
  FunctionDetail,
  FunctionFilter,
} from "@/features/function/types";
import type { PageRequest, ResponseBody, ResponsePage } from "@/types/api";
import { sortToSearchParam } from "@/utils/api-utils";

import { functionAxios } from "./axios-config";

export const getFunctionPage = async (
  filter: FunctionFilter = {},
  pageRequest: PageRequest = {},
): Promise<ResponsePage<FunctionDetail>> => {
  const params = {
    keyword: filter.keyword || "",
    language: filter.language || "",
    page: pageRequest.page || 0,
    size: pageRequest.size || 20,
    sort: pageRequest.sorts?.map(sortToSearchParam),
  };

  const response = await functionAxios.get<
    ResponseBody<ResponsePage<FunctionDetail>>
  >("/functions", { params });
  return response.data.data;
};
