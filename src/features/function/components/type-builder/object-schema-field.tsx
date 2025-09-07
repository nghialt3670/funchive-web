import { PageModeCondition } from "@/components/ui/page-mode-condition";
import type { Type } from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation.ts";
import { usePageMode } from "@/hooks/use-page-mode";
import { PlusOutlined } from "@ant-design/icons";
import { Stack } from "@mui/material";
import { Button, Collapse, Tooltip, Typography } from "antd";
import { type ChangeEvent, type FC, useState } from "react";

import { TypeBuilder } from "./type-builder.tsx";

const { Text } = Typography;

interface Field {
  key: string;
  value: Type;
}

interface ObjectSchemaFieldProps {
  value?: Record<string, Type>;
  onChange?: (value: Record<string, Type>) => void;
  readOnly?: boolean;
  disabled?: boolean;
  depth?: number;
  maxDepth?: number;
  onDepthChange?: (depth: number) => void;
}

const DEFAULT_FIELDS: Field[] = [{ key: "", value: { name: "STRING" } }];

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
  const [fields, setFields] = useState<Field[]>(DEFAULT_FIELDS);

  const handleAddDataField = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const newField: Field = { key: "", value: { name: "STRING" } };

    setFields([...fields, newField]);
  };

  const handleRemoveDataField = (key: string) => {
    setFields(fields.filter((field) => field.key !== key));
  };

  const handleTypeChange = (key: string, type: Type) => {
    setFields(
      fields.map((field) =>
        field.key === key ? { ...field, value: type } : field,
      ),
    );
  };

  const handleLabelChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], key: e.target.value };
    setFields(newFields);
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
        {fields.map((field, idx) => (
          <TypeBuilder
            key={idx}
            value={field.value}
            onChange={(type) => handleTypeChange(field.key, type)}
            label={field.key}
            disabled={disabled}
            removable={fields.length > 1}
            onRemove={handleRemoveDataField}
            labelEditable={pageMode === "create"}
            onLabelChange={(e) => handleLabelChange(e, idx)}
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
