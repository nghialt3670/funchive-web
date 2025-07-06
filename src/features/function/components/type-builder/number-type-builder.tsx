import type { NumberType } from "@/features/function/types";
import { Box } from "@mui/material";
import { InputNumber, Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

import { DefaultValueLabel } from "./default-value-label";
import { useDefaultValue } from "./use-default-value";

const { Paragraph } = Typography;

interface NumberTypeBuilderProps {
  value?: NumberType;
  onChange?: (type: NumberType) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const NumberTypeBuilder: React.FC<NumberTypeBuilderProps> = ({
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

  return readOnly ? (
    hasDefaultValue && (
      <Box display="flex" flexDirection="row" gap={1}>
        <Paragraph>{value?.defaultValue?.data as number}</Paragraph>
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
        <InputNumber
          placeholder={t("default-value-placeholder")}
          value={value?.defaultValue?.data as number}
          onChange={handleDefaultValueChange}
          disabled={isDisabled || !hasDefaultValue}
          readOnly={readOnly}
          style={{ width: "100%" }}
          className={
            isDisabled || !hasDefaultValue ? "disabled-input-placeholder" : ""
          }
        />
      )}
    </Box>
  );
};
