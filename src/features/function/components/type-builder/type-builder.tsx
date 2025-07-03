import type { Type, TypeName } from "@/features/function/types";
import { TYPE_NAMES } from "@/features/function/types";
import { Card, Form, Select, Space } from "antd";
import React, { useEffect, useState } from "react";

import { AdvancedNestedTypeBuilder } from "./advanced-nested-type-builder";
import { BooleanTypeBuilder } from "./boolean-type-builder";
import { FileTypeBuilder } from "./file-type-builder";
import { NumberTypeBuilder } from "./number-type-builder";
import { StringTypeBuilder } from "./string-type-builder";
import styles from "./type-builder.module.css";

const { Option } = Select;

interface TypeBuilderProps {
  value?: Type;
  onChange?: (type: Type) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export const TypeBuilder: React.FC<TypeBuilderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [typeName, setTypeName] = useState<TypeName>(value?.name || "STRING");

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
        newType = { name: "OBJECT", schema: {} };
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
          <AdvancedNestedTypeBuilder
            value={value}
            onChange={onChange}
            disabled={disabled}
            depth={0}
            maxDepth={3}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Card size="small" className={styles.typeBuilderCard}>
        <Space direction="vertical" className={styles.cardContent}>
          {/* Type Selection */}
          <Form.Item label="Type" className={styles.formItem}>
            <Select
              value={typeName}
              onChange={handleTypeNameChange}
              disabled={disabled}
              className={styles.typeSelect}
            >
              {Object.entries(TYPE_NAMES).map(([key, value]) => (
                <Option key={key} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Type-specific builder */}
          {renderTypeSpecificBuilder()}
        </Space>
      </Card>
    </div>
  );
};
