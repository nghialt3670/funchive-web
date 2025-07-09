import { PageModeCondition } from "@/components/ui/page-mode-condition";
import type { Type } from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation.ts";
import { usePageMode } from "@/hooks/use-page-mode";
import { PlusOutlined } from "@ant-design/icons";
import { Stack } from "@mui/material";
import { Button, Collapse, Tooltip, Typography } from "antd";
import { omit, set } from "lodash";
import type { ChangeEvent, FC } from "react";
import { useState } from "react";

import { TypeBuilder } from "../type-builder.tsx";

const { Text } = Typography;

interface ObjectSchemaFieldProps {
  value?: Record<string, Type>;
  onChange?: (value: Record<string, Type>) => void;
  readOnly?: boolean;
  disabled?: boolean;
  depth?: number;
  maxDepth?: number;
  onDepthChange?: (depth: number) => void;
}

export const ObjectSchemaField: FC<ObjectSchemaFieldProps> = ({
  value,
  onChange,
  readOnly,
  disabled,
  depth = 0,
  maxDepth = 5,
  onDepthChange,
}) => {
  const { t: nt } = useNamespacedTranslation();
  const { pageMode } = usePageMode();
  const [schema, setSchema] = useState<Record<string, Type>>(
    value || { field1: { name: "STRING" } },
  );

  const handleAddDataField = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const newSchema = {
      ...schema,
      [`field${Object.keys(schema).length + 1}`]: {
        name: "STRING",
      },
    } as Record<string, Type>;
    setSchema(newSchema);
    onChange?.(newSchema);
  };

  const handleRemoveDataField = (key: string) => {
    const newSchema = omit(schema, key);
    setSchema(newSchema);
    onChange?.(newSchema);
  };

  const handleTypeChange = (key: string, type: Type) => {
    const newSchema = set(schema, key, type);
    setSchema(newSchema);
    onChange?.(newSchema);
  };

  const handleLabelChange = (
    e: ChangeEvent<HTMLInputElement>,
    k: string,
    v: Type,
  ) => {
    const newKey = e.target.value;
    const newSchema: Record<string, Type> = {};

    for (const key of Object.keys(schema)) {
      if (key === k) {
        newSchema[newKey] = v;
      } else {
        newSchema[key] = schema[key];
      }
    }

    setSchema(newSchema);
    onChange?.(newSchema);
  };

  const renderCollapseLabel = () => {
    return (
      <Stack direction="row" justifyContent="space-between" gap={1}>
        <Text>{nt("fields")}</Text>
        <PageModeCondition modes={["create"]}>
          <Tooltip title={nt("add-field")}>
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddDataField}
            />
          </Tooltip>
        </PageModeCondition>
      </Stack>
    );
  };

  const renderCollapseChildren = () => {
    return (
      <Stack gap={2}>
        {Object.entries(schema).map(([k, v], idx) => (
          <TypeBuilder
            key={idx}
            value={v}
            onChange={(type) => handleTypeChange(k, type)}
            label={k}
            disabled={disabled}
            removable={Object.keys(schema).length > 1}
            onRemove={handleRemoveDataField}
            labelEditable={pageMode === "create"}
            onLabelChange={(e) => handleLabelChange(e, k, v)}
            depth={depth + 1}
            maxDepth={maxDepth}
            onDepthChange={onDepthChange}
            readOnly={readOnly}
          />
        ))}
      </Stack>
    );
  };

  return (
    <Collapse
      items={[
        {
          key: "1",
          label: renderCollapseLabel(),
          children: renderCollapseChildren(),
        },
      ]}
      defaultActiveKey={["1"]}
    />
  );
};
