import type { BooleanType } from "@/features/function/types";
import { Box } from "@mui/material";
import { Form, Select, Switch, Typography } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface BooleanTypeBuilderProps {
  value?: BooleanType;
  onChange?: (type: BooleanType) => void;
  disabled?: boolean;
  readonly?: boolean;
}

export const BooleanTypeBuilder: React.FC<BooleanTypeBuilderProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation();
  const [hasDefaultValue, setHasDefaultValue] = useState(false);

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
            onChange={() => setHasDefaultValue(!hasDefaultValue)}
            disabled={disabled}
          />
        </Box>
      }
      style={{ width: "100%", maxWidth: "200px", marginBottom: 0 }}
    >
      <Select
        options={[
          { label: t("true"), value: true },
          { label: t("false"), value: false },
        ]}
        value={value?.defaultValue?.data as boolean}
        onChange={handleDefaultValueChange}
        defaultValue={false}
        disabled={disabled || !hasDefaultValue}
        style={{ width: "100%" }}
      />
    </Form.Item>
  );
};
