import type { UploadChangeParam, UploadFile } from "antd/es/upload";

export const readUploadFileAsText = async (
  info: UploadChangeParam<UploadFile<File>>,
): Promise<string> => {
  if (info.file.status === "error") {
    console.error(info.file.error);
    throw new Error("Failed to upload file");
  }

  const file = info.fileList[0];

  if (!file) {
    console.error("No file found");
    throw new Error("No file found");
  }

  const fileObj = file.originFileObj;

  if (!fileObj) {
    console.error("No file object found");
    throw new Error("No file object found");
  }

  return await fileObj.text();
};
