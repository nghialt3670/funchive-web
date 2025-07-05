import type { FileType } from "@/features/function/types";
import { UploadOutlined } from "@ant-design/icons";
import { Box, useMediaQuery } from "@mui/material";
import { Button, Form, Input, Switch, Typography, Upload, message } from "antd";
import { omit } from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface FileTypeBuilderProps {
  value?: FileType;
  onChange?: (type: FileType) => void;
  disabled?: boolean;
}

export const FileTypeBuilder: React.FC<FileTypeBuilderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const extension = value?.extension || "";
  const [hasDefaultValue, setHasDefaultValue] = useState(false);
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

  const handleHasDefaultValueChange = (checked: boolean) => {
    setHasDefaultValue(checked);
    if (!checked) {
      onChange?.(omit(value, "defaultValue"));
    }
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
          disabled={disabled}
        />
      </Form.Item>

      <Form.Item
        label={
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            justifyContent="center"
            alignItems="center"
          >
            <Text style={{ width: "fit-content", textWrap: "nowrap" }}>
              {t("default-value")}
            </Text>
            <Switch
              size="small"
              checked={hasDefaultValue}
              onChange={handleHasDefaultValueChange}
              disabled={disabled}
            />
          </Box>
        }
        style={{ width: "100%", marginBottom: hasDefaultValue ? 0 : -40 }}
      >
        {hasDefaultValue && (
          <Upload
            beforeUpload={handleFileUpload}
            showUploadList={false}
            accept={extension}
            disabled={disabled || !hasDefaultValue}
          >
            <Button
              icon={<UploadOutlined />}
              disabled={disabled || !hasDefaultValue}
            >
              {t("upload-default-file")}
            </Button>
          </Upload>
        )}
      </Form.Item>
    </Box>
  );
};
