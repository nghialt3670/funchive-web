import { InputNumber } from "antd";
import { type FC } from "react";

import { type NumberValue, TYPE_NAMES } from "../../types";

export interface NumberValueBuilderProps {
  value?: NumberValue;
  onChange?: (value?: NumberValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const NumberValueBuilder: FC<NumberValueBuilderProps> = ({
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const handleChange = (value: number | null) => {
    onChange?.(
      value ? { typeName: TYPE_NAMES.NUMBER, data: value } : undefined,
    );
  };

  return (
    <InputNumber
      value={value?.data}
      onChange={handleChange}
      disabled={disabled}
      readOnly={readOnly}
      style={{ width: "100%" }}
    />
  );
};
