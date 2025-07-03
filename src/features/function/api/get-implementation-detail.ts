import type { ImplementationDetail } from "@/features/function/types/implementation-types.ts";
import type { ResponseBody } from "@/types/api";

import { functionAxios } from "./axios-config";

export const getImplementationDetail = async (
  functionId: string,
  implementationId: string,
): Promise<ImplementationDetail> => {
  const response = await functionAxios.get<ResponseBody<ImplementationDetail>>(
    `/functions/${functionId}/implementations/${implementationId}`,
  );
  return response.data.data;
};
