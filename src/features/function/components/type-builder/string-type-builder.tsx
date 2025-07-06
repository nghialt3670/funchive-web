import type { StringType } from "@/features/function/types";
import { UploadOutlined } from "@ant-design/icons";
import { Box, useMediaQuery } from "@mui/material";
import { Button, Input, Tooltip, Typography, Upload } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

import { DefaultValueLabel } from "./default-value-label";
import { useDefaultValue } from "./use-default-value";

const { TextArea } = Input;
const { Paragraph } = Typography;
interface StringTypeBuilderProps {
  value?: StringType;
  onChange?: (type: StringType) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const StringTypeBuilder: React.FC<StringTypeBuilderProps> = ({
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const { t } = useTranslation();
  const { hasDefaultValue, handleHasDefaultValueChange, isDisabled } =
    useDefaultValue({
      value,
      onChange,
      disabled,
    });
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

  return readOnly ? (
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
        <Box display="flex" flexDirection="row" gap={1}>
          <TextArea
            placeholder={t("default-value-placeholder")}
            value={value?.defaultValue?.data as string}
            onChange={(e) => handleDefaultValueChange(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 5 }}
            disabled={isDisabled || !hasDefaultValue}
            readOnly={readOnly}
          />
          <Upload
            disabled={isDisabled || !hasDefaultValue}
            showUploadList={false}
            accept=".txt"
          >
            {isTablet ? (
              <Tooltip title={t("upload-text-file")}>
                <Button
                  icon={<UploadOutlined />}
                  disabled={isDisabled || !hasDefaultValue}
                />
              </Tooltip>
            ) : (
              <Button
                icon={<UploadOutlined />}
                disabled={isDisabled || !hasDefaultValue}
              >
                {t("upload-text-file")}
              </Button>
            )}
          </Upload>
        </Box>
      )}
    </Box>
  );
};
