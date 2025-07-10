import type { Type } from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { Stack } from "@mui/material";
import { type FC, useEffect, useState } from "react";

import { TypeBuilder } from "..";

interface ArrayElementTypeFieldProps {
  value?: Type;
  onChange?: (value: Type) => void;
  depth?: number;
  maxDepth?: number;
  onDepthChange?: (depth: number) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

export const ArrayElementTypeField: FC<ArrayElementTypeFieldProps> = ({
  value,
  onChange,
  depth,
  maxDepth,
  onDepthChange,
  readOnly,
  disabled,
}) => {
  const { t: nt } = useNamespacedTranslation();
  const [elementType, setElementType] = useState<Type>(
    value || { name: "STRING" },
  );

  useEffect(() => {
    if (value !== elementType) {
      onChange?.(elementType);
    }
  }, [elementType]);

  const handleChange = (type: Type) => {
    setElementType(type);
    onChange?.(type);
  };

  return (
    <Stack direction="column" gap={1}>
      <TypeBuilder
        value={elementType}
        onChange={handleChange}
        label={nt("element-type")}
        disabled={disabled}
        depth={depth ?? 0}
        maxDepth={maxDepth}
        onDepthChange={onDepthChange}
        readOnly={readOnly}
        labelEditable={false}
      />
    </Stack>
  );
};
