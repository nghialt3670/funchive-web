import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { DeleteOutlined } from "@ant-design/icons";
import { Stack } from "@mui/material";
import { Button, Collapse, Switch, Tooltip, Typography } from "antd";
import { type FC } from "react";

import {
  type ArrayType,
  type ArrayValue,
  type BooleanValue,
  type FileValue,
  type NumberValue,
  type ObjectType,
  type ObjectValue,
  type StringValue,
  type Value,
} from "../../types";
import { type Type } from "../../types";
import { ArrayValueBuilder } from "./array-value-builder";
import { BooleanValueBuilder } from "./boolean-value-builder";
import { FileValueBuilder } from "./file-value-builder";
import { NumberValueBuilder } from "./number-value-builder";
import { ObjectValueBuilder } from "./object-value-builder";
import { StringValueBuilder } from "./string-value-builder";

const { Text } = Typography;

export interface ValueBuilderProps {
  type: Type;
  label: string;
  value?: Value;
  onChange?: (value: Value) => void;
  showEnabled?: boolean;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  removeable?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  defaultOpen?: boolean;
}

export const ValueBuilder: FC<ValueBuilderProps> = ({
  type,
  label,
  value,
  onChange,
  showEnabled,
  enabled,
  onEnabledChange,
  removeable,
  onRemove,
  disabled,
  readOnly,
  defaultOpen,
}) => {
  const { t: nt } = useNamespacedTranslation();

  const renderCollapseLabel = () => {
    return (
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        justifyContent="space-between"
      >
        <Text strong>{label}</Text>
        <Stack direction="row" alignItems="center" gap={1}>
          {showEnabled && (
            <Tooltip title={nt("use-default-value")}>
              <Switch
                checked={enabled}
                onChange={onEnabledChange}
                size="small"
                onClick={(_, e) => e.stopPropagation()}
              />
            </Tooltip>
          )}
          {removeable && (
            <Tooltip title={nt("remove")}>
              <Button
                size="small"
                onClick={onRemove}
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          )}
        </Stack>
      </Stack>
    );
  };

  const renderCollapseChildren = () => {
    switch (type.name) {
      case "ARRAY":
        return (
          <ArrayValueBuilder
            type={type as ArrayType}
            value={value as ArrayValue}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "BOOLEAN":
        return (
          <BooleanValueBuilder
            value={value as BooleanValue}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "FILE":
        return (
          <FileValueBuilder
            value={value as FileValue}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "NUMBER":
        return (
          <NumberValueBuilder
            value={value as NumberValue}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "OBJECT":
        return (
          <ObjectValueBuilder
            type={type as ObjectType}
            value={value as ObjectValue}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "STRING":
        return (
          <StringValueBuilder
            value={value as StringValue}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
    }
  };

  return (
    <Collapse
      defaultActiveKey={defaultOpen ? ["1"] : undefined}
      items={[
        {
          key: "1",
          label: renderCollapseLabel(),
          children: renderCollapseChildren(),
        },
      ]}
    />
  );
};
