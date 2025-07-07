import type { ObjectType, Type } from "@/features/function/types";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import { Button, Tooltip, Typography, Upload } from "antd";
import { omit, set } from "lodash";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { DefaultValueLabel } from "./default-value-label";
import { TypeBuilder } from "./type-builder";
import { useDefaultValue } from "./use-default-value";
import { usePageMode } from "@/hooks/use-page-mode";

const { Paragraph, Text } = Typography;

interface ObjectTypeBuilderProps {
  value?: ObjectType;
  defaultValue?: ObjectType;
  onChange?: (type: Type) => void;
  depth?: number;
  maxDepth?: number;
  onDepthChange?: (depth: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const ObjectTypeBuilder: React.FC<ObjectTypeBuilderProps> = ({
  value,
  defaultValue,
  onChange,
  depth = 0,
  maxDepth = 5,
  onDepthChange,
  disabled,
  readOnly,
}) => {
  const { t } = useTranslation();
  const { pageMode } = usePageMode();
  const { hasDefaultValue, handleHasDefaultValueChange, isDisabled } =
    useDefaultValue({
      value,
      onChange,
      disabled,
    });

  if (!value && defaultValue) {
    onChange?.(defaultValue);
  }

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

  const handleLabelChange = (
    e: ChangeEvent<HTMLInputElement>,
    k: string,
    v: Type,
  ) => {
    onChange?.({
      ...value!,
      schema: set(omit(value?.schema, k), e.target.value, v),
    });
  };

  return (
    <Box display="flex" flexDirection="column" width="100%" gap={2}>
      <Box display="flex" flexDirection="column" gap={2}>
        {!readOnly && (
          <Box display="flex" flexDirection="row" gap={1}>
            <Text style={{ marginBottom: "-0.5rem" }}>{t("fields")}</Text>
            {pageMode === "create" && (
              <Tooltip title={t("add-data-field")}>
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={handleAddDataField}
                />
              </Tooltip>
            )}
          </Box>
        )}
        {Object.entries(value?.schema || {}).map(([k, v], idx) => (
          <TypeBuilder
            key={idx}
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
            labelEditable={pageMode === "create"}
            onLabelChange={(e) => handleLabelChange(e, k, v)}
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
        <Box display="flex" flexDirection="column" width="100%" gap={1}>
          <DefaultValueLabel
            checked={hasDefaultValue}
            onChange={handleHasDefaultValueChange}
            disabled={isDisabled}
            readOnly={readOnly}
          />
          {hasDefaultValue && (
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
          )}
        </Box>
      )}
    </Box>
  );
};
