import type { BooleanType } from "@/features/function/types";
import { Box } from "@mui/material";
import { Form, Select } from "antd";
import { Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

import { DefaultValueLabel } from "./default-value-label";
import { useDefaultValue } from "./use-default-value";

const { Paragraph } = Typography;

interface BooleanTypeBuilderProps {
  value?: BooleanType;
  onChange?: (type: BooleanType) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const BooleanTypeBuilder: React.FC<BooleanTypeBuilderProps> = ({
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

  const handleDefaultValueChange = (newDefaultValue: boolean) => {
    onChange?.({
      name: "BOOLEAN",
      description: value?.description,
      defaultValue: newDefaultValue
        ? {
            type: "BOOLEAN",
            data: newDefaultValue,
          }
        : undefined,
    });
  };

  return readOnly ? (
    hasDefaultValue && (
      <Box display="flex" flexDirection="row" gap={1}>
        <Paragraph>{value?.defaultValue?.data as boolean}</Paragraph>
      </Box>
    )
  ) : (
    <Form.Item
      label={
        <DefaultValueLabel
          checked={hasDefaultValue}
          onChange={handleHasDefaultValueChange}
          disabled={isDisabled}
          readOnly={readOnly}
        />
      }
      style={{
        width: "100%",
        maxWidth: "200px",
        marginBottom: hasDefaultValue ? 0 : -40,
      }}
    >
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
    </Form.Item>
  );
};
