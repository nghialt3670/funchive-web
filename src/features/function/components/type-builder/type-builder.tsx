import type { ObjectType, Type, TypeName } from "@/features/function/types";
import { TYPE_NAMES } from "@/features/function/types";
import { Box, useMediaQuery } from "@mui/material";
import { Card, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { BooleanTypeBuilder } from "./boolean-type-builder";
import { FileTypeBuilder } from "./file-type-builder";
import { NumberTypeBuilder } from "./number-type-builder";
import { ObjectTypeBuilder } from "./object-type-builder";
import { StringTypeBuilder } from "./string-type-builder";

const { TextArea } = Input;

const { Option } = Select;
interface TypeBuilderProps {
  value?: Type;
  onChange?: (type: Type) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

export const TypeBuilder: React.FC<TypeBuilderProps> = ({
  value,
  onChange,
  label,
  disabled,
  readonly,
}) => {
  const { t } = useTranslation();
  const [typeName, setTypeName] = useState<TypeName>(value?.name || "STRING");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (value) {
      setTypeName(value.name);
    }
  }, [value]);

  const handleTypeNameChange = (newTypeName: TypeName) => {
    setTypeName(newTypeName);
    // Create a new type with default values when type changes
    let newType: Type;

    switch (newTypeName) {
      case "STRING":
        newType = { name: "STRING" };
        break;
      case "NUMBER":
        newType = { name: "NUMBER" };
        break;
      case "BOOLEAN":
        newType = { name: "BOOLEAN" };
        break;
      case "FILE":
        newType = { name: "FILE" };
        break;
      case "ARRAY":
        newType = { name: "ARRAY", elementType: { name: "STRING" } };
        break;
      case "OBJECT":
        newType = { name: "OBJECT", schema: { field1: { name: "STRING" } } };
        break;
      default:
        newType = { name: "STRING" };
    }

    onChange?.(newType);
  };

  const renderTypeSpecificBuilder = () => {
    switch (typeName) {
      case "STRING":
        return (
          <StringTypeBuilder
            value={value as any}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case "NUMBER":
        return (
          <NumberTypeBuilder
            value={value as any}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case "BOOLEAN":
        return (
          <BooleanTypeBuilder
            value={value as any}
            onChange={onChange}
            disabled={disabled}
          />
        );
      case "FILE":
        return (
          <FileTypeBuilder
            value={value as any}
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
          />
        );
      default:
        return null;
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    // Create a new type with the updated description while preserving other properties
    let newType: Type;

    switch (typeName) {
      case "STRING":
        newType = {
          name: "STRING",
          description: newDescription || undefined,
          defaultValue: value?.defaultValue,
        };
        break;
      case "NUMBER":
        newType = {
          name: "NUMBER",
          description: newDescription || undefined,
          defaultValue: value?.defaultValue,
        };
        break;
      case "BOOLEAN":
        newType = {
          name: "BOOLEAN",
          description: newDescription || undefined,
          defaultValue: value?.defaultValue,
        };
        break;
      case "FILE":
        newType = {
          name: "FILE",
          description: newDescription || undefined,
          defaultValue: value?.defaultValue,
          extension: (value as any)?.extension,
        };
        break;
      case "ARRAY":
        newType = {
          name: "ARRAY",
          description: newDescription || undefined,
          defaultValue: value?.defaultValue,
          elementType: (value as any)?.elementType || { name: "STRING" },
        };
        break;
      case "OBJECT":
        newType = {
          name: "OBJECT",
          description: newDescription || undefined,
          defaultValue: value?.defaultValue,
          schema: (value as any)?.schema || { field1: { name: "STRING" } },
        };
        break;
      default:
        newType = {
          name: "STRING",
          description: newDescription || undefined,
          defaultValue: value?.defaultValue,
        };
    }

    onChange?.(newType);
  };

  return (
    <Card size="small">
      <Box
        display="flex"
        flexDirection={isTablet ? "column" : "row"}
        alignItems="center"
        gap={1}
      >
        <Form.Item
          label={label}
          style={{ width: isTablet ? "100%" : "15%", marginBottom: 0 }}
        >
          <Select
            value={typeName}
            onChange={handleTypeNameChange}
            disabled={disabled}
            style={{ width: "6rem" }}
          >
            {Object.entries(TYPE_NAMES).map(([key, value]) => (
              <Option key={key} value={value}>
                {value}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Box display="flex" flexDirection="column" width="100%">
          <Form.Item
            label={t("description")}
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            <TextArea
              placeholder={t("description-placeholder")}
              value={value?.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              disabled={disabled}
              readOnly={readonly}
              autoSize={{ minRows: 1, maxRows: 5 }}
            />
          </Form.Item>
          {renderTypeSpecificBuilder()}
        </Box>
      </Box>
    </Card>
  );
};
