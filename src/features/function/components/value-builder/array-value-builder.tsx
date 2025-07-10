import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { PlusOutlined } from "@ant-design/icons";
import { Stack } from "@mui/material";
import { Button } from "antd";
import { type FC, useState } from "react";

import type { ArrayType, ArrayValue, Value } from "../../types";
import { ValueBuilder } from "./value-builder";

const DEFAULT_ARRAY_VALUE: ArrayValue = {
  typeName: "ARRAY",
  data: [],
};

const DEFAULT_ELEMENT_VALUE: Value = {
  typeName: "STRING",
  data: "",
};

export interface ArrayValueBuilderProps {
  type: ArrayType;
  value?: ArrayValue;
  onChange?: (value: ArrayValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const ArrayValueBuilder: FC<ArrayValueBuilderProps> = ({
  type,
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const { t: nt } = useNamespacedTranslation();
  const [arrayValue, setArrayValue] = useState<ArrayValue>(
    value ?? DEFAULT_ARRAY_VALUE,
  );

  const handleElementValueChange = (index: number, value: Value) => {
    const newArrayValue = { ...arrayValue };
    newArrayValue.data[index] = value;
    setArrayValue(newArrayValue);
    onChange?.(newArrayValue);
  };

  const handleAddElement = () => {
    const newArrayValue = { ...arrayValue };
    newArrayValue.data.push(DEFAULT_ELEMENT_VALUE);
    setArrayValue(newArrayValue);
    onChange?.(newArrayValue);
  };

  const handleRemoveElement = (index: number) => {
    const newArrayValue = { ...arrayValue };
    newArrayValue.data.splice(index, 1);
    setArrayValue(newArrayValue);
    onChange?.(newArrayValue);
  };

  return (
    <Stack direction="column" alignItems="stretch" gap={2}>
      {arrayValue.data.map((item, index) => (
        <ValueBuilder
          key={index}
          type={type.elementType}
          label={nt("element").concat(` ${index + 1}`)}
          value={item}
          onChange={(value) => handleElementValueChange(index, value)}
          removeable={arrayValue.data.length > 1}
          onRemove={() => handleRemoveElement(index)}
          disabled={disabled}
          readOnly={readOnly}
          defaultOpen
          showEnabled={false}
        />
      ))}
      <Button
        onClick={handleAddElement}
        disabled={disabled}
        icon={<PlusOutlined />}
      >
        {nt("add-element")}
      </Button>
    </Stack>
  );
};
