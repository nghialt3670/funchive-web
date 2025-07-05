import type { NumberType } from "@/features/function/types";
import { Box } from "@mui/material";
import { Form, InputNumber, Switch, Typography } from "antd";
import { omit } from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface NumberTypeBuilderProps {
  value?: NumberType;
  onChange?: (type: NumberType) => void;
  disabled?: boolean;
  readonly?: boolean;
}

export const NumberTypeBuilder: React.FC<NumberTypeBuilderProps> = ({
  value,
  onChange,
  disabled = false,
  readonly = false,
}) => {
  const { t } = useTranslation();
  const [hasDefaultValue, setHasDefaultValue] = useState(false);

  const handleDefaultValueChange = (newDefaultValue: number | null) => {
    onChange?.({
      name: "NUMBER",
      description: value?.description,
      defaultValue: newDefaultValue
        ? {
            type: "NUMBER",
            data: newDefaultValue,
          }
        : undefined,
    });
  };

  const handleHasDefaultValueChange = (checked: boolean) => {
    setHasDefaultValue(checked);
    if (!checked) {
      onChange?.(omit(value, "defaultValue"));
    }
  };

  return (
    <Box display="flex" flexDirection="row" width="100%" gap={1}>
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
        style={{
          width: "100%",
          maxWidth: "200px",
          marginBottom: hasDefaultValue ? 0 : -40,
        }}
      >
        {hasDefaultValue && (
          <InputNumber
            placeholder={t("default-value-placeholder")}
            value={value?.defaultValue?.data as number}
            onChange={handleDefaultValueChange}
            disabled={disabled || !hasDefaultValue}
            readOnly={readonly}
            style={{ width: "100%" }}
            className={
              disabled || !hasDefaultValue ? "disabled-input-placeholder" : ""
            }
          />
        )}
      </Form.Item>
    </Box>
  );
};
