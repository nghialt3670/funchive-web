import type {
  BooleanType,
  FileType,
  NumberType,
  ObjectType,
  StringType,
  Type,
  TypeName,
} from "@/features/function/types";
import { TYPE_NAMES } from "@/features/function/types";
import { DeleteOutlined } from "@ant-design/icons";
import { Box, useMediaQuery } from "@mui/material";
import { Button, Card, Form, Input, Select, Tooltip, Typography } from "antd";
import React, { type ChangeEventHandler } from "react";
import { useTranslation } from "react-i18next";

import { BooleanTypeBuilder } from "./boolean-type-builder";
import { FileTypeBuilder } from "./file-type-builder";
import { NumberTypeBuilder } from "./number-type-builder";
import { ObjectTypeBuilder } from "./object-type-builder";
import { StringTypeBuilder } from "./string-type-builder";

const { TextArea } = Input;

const { Option } = Select;
const { Text } = Typography;
interface TypeBuilderProps {
  value?: Type;
  defaultValue?: Type;
  onChange?: (type: Type) => void;
  removeable?: boolean;
  onRemove?: (key: string) => void;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  depth?: number;
  maxDepth?: number;
  onDepthChange?: (depth: number) => void;
}

export const TypeBuilder: React.FC<TypeBuilderProps> = ({
  value,
  defaultValue,
  onChange,
  removeable,
  onRemove,
  label,
  disabled,
  readonly,
  depth = 0,
  maxDepth = 5,
  onDepthChange,
}) => {
  const { t } = useTranslation();
  const isLaptop = useMediaQuery("(max-width: 1280px)");

  if (!value && defaultValue) {
    onChange?.(defaultValue);
  }

  const shouldUseVerticalLayout = isLaptop;

  const renderTypeSpecificBuilder = () => {
    switch (value?.name as TypeName) {
      case "STRING":
        return (
          <StringTypeBuilder
            value={value as StringType}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case "NUMBER":
        return (
          <NumberTypeBuilder
            value={value as NumberType}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case "BOOLEAN":
        return (
          <BooleanTypeBuilder
            value={value as BooleanType}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case "FILE":
        return (
          <FileTypeBuilder
            value={value as FileType}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case "ARRAY":
      case "OBJECT":
        return (
          <ObjectTypeBuilder
            value={value as ObjectType}
            onChange={onChange}
            disabled={disabled}
            depth={depth + 1}
            maxDepth={maxDepth}
            onDepthChange={onDepthChange}
          />
        );
      default:
        return null;
    }
  };

  const handleTypeNameChange = (newTypeName: TypeName) => {
    onChange?.({ ...value, name: newTypeName } as Type);
  };

  const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    onChange?.({ ...value, description: e.target.value } as Type);
  };

  const handleRemoveClick = () => {
    onRemove?.(label);
  };

  // Filter out ARRAY and OBJECT types if at max depth
  const availableTypes =
    depth >= maxDepth
      ? Object.entries(TYPE_NAMES).filter(
          ([_, value]) => value !== "ARRAY" && value !== "OBJECT",
        )
      : Object.entries(TYPE_NAMES);

  return (
    <Card size="small">
      {removeable && (
        <Tooltip title={t("remove-data-field")}>
          <Button
            onClick={handleRemoveClick}
            icon={<DeleteOutlined />}
            size="small"
            style={{ position: "absolute", top: 0, right: 0 }}
          />
        </Tooltip>
      )}
      <Box
        display="flex"
        flexDirection={shouldUseVerticalLayout ? "column" : "row"}
        justifyContent="flex-start"
        alignItems="flex-start"
        gap={2}
      >
        <Box
          display="flex"
          justifyContent={shouldUseVerticalLayout ? "flex-start" : "center"}
          alignItems="center"
          width={shouldUseVerticalLayout ? "100%" : "200px"}
        >
          <Card size="small" hoverable>
            <Form.Item
              label={<Text strong>{label}</Text>}
              style={{ marginBottom: 0 }}
            >
              <Select
                value={value?.name}
                onChange={handleTypeNameChange}
                disabled={disabled}
                style={{ width: "100px" }}
              >
                {availableTypes.map(([key, value]) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Card>
        </Box>
        <Box display="flex" flexDirection="column" width="100%">
          <Form.Item
            label={t("description")}
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            <TextArea
              placeholder={t("description-placeholder")}
              value={value?.description}
              onChange={handleDescriptionChange}
              disabled={disabled}
              readOnly={readonly}
              autoSize={{ minRows: 1, maxRows: 5 }}
              className={disabled ? "disabled-input-placeholder" : ""}
            />
          </Form.Item>
          {renderTypeSpecificBuilder()}
        </Box>
      </Box>
    </Card>
  );
};
