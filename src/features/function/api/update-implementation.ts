import type {
  ImplementationDetail,
  ImplementationUpdate,
} from "@/features/function/types/implementation-types.ts";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const updateImplementation = async (
  functionId: string,
  implementationId: string,
  data: ImplementationUpdate,
): Promise<ImplementationDetail> => {
  const response = await functionAxios.put<ResponseBody<ImplementationDetail>>(
    `/functions/${functionId}/implementations/${implementationId}`,
    data,
  );
  return response.data.data;
};
