import type {
  FunctionCreateDto,
  FunctionDetailDto,
} from "@/features/function/types";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const createFunction = async (
  data: FunctionCreateDto,
): Promise<FunctionDetailDto> => {
  const response = await functionAxios.post<ResponseBody<FunctionDetailDto>>(
    "/functions",
    data,
  );
  return response.data.data;
};
