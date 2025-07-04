import type { FunctionDetailDto } from "@/features/function/types/function-types.ts";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const executeFunction = async (
  functionId: string,
  implementationId: string,
  inputValueId: string,
): Promise<FunctionDetailDto> => {
  const response = await functionAxios.post<ResponseBody<FunctionDetailDto>>(
    `/functions/${functionId}/implementations/${implementationId}/execute`,
    null,
    {
      params: { inputValueId },
    },
  );
  return response.data.data;
};
