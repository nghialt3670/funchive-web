import type { FunctionDetail } from "@/features/function/types";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const getFunctionDetail = async (
  functionId: string,
): Promise<FunctionDetail> => {
  const response = await functionAxios.get<ResponseBody<FunctionDetail>>(
    `/functions/${functionId}`,
  );
  return response.data.data;
};
