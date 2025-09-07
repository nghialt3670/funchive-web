import type { Type } from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { Stack } from "@mui/material";
import { type FC } from "react";

import { TypeBuilder } from ".";

const DEFAULT_ELEMENT_TYPE: Type = { name: "STRING" };

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

  const elementType = value || DEFAULT_ELEMENT_TYPE;

  const handleChange = (type: Type) => {
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
