import type {
  FunctionDetailDto,
  FunctionUpdateDto,
} from "@/features/function/types";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const updateFunction = async (
  functionId: string,
  data: FunctionUpdateDto,
): Promise<FunctionDetailDto> => {
  const response = await functionAxios.put<ResponseBody<FunctionDetailDto>>(
    `/functions/${functionId}`,
    data,
  );
  return response.data.data;
};
