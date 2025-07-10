import { useUploadValueFile } from "@/features/storage/hooks/use-upload-value-file";
import { useMessage } from "@/hooks/use-message";
import { UploadOutlined } from "@ant-design/icons";
import { Stack } from "@mui/material";
import { Button, Typography, Upload, type UploadFile } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import { type FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { FileValue } from "../../types";
import { useUpdateValueFileMutation } from "@/features/storage/hooks/use-update-value-file-mutation";

const { Text } = Typography;

const DEFAULT_FILE_VALUE: FileValue = {
  typeName: "FILE",
  id: "",
  data: {
    filename: "",
    mimeType: "",
  },
};

export interface FileValueBuilderProps {
  value?: FileValue;
  onChange?: (value: FileValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const FileValueBuilder: FC<FileValueBuilderProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation();
  const message = useMessage();
  const [fileValue, setFileValue] = useState<FileValue>(
    value ?? DEFAULT_FILE_VALUE,
  );
  const [uploadFile, setUploadFile] = useState<UploadFile<File>>();
  const {
    mutate: uploadValueFile,
    isPending: isUploadFilePending,
    isSuccess: isUploadFileSuccess,
    data: uploadValueResponse,
  } = useUploadValueFile();
  const {
    mutate: updateValueFile,
    isPending: isUpdateFilePending,
    isSuccess: isUpdateFileSuccess,
    data: updateValueResponse,
  } = useUpdateValueFileMutation();

  useEffect(() => {
    if (value !== fileValue) {
      onChange?.(fileValue);
    }
  }, [fileValue]);

  useEffect(() => {
    if (isUploadFileSuccess) {
      setFileValue({
        ...fileValue,
        id: uploadValueResponse.id,
        data: {
          filename: uploadValueResponse.name,
          mimeType: uploadValueResponse.contentType,
        },
      });
    }
  }, [isUploadFileSuccess]);

  useEffect(() => {
    if (isUpdateFileSuccess) {
      message.success(t("file-updated-successfully"));
      setFileValue({
        ...fileValue,
        id: updateValueResponse.id,
        data: {
          filename: updateValueResponse.name,
          mimeType: updateValueResponse.contentType,
        },
      });
    }
  }, [isUpdateFileSuccess]);

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

    if (uploadFile) {
      updateValueFile({ id: fileValue.id, file });
      return;
    }

    setUploadFile(info.fileList[0]);
    uploadValueFile({ file });
  };

  const fileList = uploadFile ? [uploadFile] : [];

  return (
    <Stack direction="column" gap={1}>
      <Text>{fileValue?.data?.filename}</Text>
      <Upload
        fileList={fileList}
        onChange={handleFileChange}
        disabled={disabled}
        beforeUpload={() => false}
      >
        <Button
          icon={<UploadOutlined />}
          loading={isUploadFilePending || isUpdateFilePending}
          disabled={disabled}
        >
          {t("upload-file")}
        </Button>
      </Upload>
    </Stack>
  );
};
