import { Select, Typography } from "antd";
import { type FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { BooleanValue } from "../../types";

const { Text } = Typography;

export interface BooleanValueBuilderProps {
  value?: BooleanValue;
  onChange?: (value: BooleanValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const BooleanValueBuilder: FC<BooleanValueBuilderProps> = ({
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const { t } = useTranslation();
  const [booleanValue, setBooleanValue] = useState<BooleanValue>(
    value ?? { typeName: "BOOLEAN", data: true },
  );

  useEffect(() => {
    if (value !== booleanValue) {
      setBooleanValue(value ?? { typeName: "BOOLEAN", data: true });
    }
  }, [value]);

  const handleChange = (value: boolean) => {
    const newBooleanValue = {
      typeName: "BOOLEAN",
      data: value,
    } as BooleanValue;
    setBooleanValue(newBooleanValue);
    onChange?.(newBooleanValue);
  };

  return readOnly ? (
    <Text strong>{booleanValue?.data ? "true" : "false"}</Text>
  ) : (
    <Select
      options={[
        { label: t("true"), value: true },
        { label: t("false"), value: false },
      ]}
      value={booleanValue?.data as boolean}
      defaultValue={true}
      onChange={handleChange}
      disabled={disabled}
      style={{ width: "100px" }}
    />
  );
};
