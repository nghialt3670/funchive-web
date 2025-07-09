import type { NumberValue } from "@/features/function/types";
import { InputNumber } from "antd";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";

export interface NumberDefaultValueFieldProps {
  value?: NumberValue;
  onChange?: (value: NumberValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const NumberDefaultValueField: FC<NumberDefaultValueFieldProps> = ({
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const { t } = useTranslation();
  const [numberDefaultValue, setNumberDefaultValue] = useState<
    NumberValue | undefined
  >(value);

  const handleChange = (value: number | null) => {
    const newNumberDefaultValue = {
      typeName: "NUMBER",
      data: value,
    } as NumberValue;
    setNumberDefaultValue(newNumberDefaultValue);
    onChange?.(newNumberDefaultValue);
  };

  return (
    <InputNumber
      placeholder={t("default-value-placeholder")}
      value={numberDefaultValue?.data}
      onChange={handleChange}
      disabled={disabled}
      readOnly={readOnly}
      style={{ width: "100%" }}
    />
  );
};
