import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Switch,
  InputNumber,
  Collapse,
  Alert,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import type {
  Type,
  TypeName,
  ObjectType,
  ArrayType,
  FileType,
} from "@/features/function/function-types";
import { TYPE_NAMES } from "@/features/function/function-types";
import styles from "./type-builder.module.css";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;
const { Panel } = Collapse;

interface TypeBuilderProps {
  value?: Type;
  onChange?: (type: Type) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

interface ObjectFieldProps {
  fieldName: string;
  fieldType: Type;
  onUpdate: (oldName: string, newName: string, type: Type) => void;
  onDelete: (name: string) => void;
  disabled?: boolean;
}

const ObjectField: React.FC<ObjectFieldProps> = ({
  fieldName,
  fieldType,
  onUpdate,
  onDelete,
  disabled,
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
          <TypeBuilder
            value={fieldType}
            onChange={handleTypeChange}
            disabled={disabled}
          />
        </Col>
        <Col span={2}>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(fieldName)}
            disabled={disabled}
          />
        </Col>
      </Row>
    </div>
  );
};

export const TypeBuilder: React.FC<TypeBuilderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [typeName, setTypeName] = useState<TypeName>(value?.name || "STRING");
  const [description, setDescription] = useState<string>(
    value?.description || "",
  );
  const [defaultValue, setDefaultValue] = useState<any>(value?.defaultValue);

  const [fileExtension, setFileExtension] = useState(
    (value as FileType)?.extension || "",
  );
  const [elementType, setElementType] = useState<Type>(
    (value as ArrayType)?.elementType || { name: "STRING" },
  );
  const [objectSchema, setObjectSchema] = useState<Record<string, Type>>(
    (value as ObjectType)?.schema || {},
  );

  useEffect(() => {
    if (value) {
      setTypeName(value.name);
      setDescription(value.description || "");
      setDefaultValue(value.defaultValue);

      if (value.name === "FILE") {
        setFileExtension((value as FileType).extension || "");
      } else if (value.name === "ARRAY") {
        setElementType((value as ArrayType).elementType);
      } else if (value.name === "OBJECT") {
        setObjectSchema((value as ObjectType).schema || {});
      }
    }
    setIsInitialized(true);
  }, [value]);

  const buildType = useCallback((): Type => {
    const baseProps = {
      description: description || undefined,
      defaultValue: defaultValue || undefined,
    };

    switch (typeName) {
      case "STRING":
        return { name: "STRING", ...baseProps };
      case "NUMBER":
        return { name: "NUMBER", ...baseProps };
      case "BOOLEAN":
        return { name: "BOOLEAN", ...baseProps };
      case "FILE":
        return {
          name: "FILE",
          ...baseProps,
          extension: fileExtension || undefined,
        };
      case "ARRAY":
        return {
          name: "ARRAY",
          ...baseProps,
          elementType: elementType,
        };
      case "OBJECT":
        return {
          name: "OBJECT",
          ...baseProps,
          schema: objectSchema,
        };
      default:
        return { name: "STRING", ...baseProps };
    }
  }, [
    typeName,
    description,
    defaultValue,
    fileExtension,
    elementType,
    objectSchema,
  ]);

  useEffect(() => {
    // Only call onChange if we have dependencies that actually changed
    // Don't call on the initial mount or when just the onChange function reference changes
    if (onChange && isInitialized) {
      const newType = buildType();
      onChange(newType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    typeName,
    description,
    defaultValue,
    fileExtension,
    elementType,
    objectSchema,
    isInitialized,
    // Note: onChange intentionally excluded to prevent infinite loops
  ]);

  const handleTypeNameChange = (newTypeName: TypeName) => {
    setTypeName(newTypeName);
    // Reset type-specific values
    setFileExtension("");
    setElementType({ name: "STRING" });
    setObjectSchema({});
    setDefaultValue(undefined);
  };

  const addObjectField = useCallback(() => {
    const fieldName = `field${Object.keys(objectSchema).length + 1}`;
    setObjectSchema((prev) => ({
      ...prev,
      [fieldName]: { name: "STRING" },
    }));
  }, [objectSchema]);

  const updateObjectField = useCallback(
    (oldName: string, newName: string, type: Type) => {
      setObjectSchema((prev) => {
        const newSchema = { ...prev };
        if (oldName !== newName) {
          delete newSchema[oldName];
        }
        newSchema[newName] = type;
        return newSchema;
      });
    },
    [],
  );

  const deleteObjectField = useCallback((fieldName: string) => {
    setObjectSchema((prev) => {
      const newSchema = { ...prev };
      delete newSchema[fieldName];
      return newSchema;
    });
  }, []);

  const getDefaultValueInput = () => {
    switch (typeName) {
      case "STRING":
        return (
          <Input
            placeholder="Default string value"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
            disabled={disabled}
          />
        );
      case "NUMBER":
        return (
          <InputNumber
            placeholder="Default number value"
            value={defaultValue}
            onChange={setDefaultValue}
            className={styles.numberInput}
            disabled={disabled}
          />
        );
      case "BOOLEAN":
        return (
          <Switch
            checked={defaultValue}
            onChange={setDefaultValue}
            disabled={disabled}
          />
        );
      case "FILE":
      case "ARRAY":
      case "OBJECT":
        return (
          <TextArea
            placeholder="Default value (JSON format)"
            value={defaultValue ? JSON.stringify(defaultValue, null, 2) : ""}
            onChange={(e) => {
              try {
                setDefaultValue(JSON.parse(e.target.value));
              } catch {
                // Invalid JSON, keep as string for now
                setDefaultValue(e.target.value);
              }
            }}
            rows={3}
            disabled={disabled}
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
          <Row gutter={16} className={styles.typeRow}>
            <Col span={6}>
              <Form.Item label="Type" className={styles.formItem}>
                <Select
                  value={typeName}
                  onChange={handleTypeNameChange}
                  disabled={disabled}
                >
                  {Object.entries(TYPE_NAMES).map(([key, value]) => (
                    <Option key={key} value={value}>
                      <Space>{value}</Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={18} className={styles.descriptionCol}>
              <Form.Item label="Description" className={styles.formItem}>
                <Input
                  placeholder="Type description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={disabled}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Type-specific configurations */}
          {typeName === "FILE" && (
            <Form.Item
              label="File Extension"
              className={styles.fileExtensionItem}
            >
              <Input
                placeholder="e.g., .pdf, .jpg, .txt"
                value={fileExtension}
                onChange={(e) => setFileExtension(e.target.value)}
                disabled={disabled}
              />
            </Form.Item>
          )}

          {typeName === "ARRAY" && (
            <div>
              <Form.Item
                label="Element Type"
                className={styles.elementTypeItem}
              >
                <TypeBuilder
                  value={elementType}
                  onChange={setElementType}
                  disabled={disabled}
                />
              </Form.Item>
            </div>
          )}

          {typeName === "OBJECT" && (
            <div>
              <div className={styles.schemaHeader}>
                <Text strong>Object Schema</Text>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={addObjectField}
                  size="small"
                  disabled={disabled}
                >
                  Add Field
                </Button>
              </div>

              {Object.keys(objectSchema).length === 0 ? (
                <Alert
                  message="No fields defined"
                  description="Add fields to define the object structure"
                  type="info"
                  showIcon
                  className={styles.alertNoFields}
                />
              ) : (
                <div className={styles.fieldsContainer}>
                  {Object.entries(objectSchema).map(
                    ([fieldName, fieldType]) => (
                      <ObjectField
                        key={fieldName}
                        fieldName={fieldName}
                        fieldType={fieldType}
                        onUpdate={updateObjectField}
                        onDelete={deleteObjectField}
                        disabled={disabled}
                      />
                    ),
                  )}
                </div>
              )}
            </div>
          )}

          {/* Default Value */}
          <Collapse size="small">
            <Panel
              header={
                <Space>
                  <InfoCircleOutlined />
                  <Text>Default Value (Optional)</Text>
                </Space>
              }
              key="defaultValue"
            >
              {getDefaultValueInput()}
            </Panel>
          </Collapse>

          {/* Type Preview */}
          <Collapse size="small">
            <Panel
              header={
                <Space>
                  <CodeOutlined />
                  <Text>Type Preview</Text>
                </Space>
              }
              key="preview"
            >
              <pre className={styles.previewCode}>
                {JSON.stringify(buildType(), null, 2)}
              </pre>
            </Panel>
          </Collapse>
        </Space>
      </Card>
    </div>
  );
};
