import type { FileValue } from "@/features/function/types";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Typography, Upload, type UploadFile } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export interface FileDefaultValueFieldProps {
  extension: string;
  value?: FileValue;
  onChange?: (value: FileValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const FileDefaultValueField: FC<FileDefaultValueFieldProps> = ({
  extension,
  value,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation();

  const [fileDefaultValue, setFileDefaultValue] = useState<
    FileValue | undefined
  >(value);

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const newFileDefaultValue = {
      typeName: "FILE",
      data: info.file.response?.data,
    } as FileValue;
    setFileDefaultValue(newFileDefaultValue);
    onChange?.(newFileDefaultValue);
  };

  return (
    <Upload onChange={handleChange} disabled={disabled} accept={extension}>
      <Button icon={<UploadOutlined />}>{t("upload-file")}</Button>
      {fileDefaultValue?.data && <Text>{fileDefaultValue.data.filename}</Text>}
    </Upload>
  );
};
