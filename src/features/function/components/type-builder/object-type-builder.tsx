import type { ObjectType, Type } from "@/features/function/types";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import { Button, Card, Form, Switch, Tooltip, Typography, Upload } from "antd";
import { omit } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TypeBuilder } from "./type-builder";

const { Text } = Typography;

interface ObjectTypeBuilderProps {
  value?: ObjectType;
  onChange?: (type: Type) => void;
  depth?: number;
  maxDepth?: number;
  onDepthChange?: (depth: number) => void;
  disabled?: boolean;
}

export const ObjectTypeBuilder: React.FC<ObjectTypeBuilderProps> = ({
  value,
  onChange,
  depth = 0,
  maxDepth = 5,
  onDepthChange,
  disabled,
}) => {
  const { t } = useTranslation();
  const [hasDefaultValue, setHasDefaultValue] = useState(false);

  if (Object.keys(value?.schema || {}).length === 0) {
    onChange?.({
      name: "OBJECT",
      schema: { field_1: { name: "STRING" } },
    });
  }

  const handleHasDefaultValueChange = (checked: boolean) => {
    setHasDefaultValue(checked);
    if (!checked) {
      onChange?.(omit(value, "defaultValue"));
    }
  };

  const handleAddDataField = () => {
    onChange?.({
      name: "OBJECT",
      schema: {
        ...value?.schema,
        [`field_${Object.keys(value?.schema || {}).length + 1}`]: {
          name: "STRING",
        },
      },
    });
  };

  const handleRemoveDataField = (key: string) => {
    onChange?.({
      name: "OBJECT",
      schema: omit(value?.schema, key),
    });
  };

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Form.Item
        label={
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            justifyContent="center"
            alignItems="center"
          >
            <Text style={{ width: "fit-content", textWrap: "nowrap" }}>
              {t("data-fields")}
            </Text>
            <Tooltip title={t("add-data-field")}>
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={handleAddDataField}
                disabled={disabled}
              />
            </Tooltip>
          </Box>
        }
      >
        <Card size="small">
          <Box display="flex" flexDirection="column" gap={2}>
            {Object.entries(value?.schema || {}).map(([k, v]) => (
              <TypeBuilder
                key={k}
                value={v}
                onChange={(type) =>
                  onChange?.({
                    name: "OBJECT",
                    schema: {
                      ...value?.schema,
                      [k]: type,
                    } as ObjectType["schema"],
                  })
                }
                label={k}
                disabled={disabled}
                removeable={Object.keys(value?.schema || {}).length > 1}
                onRemove={handleRemoveDataField}
                depth={depth + 1}
                maxDepth={maxDepth}
                onDepthChange={onDepthChange}
              />
            ))}
          </Box>
        </Card>
      </Form.Item>
      <Form.Item
        label={
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            justifyContent="center"
            alignItems="center"
          >
            <Text style={{ width: "fit-content", textWrap: "nowrap" }}>
              {t("default-value")}
            </Text>
            <Switch
              size="small"
              checked={hasDefaultValue}
              onChange={handleHasDefaultValueChange}
              disabled={disabled}
            />
          </Box>
        }
        style={{ width: "100%", marginBottom: hasDefaultValue ? 0 : -40 }}
      >
        {hasDefaultValue && (
          <Upload
            showUploadList={false}
            disabled={disabled || !hasDefaultValue}
          >
            <Button
              icon={<UploadOutlined />}
              disabled={disabled || !hasDefaultValue}
            >
              {t("upload-json-file")}
            </Button>
          </Upload>
        )}
      </Form.Item>
    </Box>
  );
};
