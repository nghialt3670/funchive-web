import type { BooleanType } from "@/features/function/types";
import { Stack } from "@mui/material";
import { Select } from "antd";
import { Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

import { DefaultValueLabel } from "./default-value-label";
import { useDefaultValue } from "./use-default-value";

const { Paragraph } = Typography;

interface BooleanTypeBuilderProps {
  value?: BooleanType;
  defaultValue?: BooleanType;
  onChange?: (type: BooleanType) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const BooleanTypeBuilder: React.FC<BooleanTypeBuilderProps> = ({
  value,
  defaultValue,
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

  if (!value && defaultValue) {
    onChange?.(defaultValue);
  }

  const handleDefaultValueChange = (newDefaultValue: boolean) => {
    onChange?.({
      name: "BOOLEAN",
      description: value?.description,
      defaultValue: newDefaultValue
        ? {
            typeName: "BOOLEAN",
            data: newDefaultValue,
          }
        : undefined,
      useDefaultValue: hasDefaultValue,
    });
  };

  return readOnly ? (
    hasDefaultValue && (
      <Paragraph>{value?.defaultValue?.data as boolean}</Paragraph>
    )
  ) : (
    <Stack direction="column" width="100%" gap={1}>
      <DefaultValueLabel
        checked={hasDefaultValue}
        onChange={handleHasDefaultValueChange}
        disabled={isDisabled}
        readOnly={readOnly}
      />
      {hasDefaultValue && (
        <Select
          options={[
            { label: t("true"), value: true },
            { label: t("false"), value: false },
          ]}
          value={value?.defaultValue?.data as boolean}
          onChange={handleDefaultValueChange}
          defaultValue={false}
          disabled={isDisabled || !hasDefaultValue}
          style={{ width: "100%" }}
        />
      )}
    </Stack>
  );
};
