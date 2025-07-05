import type { StringType } from "@/features/function/types";
import { UploadOutlined } from "@ant-design/icons";
import { Box, useMediaQuery } from "@mui/material";
import { Button, Form, Input, Switch, Tooltip, Typography, Upload } from "antd";
import { omit } from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;
const { Text } = Typography;

interface StringTypeBuilderProps {
  value?: StringType;
  onChange?: (type: StringType) => void;
  disabled?: boolean;
  readonly?: boolean;
}

export const StringTypeBuilder: React.FC<StringTypeBuilderProps> = ({
  value,
  onChange,
  disabled = false,
  readonly = false,
}) => {
  const { t } = useTranslation();
  const [hasDefaultValue, setHasDefaultValue] = useState(false);
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const handleDefaultValueChange = (newDefaultValue: string) => {
    onChange?.({
      name: "STRING",
      description: value?.description,
      defaultValue: {
        type: "STRING",
        data: newDefaultValue,
      },
    });
  };

  const handleHasDefaultValueChange = (checked: boolean) => {
    setHasDefaultValue(checked);
    if (!checked) {
      onChange?.(omit(value, "defaultValue"));
    }
  };

  return (
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
        <Box display="flex" flexDirection="row" gap={1}>
          <TextArea
            placeholder={t("default-value-placeholder")}
            value={value?.defaultValue?.data as string}
            onChange={(e) => handleDefaultValueChange(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 5 }}
            disabled={disabled || !hasDefaultValue}
            readOnly={readonly}
          />
          <Upload
            disabled={disabled || !hasDefaultValue}
            showUploadList={false}
            accept=".txt"
          >
            {isTablet ? (
              <Tooltip title={t("upload-text-file")}>
                <Button
                  icon={<UploadOutlined />}
                  disabled={disabled || !hasDefaultValue}
                />
              </Tooltip>
            ) : (
              <Button
                icon={<UploadOutlined />}
                disabled={disabled || !hasDefaultValue}
              >
                {t("upload-text-file")}
              </Button>
            )}
          </Upload>
        </Box>
      )}
    </Form.Item>
  );
};
