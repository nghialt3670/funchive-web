import type { BooleanValue } from "@/features/function/types";
import { Collapse, Select, Typography } from "antd";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export interface BooleanDefaultValueFieldProps {
  value?: BooleanValue;
  onChange?: (value: BooleanValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const BooleanDefaultValueField: FC<BooleanDefaultValueFieldProps> = ({
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const { t } = useTranslation();
  const [booleanDefaultValue, setBooleanDefaultValue] = useState<
    BooleanValue | undefined
  >(value);

  const handleChange = (value: boolean) => {
    const newBooleanDefaultValue = {
      typeName: "BOOLEAN",
      data: value,
    } as BooleanValue;
    setBooleanDefaultValue(newBooleanDefaultValue);
    onChange?.(newBooleanDefaultValue);
  };

  return readOnly ? (
    <Collapse
      items={[
        {
          key: "1",
          label: t("default-value"),
          children: (
            <Text strong>
              {booleanDefaultValue?.data ? t("true") : t("false")}
            </Text>
          ),
        },
      ]}
    />
  ) : (
    <Select
      options={[
        { label: t("true"), value: true },
        { label: t("false"), value: false },
      ]}
      value={booleanDefaultValue?.data as boolean}
      defaultValue={true}
      onChange={handleChange}
      disabled={disabled}
      style={{ width: "100px" }}
    />
  );
};
