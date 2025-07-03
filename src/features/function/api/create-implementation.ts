import type {
  ImplementationCreate,
  ImplementationDetail,
} from "@/features/function/types/implementation-types.ts";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const createImplementation = async (
  functionId: string,
  data: ImplementationCreate,
): Promise<ImplementationDetail> => {
  const response = await functionAxios.post<ResponseBody<ImplementationDetail>>(
    `/functions/${functionId}/implementations`,
    data,
  );
  return response.data.data;
};
