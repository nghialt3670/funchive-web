import { useUploadValueFile } from "@/features/storage/hooks";
import { useMessage } from "@/hooks/use-message";
import { catchError } from "@/utils/catch-error";
import {
  DeleteOutlined,
  RedoOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Stack } from "@mui/material";
import { Button, Tooltip, Typography, Upload, type UploadFile } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import { to } from "await-to-js";
import { type FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export interface UploadValueFileButtonProps {
  onFileUploaded?: (response: any) => void;
  onFileRemoved?: () => void;
  validateFile?: (content: string) => void;
  acceptedFileTypes?: string;
  uploadButtonText?: string;
  disabled?: boolean;
  showFileName?: boolean;
}

export const UploadValueFileButton: FC<UploadValueFileButtonProps> = ({
  onFileUploaded,
  onFileRemoved,
  validateFile,
  acceptedFileTypes = ".json",
  uploadButtonText,
  disabled,
  showFileName = true,
}) => {
  const { t } = useTranslation();
  const message = useMessage();
  const [file, setFile] = useState<UploadFile<File> | null>(null);
  const {
    mutate: uploadValueFile,
    isPending: isUploadPending,
    isSuccess: isUploadSuccess,
    isError: isUploadError,
    data: uploadValueResponse,
  } = useUploadValueFile();

  useEffect(() => {
    if (isUploadSuccess && uploadValueResponse) {
      onFileUploaded?.(uploadValueResponse);
    }
  }, [isUploadSuccess, uploadValueResponse, onFileUploaded]);

  const handleFileChange = async (info: UploadChangeParam<UploadFile<File>>) => {
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

    // Validate file content if validation function is provided
    if (validateFile) {
      const [validateError] = catchError(() => validateFile(content));
      if (validateError) {
        console.error(validateError.message);
        message.error(t("json-file-not-match-schema"));
        return;
      }
    }

    setFile(info.file);
    uploadValueFile({
      file: info.file.originFileObj as File,
    });
  };

  const handleRemoveFile = () => {
    setFile(null);
    onFileRemoved?.();
  };

  const handleRetryUpload = () => {
    if (file?.originFileObj) {
      uploadValueFile({
        file: file.originFileObj as File,
      });
    }
  };

  const fileList = file ? [file] : [];

  const defaultUploadText = acceptedFileTypes.includes("json") 
    ? t("upload-json-file") 
    : t("upload-text-file");

  return (
    <>
      {file && showFileName ? (
        <Stack 
          direction="row" 
          alignItems="center" 
          gap={1} 
          border="1px solid #e0e0e0" 
          p={1} 
          borderRadius={4}
        >
          <Text strong>{file.name}</Text>
          <Tooltip title={t("remove-file")}>
            <Button
              icon={<DeleteOutlined />}
              onClick={handleRemoveFile}
              size="small"
              loading={isUploadPending}
            />
          </Tooltip>
          {isUploadError && (
            <Tooltip title={t("retry-upload")}>
              <Button
                icon={<RedoOutlined />}
                onClick={handleRetryUpload}
                size="small"
                loading={isUploadPending}
              />
            </Tooltip>
          )}
        </Stack>
      ) : (
        <Upload<File>
          beforeUpload={() => false}
          onChange={handleFileChange}
          disabled={disabled}
          accept={acceptedFileTypes}
          multiple={false}
          fileList={fileList}
          showUploadList={false}
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
