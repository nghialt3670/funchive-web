import type {
  ArrayType,
  ObjectType,
  Type,
  TypeName,
} from "@/features/function/function-types";
import { TYPE_NAMES } from "@/features/function/function-types";
import { DeleteFilled, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";

import styles from "./advanced-nested-type-builder.module.css";
import { BooleanTypeBuilder } from "./boolean-type-builder";
import { FileTypeBuilder } from "./file-type-builder";
import { NumberTypeBuilder } from "./number-type-builder";
import { StringTypeBuilder } from "./string-type-builder";

const { Option } = Select;

interface AdvancedNestedTypeBuilderProps {
  value?: Type;
  onChange?: (type: Type) => void;
  disabled?: boolean;
  depth?: number;
  maxDepth?: number;
}

interface ObjectFieldProps {
  fieldName: string;
  fieldType: Type;
  onUpdate: (oldName: string, newName: string, type: Type) => void;
  onDelete: (name: string) => void;
  disabled?: boolean;
  depth: number;
  maxDepth: number;
}

const ObjectField: React.FC<ObjectFieldProps> = ({
  fieldName,
  fieldType,
  onUpdate,
  onDelete,
  disabled,
  depth,
  maxDepth,
}) => {
  const [localFieldName, setLocalFieldName] = useState(fieldName);

  const handleNameChange = (newName: string) => {
    setLocalFieldName(newName);
    onUpdate(fieldName, newName, fieldType);
  };

  const handleTypeChange = (newType: Type) => {
    onUpdate(fieldName, localFieldName, newType);
  };

  return (
    <div className={styles.fieldContainer}>
      <Row gutter={8} align="middle">
        <Col span={6}>
          <Input
            placeholder="Field name"
            value={localFieldName}
            onChange={(e) => handleNameChange(e.target.value)}
            disabled={disabled}
          />
        </Col>
        <Col span={16}>
          <AdvancedNestedTypeBuilder
            value={fieldType}
            onChange={handleTypeChange}
            disabled={disabled}
            depth={depth + 1}
            maxDepth={maxDepth}
          />
        </Col>
        <Col span={2}>
          <Button
            type="text"
            danger
            icon={<DeleteFilled />}
            onClick={() => onDelete(fieldName)}
            disabled={disabled}
          />
        </Col>
      </Row>
    </div>
  );
};

export const AdvancedNestedTypeBuilder: React.FC<
  AdvancedNestedTypeBuilderProps
> = ({ value, onChange, disabled = false, depth = 0, maxDepth = 3 }) => {
  const [typeName, setTypeName] = useState<TypeName>(value?.name || "STRING");

  useEffect(() => {
    if (value) {
      setTypeName(value.name);
    }
  }, [value]);

  const handleTypeNameChange = (newTypeName: TypeName) => {
    setTypeName(newTypeName);
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

  const handleElementTypeChange = (newElementType: Type) => {
    if (value?.name === "ARRAY") {
      onChange?.({
        name: "ARRAY",
        description: value.description,
        elementType: newElementType,
        defaultValue: value.defaultValue,
      });
    }
  };

  const addObjectField = useCallback(() => {
    if (value?.name === "OBJECT") {
      const schema = (value as ObjectType).schema || {};
      const fieldName = `field${Object.keys(schema).length + 1}`;
      const newSchema = {
        ...schema,
        [fieldName]: { name: "STRING" } as Type,
      };
      onChange?.({
        name: "OBJECT",
        description: value.description,
        schema: newSchema,
        defaultValue: value.defaultValue,
      });
    }
  }, [value, onChange]);

  const updateObjectField = useCallback(
    (oldName: string, newName: string, type: Type) => {
      if (value?.name === "OBJECT") {
        const schema = (value as ObjectType).schema || {};
        const newSchema = { ...schema };
        if (oldName !== newName) {
          delete newSchema[oldName];
        }
        newSchema[newName] = type;
        onChange?.({
          name: "OBJECT",
          description: value.description,
          schema: newSchema,
          defaultValue: value.defaultValue,
        });
      }
    },
    [value, onChange],
  );

  const deleteObjectField = useCallback(
    (fieldName: string) => {
      if (value?.name === "OBJECT") {
        const schema = (value as ObjectType).schema || {};
        const newSchema = { ...schema };
        delete newSchema[fieldName];
        onChange?.({
          name: "OBJECT",
          description: value.description,
          schema: newSchema,
          defaultValue: value.defaultValue,
        });
      }
    },
    [value, onChange],
  );

  const handleFileUpload = (file: File, expectedType: "array" | "object") => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);

        if (expectedType === "array" && Array.isArray(jsonData)) {
          onChange?.({
            ...value,
            defaultValue: jsonData,
          } as Type);
          message.success("JSON array uploaded successfully");
        } else if (
          expectedType === "object" &&
          typeof jsonData === "object" &&
          !Array.isArray(jsonData)
        ) {
          onChange?.({
            ...value,
            defaultValue: jsonData,
          } as Type);
          message.success("JSON object uploaded successfully");
        } else {
          message.error(`File must contain a valid JSON ${expectedType}`);
        }
      } catch (error) {
        message.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    return false;
  };

  const renderTypeSpecificBuilder = () => {
    if (depth >= maxDepth) {
      return (
        <div className={styles.maxDepthWarning}>
          Maximum nesting depth ({maxDepth}) reached. Use simple types only.
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
        const arrayDescription = value?.description || "";
        const handleArrayDescriptionChange = (newDescription: string) => {
          onChange?.({
            name: "ARRAY",
            description: newDescription || undefined,
            elementType: (value as ArrayType)?.elementType || {
              name: "STRING",
            },
            defaultValue: value?.defaultValue,
          });
        };

        return (
          <div className={styles.arrayBuilder}>
            <Form.Item label="Description" className={styles.formItem}>
              <Input
                placeholder="Type description"
                value={arrayDescription}
                onChange={(e) => handleArrayDescriptionChange(e.target.value)}
                disabled={disabled}
              />
            </Form.Item>
            <Form.Item label="Element Type" className={styles.elementTypeItem}>
              <AdvancedNestedTypeBuilder
                value={
                  (value as ArrayType)?.elementType || {
                    name: "STRING",
                  }
                }
                onChange={handleElementTypeChange}
                disabled={disabled}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            </Form.Item>
            <Form.Item label="Default Value" className={styles.formItem}>
              <div className={styles.defaultValueContainer}>
                <Upload
                  beforeUpload={(file) => handleFileUpload(file, "array")}
                  disabled={disabled}
                  showUploadList={false}
                  accept=".json"
                >
                  <Button icon={<UploadOutlined />} disabled={disabled}>
                    Upload JSON Array
                  </Button>
                </Upload>
                {value?.defaultValue && (
                  <div className={styles.jsonPreview}>
                    <pre>{JSON.stringify(value.defaultValue, null, 2)}</pre>
                  </div>
                )}
              </div>
            </Form.Item>
          </div>
        );
      case "OBJECT":
        const schema = (value as ObjectType)?.schema || {};
        const objectDescription = value?.description || "";
        const handleObjectDescriptionChange = (newDescription: string) => {
          onChange?.({
            name: "OBJECT",
            description: newDescription || undefined,
            schema: (value as ObjectType)?.schema || {},
            defaultValue: value?.defaultValue,
          });
        };

        return (
          <div className={styles.objectBuilder}>
            <Form.Item label="Description" className={styles.formItem}>
              <Input
                placeholder="Type description"
                value={objectDescription}
                onChange={(e) => handleObjectDescriptionChange(e.target.value)}
                disabled={disabled}
              />
            </Form.Item>
            <div className={styles.schemaSection}>
              <div className={styles.schemaHeader}>
                <span className={styles.schemaTitle}>Object Schema</span>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={addObjectField}
                  disabled={disabled}
                >
                  Add Field
                </Button>
              </div>

              {Object.keys(schema).length === 0 ? (
                <Alert
                  message="No fields defined"
                  description="Add fields to define the object structure"
                  type="info"
                  showIcon
                  className={styles.alertNoFields}
                />
              ) : (
                <div className={styles.fieldsContainer}>
                  {Object.entries(schema).map(([fieldName, fieldType]) => (
                    <ObjectField
                      key={fieldName}
                      fieldName={fieldName}
                      fieldType={fieldType}
                      onUpdate={updateObjectField}
                      onDelete={deleteObjectField}
                      disabled={disabled}
                      depth={depth}
                      maxDepth={maxDepth}
                    />
                  ))}
                </div>
              )}
            </div>
            <Form.Item label="Default Value" className={styles.formItem}>
              <div className={styles.defaultValueContainer}>
                <Upload
                  beforeUpload={(file) => handleFileUpload(file, "object")}
                  disabled={disabled}
                  showUploadList={false}
                  accept=".json"
                >
                  <Button icon={<UploadOutlined />} disabled={disabled}>
                    Upload JSON Object
                  </Button>
                </Upload>
                {value?.defaultValue && (
                  <div className={styles.jsonPreview}>
                    <pre>{JSON.stringify(value.defaultValue, null, 2)}</pre>
                  </div>
                )}
              </div>
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.advancedNestedTypeBuilder}>
      {depth > 0 ? (
        <Card
          size="small"
          className={`${styles.nestedCard} ${styles.nestedCardIndented}`}
        >
          <Space direction="vertical" className={styles.cardContent}>
            <Form.Item label="Type" className={styles.formItem}>
              <Select
                value={typeName}
                onChange={handleTypeNameChange}
                disabled={disabled}
                size="small"
                className={styles.typeSelect}
              >
                {Object.entries(TYPE_NAMES).map(([key, value]) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {renderTypeSpecificBuilder()}
          </Space>
        </Card>
      ) : (
        <div className={styles.rootTypeBuilder}>
          {renderTypeSpecificBuilder()}
        </div>
      )}
    </div>
  );
};
