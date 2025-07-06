import type { FunctionDetail } from "@/features/function/types/function-types.ts";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const compileFunction = async (
  functionId: string,
  implementationId: string,
): Promise<FunctionDetail> => {
  const response = await functionAxios.post<ResponseBody<FunctionDetail>>(
    `/functions/${functionId}/implementations/${implementationId}/compile`,
  );
  return response.data.data;
};
