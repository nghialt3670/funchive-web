import type { FileType } from "@/features/function/types";
import { UploadOutlined } from "@ant-design/icons";
import { Box, useMediaQuery } from "@mui/material";
import { Button, Form, Input, Typography, Upload, message } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

import { DefaultValueLabel } from "./default-value-label";
import { useDefaultValue } from "./use-default-value";

const { Paragraph } = Typography;

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
      <Form.Item
        label={t("file-extension")}
        style={{ width: "100%", maxWidth: "200px", marginBottom: 0 }}
      >
        <Input
          placeholder={t("file-extension-placeholder")}
          value={extension}
          onChange={(e) => handleExtensionChange(e.target.value)}
          disabled={isDisabled}
          readOnly={readOnly}
        />
      </Form.Item>

      {readOnly ? (
        hasDefaultValue && (
          <Box display="flex" flexDirection="row" gap={1}>
            <Paragraph>{value?.defaultValue?.data as string}</Paragraph>
          </Box>
        )
      ) : (
        <Form.Item
          label={
            <DefaultValueLabel
              checked={hasDefaultValue}
              onChange={handleHasDefaultValueChange}
              disabled={isDisabled}
            />
          }
          style={{ width: "100%", marginBottom: hasDefaultValue ? 0 : -40 }}
        >
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
        </Form.Item>
      )}
    </Box>
  );
};
