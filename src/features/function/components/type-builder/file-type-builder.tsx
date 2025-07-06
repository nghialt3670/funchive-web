import type { FileType } from "@/features/function/types";
import { UploadOutlined } from "@ant-design/icons";
import { Box, useMediaQuery } from "@mui/material";
import { Button, Input, Typography, Upload, message } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

import { DefaultValueLabel } from "./default-value-label";
import { useDefaultValue } from "./use-default-value";

const { Paragraph, Text } = Typography;

interface FileTypeBuilderProps {
  value?: FileType;
  onChange?: (type: FileType) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const FileTypeBuilder: React.FC<FileTypeBuilderProps> = ({
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const { t } = useTranslation();
  const extension = value?.extension || "";
  const { hasDefaultValue, handleHasDefaultValueChange, isDisabled } =
    useDefaultValue({
      value,
      onChange,
      disabled,
    });
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const handleExtensionChange = (newExtension: string) => {
    onChange?.({
      name: "FILE",
      description: value?.description,
      extension: newExtension || "",
      defaultValue: value?.defaultValue,
    });
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        onChange?.({
          name: "FILE",
          description: value?.description,
          extension: value?.extension || "",
          defaultValue: {
            type: "FILE",
            id: file.name,
            data: {
              filename: file.name,
              mimeType: file.type,
            },
          },
        });
        message.success("File uploaded successfully");
      } catch (error) {
        message.error("Failed to read file");
      }
    };
    reader.readAsText(file);
    return false; // Prevent default upload behavior
  };

  return (
    <Box
      display="flex"
      flexDirection={isTablet ? "column" : "row"}
      width="100%"
      gap={1}
    >
      <Box display="flex" flexDirection="column" width="100%" gap={1}>
        <Text>{t("file-extension")}</Text>
        <Input
          placeholder={t("file-extension-placeholder")}
          value={extension}
          onChange={(e) => handleExtensionChange(e.target.value)}
          disabled={isDisabled}
          readOnly={readOnly}
        />
      </Box>
      {readOnly ? (
        hasDefaultValue && (
          <Box display="flex" flexDirection="row" gap={1}>
            <Paragraph>{value?.defaultValue?.data as string}</Paragraph>
          </Box>
        )
      ) : (
        <Box display="flex" flexDirection="column" width="100%" gap={1}>
          <DefaultValueLabel
            checked={hasDefaultValue}
            onChange={handleHasDefaultValueChange}
            disabled={isDisabled}
            readOnly={readOnly}
          />
          {hasDefaultValue && (
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              accept={extension}
              disabled={isDisabled || !hasDefaultValue}
            >
              <Button
                icon={<UploadOutlined />}
                disabled={isDisabled || !hasDefaultValue}
              >
                {t("upload-default-file")}
              </Button>
            </Upload>
          )}
        </Box>
      )}
    </Box>
  );
};
