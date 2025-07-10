import { type ValueFileMetadata } from "../types";
import { storageAxios } from "./axios-config";

export const getValueFileMetadata = async (
  valueId: string,
): Promise<ValueFileMetadata> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const response = await storageAxios.get(`/values/${valueId}`);
  return response.data.data;
};
