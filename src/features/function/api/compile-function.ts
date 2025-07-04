import type { FunctionDetailDto } from "@/features/function/types/function-types.ts";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const compileFunction = async (
  functionId: string,
  implementationId: string,
): Promise<FunctionDetailDto> => {
  const response = await functionAxios.post<ResponseBody<FunctionDetailDto>>(
    `/functions/${functionId}/implementations/${implementationId}/compile`,
  );
  return response.data.data;
};
