import { Stack } from "@mui/material";
import { type FC, useState } from "react";

import type { ObjectType, ObjectValue, Value } from "../../types";
import { ValueBuilder } from "./value-builder";

const DEFAULT_OBJECT_VALUE: ObjectValue = {
  typeName: "OBJECT",
  data: {},
};

export interface ObjectValueBuilderProps {
  type: ObjectType;
  value?: ObjectValue;
  onChange?: (value: ObjectValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const ObjectValueBuilder: FC<ObjectValueBuilderProps> = ({
  type,
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const [objectValue, setObjectValue] = useState<ObjectValue>(
    value ?? DEFAULT_OBJECT_VALUE,
  );

  const handleFieldValueChange = (key: string, value: Value) => {
    const newObjectValue = { ...objectValue };
    newObjectValue.data[key] = value;
    setObjectValue(newObjectValue);
    onChange?.(newObjectValue);
  };

  return (
    <Stack direction="column" alignItems="stretch" gap={2}>
      {Object.entries(type.schema).map(([key, value]) => (
        <ValueBuilder
          key={key}
          type={value}
          label={key}
          value={objectValue.data[key]}
          onChange={(value) => handleFieldValueChange(key, value)}
          disabled={disabled}
          readOnly={readOnly}
          defaultOpen
          showEnabled={false}
        />
      ))}
    </Stack>
  );
};
