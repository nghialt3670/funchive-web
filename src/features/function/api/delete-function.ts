import { functionAxios } from "./axios-config";

export const deleteFunction = async (functionId: string): Promise<void> => {
  await functionAxios.delete(`/functions/${functionId}`);
};
