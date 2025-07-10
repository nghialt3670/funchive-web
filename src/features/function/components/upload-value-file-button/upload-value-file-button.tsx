import { useUploadValueFile } from "@/features/storage/hooks";
import { useMessage } from "@/hooks/use-message";
import { catchError } from "@/utils/catch-error";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Upload, type UploadFile } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import { to } from "await-to-js";
import { type FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface UploadValueFileButtonProps {
  onFileUploaded?: (response: any) => void;
  onFileRemoved?: () => void;
  validateFile?: (content: string) => void;
  acceptedFileTypes?: string;
  uploadButtonText?: string;
  disabled?: boolean;
}

export const UploadValueFileButton: FC<UploadValueFileButtonProps> = ({
  onFileUploaded,
  onFileRemoved,
  validateFile,
  acceptedFileTypes,
  uploadButtonText,
  disabled,
}) => {
  const { t } = useTranslation();
  const message = useMessage();
  const [file, setFile] = useState<UploadFile<File> | null>(null);
  const {
    mutate: uploadValueFile,
    isPending: isUploadPending,
    isSuccess: isUploadSuccess,
    data: uploadValueResponse,
  } = useUploadValueFile();

  useEffect(() => {
    if (isUploadSuccess && uploadValueResponse) {
      onFileUploaded?.(uploadValueResponse);
    }
  }, [isUploadSuccess, uploadValueResponse, onFileUploaded]);

  const handleFileChange = async (
    info: UploadChangeParam<UploadFile<File>>,
  ) => {
    if (info.file.status === "error") {
      message.error(t("failed-to-upload-file"));
      return;
    }

    const file = info.fileList[0]?.originFileObj;

    if (!file) {
      message.error(t("failed-to-upload-file"));
      return;
    }

    const [readError, content] = await to(file.text());

    if (readError) {
      console.error(readError.message);
      message.error(t("failed-to-read-file"));
      return;
    }

    if (validateFile) {
      const [validateError] = catchError(() => validateFile(content));
      if (validateError) {
        console.error(validateError.message);
        message.error(t("json-file-not-match-schema"));
        return;
      }
    }

    uploadValueFile({ file });
  };

  const handleRemoveFile = () => {
    setFile(null);
    onFileRemoved?.();
  };

  const fileList = file ? [file] : [];

  const defaultUploadText = t("upload-file");

  return (
    <>
      {file && isUploadSuccess ? (
        <Button
          icon={
            <Button
              icon={<DeleteOutlined />}
              onClick={handleRemoveFile}
              size="small"
              loading={isUploadPending}
            />
          }
          loading={isUploadPending}
          disabled={disabled}
        >
          {file.name}
        </Button>
      ) : (
        <Upload<File>
          beforeUpload={() => false}
          onChange={handleFileChange}
          disabled={disabled}
          accept={acceptedFileTypes}
          multiple={false}
          fileList={fileList}
          showUploadList={false}
          maxCount={1}
        >
          <Button
            icon={<UploadOutlined />}
            loading={isUploadPending}
            disabled={disabled}
          >
            {uploadButtonText || defaultUploadText}
          </Button>
        </Upload>
      )}
    </>
  );
};
