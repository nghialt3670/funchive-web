import type {
  FunctionDetail,
  FunctionUpdate,
} from "@/features/function/types";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const updateFunction = async (
  functionId: string,
  data: FunctionUpdate,
): Promise<FunctionDetail> => {
  const response = await functionAxios.put<ResponseBody<FunctionDetail>>(
    `/functions/${functionId}`,
    data,
  );
  return response.data.data;
};
