import type { Type } from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { usePageMode } from "@/hooks/use-page-mode";
import { Stack } from "@mui/material";
import { Typography } from "antd";
import { type FC, useState } from "react";

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
  const { pageMode } = usePageMode();
  const [elementType, setElementType] = useState<Type>(
    value || { name: "STRING" },
  );

  const showLabel = !readOnly && (pageMode === "edit" || pageMode === "create");

  const handleChange = (type: Type) => {
    setElementType(type);
    onChange?.(type);
  };

  return (
    <Stack direction="column" gap={1}>
      {showLabel && <Typography.Text>{nt("element-type")}</Typography.Text>}
      <TypeBuilder
        value={elementType}
        onChange={handleChange}
        label={showLabel ? nt("element-type") : ""}
        disabled={disabled}
        depth={depth ?? 0}
        maxDepth={maxDepth}
        onDepthChange={onDepthChange}
        readOnly={readOnly}
      />
    </Stack>
  );
};
