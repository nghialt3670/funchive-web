import type {
  FunctionCreate,
  FunctionDetail,
} from "@/features/function/types";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const createFunction = async (
  data: FunctionCreate,
): Promise<FunctionDetail> => {
  const response = await functionAxios.post<ResponseBody<FunctionDetail>>(
    "/functions",
    data,
  );
  return response.data.data;
};
