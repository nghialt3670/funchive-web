import { functionAxios } from "./axios-config";

export const deleteImplementation = async (
  functionId: string,
  implementationId: string,
): Promise<void> => {
  await functionAxios.delete(
    `/functions/${functionId}/implementations/${implementationId}`,
  );
};
