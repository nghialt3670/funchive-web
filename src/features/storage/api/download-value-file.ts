import { storageAxios } from "./axios-config";

export const downloadValueFile = async (valueId: string): Promise<File> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const response = await storageAxios.get(`/values/${valueId}/download`, {
    responseType: "blob",
  });

  const contentDisposition = response.headers["content-disposition"];
  let filename = "downloaded-file";

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
    if (filenameMatch) {
      filename = filenameMatch[1];
    }
  }

  const contentType =
    response.headers["content-type"] || "application/octet-stream";
  return new File([response.data], filename, { type: contentType });
};
