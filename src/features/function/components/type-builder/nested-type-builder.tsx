import type { Type, TypeName } from "@/features/function/types";
import { TYPE_NAMES } from "@/features/function/types";
import { Card, Form, Select, Space } from "antd";
import React, { useEffect, useState } from "react";

import { BooleanTypeBuilder } from "./boolean-type-builder";
import { FileTypeBuilder } from "./file-type-builder";
import styles from "./nested-type-builder.module.css";
import { NumberTypeBuilder } from "./number-type-builder";
import { StringTypeBuilder } from "./string-type-builder";

const { Option } = Select;

interface NestedTypeBuilderProps {
  value?: Type;
  onChange?: (type: Type) => void;
  disabled?: boolean;
  depth?: number; // To prevent infinite nesting
}

export const NestedTypeBuilder: React.FC<NestedTypeBuilderProps> = ({
  value,
  onChange,
  disabled = false,
  depth = 0,
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
    // Prevent infinite nesting beyond depth 3
    if (depth > 3) {
      return (
        <div className={styles.maxDepthWarning}>
          Maximum nesting depth reached
        </div>
      );
    }

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
          <div className={styles.complexTypeNote}>
            {typeName} types are only available in the main type builder
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.nestedTypeBuilder}>
      <Card size="small" className={styles.nestedCard}>
        <Space direction="vertical" className={styles.cardContent}>
          {/* Type Selection */}
          <Form.Item label="Type" className={styles.formItem}>
            <Select
              value={typeName}
              onChange={handleTypeNameChange}
              disabled={disabled}
              size="small"
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
