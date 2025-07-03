import type { FunctionDetailDto } from "@/features/function/types";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const getFunctionDetail = async (
  functionId: string,
): Promise<FunctionDetailDto> => {
  const response = await functionAxios.get<ResponseBody<FunctionDetailDto>>(
    `/functions/${functionId}`,
  );
  return response.data.data;
};
