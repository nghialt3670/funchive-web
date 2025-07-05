import type { ObjectType, Type } from "@/features/function/types";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import { Button, Form, Tooltip, Typography, Upload } from "antd";
import { omit } from "lodash";
import { useTranslation } from "react-i18next";

import { DefaultValueLabel } from "./default-value-label";
import { TypeBuilder } from "./type-builder";
import { useDefaultValue } from "./use-default-value";

const { Paragraph } = Typography;

interface ObjectTypeBuilderProps {
  value?: ObjectType;
  onChange?: (type: Type) => void;
  depth?: number;
  maxDepth?: number;
  onDepthChange?: (depth: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const ObjectTypeBuilder: React.FC<ObjectTypeBuilderProps> = ({
  value,
  onChange,
  depth = 0,
  maxDepth = 5,
  onDepthChange,
  disabled,
  readOnly,
}) => {
  const { t } = useTranslation();
  const { hasDefaultValue, handleHasDefaultValueChange, isDisabled } =
    useDefaultValue({
      value,
      onChange,
      disabled,
    });

  if (Object.keys(value?.schema || {}).length === 0) {
    onChange?.({
      name: "OBJECT",
      schema: { field_1: { name: "STRING" } },
    });
  }

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
              disabled={isDisabled}
              removable={Object.keys(value?.schema || {}).length > 1}
              onRemove={handleRemoveDataField}
              depth={depth + 1}
              maxDepth={maxDepth}
              onDepthChange={onDepthChange}
              readOnly={readOnly}
            />
          ))}
        </Box>

      {readOnly ? (
        hasDefaultValue && (
          <Box display="flex" flexDirection="row" gap={1}>
            <Paragraph>{value?.defaultValue?.data as string}</Paragraph>
          </Box>
        )
      ) : (
        <Form.Item
          label={
            <DefaultValueLabel
              checked={hasDefaultValue}
              onChange={handleHasDefaultValueChange}
              disabled={isDisabled}
              readOnly={readOnly}
            />
          }
          style={{ width: "100%", marginBottom: hasDefaultValue ? 0 : -40 }}
        >
          <Upload
            showUploadList={false}
            disabled={isDisabled || !hasDefaultValue}
          >
            <Button
              icon={<UploadOutlined />}
              disabled={isDisabled || !hasDefaultValue}
            >
              {t("upload-json-file")}
            </Button>
          </Upload>
        </Form.Item>
      )}
    </Box>
  );
};
