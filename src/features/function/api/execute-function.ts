import type { FunctionDetail } from "@/features/function/types/function-types.ts";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const executeFunction = async (
  functionId: string,
  implementationId: string,
  inputValueId: string,
): Promise<FunctionDetail> => {
  const response = await functionAxios.post<ResponseBody<FunctionDetail>>(
    `/functions/${functionId}/implementations/${implementationId}/execute`,
    null,
    {
      params: { inputValueId },
    },
  );
  return response.data.data;
};
