import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Switch,
  InputNumber,
  Upload,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import type {
  Type,
  ObjectType,
  ArrayType,
  FileType,
} from '@/features/function/function-types';
import styles from './value-builder.module.css';

const { TextArea } = Input;
const { Text } = Typography;

interface ValueBuilderProps {
  type: Type;
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  label?: string;
}

interface ObjectFieldValueProps {
  fieldName: string;
  fieldType: Type;
  value?: any;
  onChange: (fieldName: string, value: any) => void;
  disabled?: boolean;
}

const ObjectFieldValue: React.FC<ObjectFieldValueProps> = ({
  fieldName,
  fieldType,
  value,
  onChange,
  disabled,
}) => {
  const handleChange = (newValue: any) => {
    onChange(fieldName, newValue);
  };

  return (
    <div className={styles.fieldContainer}>
      <Row gutter={8} align="middle">
        <Col span={6}>
          <Text strong>{fieldName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {fieldType.name}
          </Text>
        </Col>
        <Col span={18}>
          <ValueBuilder
            type={fieldType}
            value={value}
            onChange={handleChange}
            disabled={disabled}
          />
        </Col>
      </Row>
    </div>
  );
};

export const ValueBuilder: React.FC<ValueBuilderProps> = ({
  type,
  value,
  onChange,
  disabled = false,
  label,
}) => {
  const [currentValue, setCurrentValue] = useState<any>(
    value !== undefined ? value : getDefaultValue(type),
  );
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
    setIsInitialized(true);
  }, [value]);

  useEffect(() => {
    validateValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    // Only call onChange after initial mount to prevent infinite loops
    if (onChange && isInitialized) {
      onChange(currentValue);
    }
  }, [currentValue, isInitialized]);

  function getDefaultValue(type: Type): any {
    if (type.defaultValue !== undefined) {
      return type.defaultValue;
    }

    switch (type.name) {
      case 'STRING':
        return '';
      case 'NUMBER':
        return 0;
      case 'BOOLEAN':
        return false;
      case 'FILE':
        return null;
      case 'ARRAY':
        return [];
      case 'OBJECT':
        const objectType = type as ObjectType;
        const defaultObj: any = {};
        Object.entries(objectType.schema || {}).forEach(([key, fieldType]) => {
          defaultObj[key] = getDefaultValue(fieldType);
        });
        return defaultObj;
      default:
        return null;
    }
  }

  const validateValue = (val: any): boolean => {
    try {
      switch (type.name) {
        case 'STRING':
          if (typeof val !== 'string') {
            setValidationError('Value must be a string');
            setIsValid(false);
            return false;
          }
          break;
        case 'NUMBER':
          if (typeof val !== 'number' || isNaN(val)) {
            setValidationError('Value must be a valid number');
            setIsValid(false);
            return false;
          }
          break;
        case 'BOOLEAN':
          if (typeof val !== 'boolean') {
            setValidationError('Value must be a boolean');
            setIsValid(false);
            return false;
          }
          break;
        case 'ARRAY':
          if (!Array.isArray(val)) {
            setValidationError('Value must be an array');
            setIsValid(false);
            return false;
          }
          break;
        case 'OBJECT':
          if (typeof val !== 'object' || val === null || Array.isArray(val)) {
            setValidationError('Value must be an object');
            setIsValid(false);
            return false;
          }
          break;
      }

      setValidationError('');
      setIsValid(true);
      return true;
    } catch (error) {
      setValidationError('Invalid value');
      setIsValid(false);
      return false;
    }
  };

  const handleValueChange = useCallback((newValue: any) => {
    setCurrentValue(newValue);
  }, []);

  const renderValueInput = () => {
    switch (type.name) {
      case 'STRING':
        return (
          <Input
            placeholder="Enter string value"
            value={currentValue}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
          />
        );

      case 'NUMBER':
        return (
          <InputNumber
            placeholder="Enter number value"
            value={currentValue}
            onChange={(val) => handleValueChange(val || 0)}
            className={styles.numberInput}
            disabled={disabled}
          />
        );

      case 'BOOLEAN':
        return (
          <Switch
            checked={currentValue}
            onChange={handleValueChange}
            disabled={disabled}
            checkedChildren="True"
            unCheckedChildren="False"
          />
        );

      case 'FILE':
        const fileType = type as FileType;
        return (
          <Upload
            beforeUpload={() => false} // Prevent auto upload
            onChange={(info) => {
              if (info.fileList.length > 0) {
                const file = info.fileList[0].originFileObj;
                handleValueChange(file);
              } else {
                handleValueChange(null);
              }
            }}
            accept={fileType.extension}
            maxCount={1}
            disabled={disabled}
            className={styles.fileUpload}
          >
            <Button icon={<UploadOutlined />} disabled={disabled}>
              {fileType.extension
                ? `Upload ${fileType.extension} file`
                : 'Upload file'}
            </Button>
          </Upload>
        );

      case 'ARRAY':
        const arrayType = type as ArrayType;
        const arrayValue = Array.isArray(currentValue) ? currentValue : [];

        return (
          <div className={styles.arrayContainer}>
            <div className={styles.objectFieldsHeader}>
              <Text>Array Items ({arrayValue.length})</Text>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                size="small"
                onClick={() => {
                  const newItem = getDefaultValue(arrayType.elementType);
                  handleValueChange([...arrayValue, newItem]);
                }}
                disabled={disabled}
              >
                Add Item
              </Button>
            </div>

            {arrayValue.map((item: any, index: number) => (
              <div key={index} className={styles.arrayItem}>
                <div className={styles.arrayItemInput}>
                  <ValueBuilder
                    type={arrayType.elementType}
                    value={item}
                    onChange={(newValue) => {
                      const newArray = [...arrayValue];
                      newArray[index] = newValue;
                      handleValueChange(newArray);
                    }}
                    disabled={disabled}
                  />
                </div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => {
                    const newArray = arrayValue.filter(
                      (_: any, i: number) => i !== index,
                    );
                    handleValueChange(newArray);
                  }}
                  disabled={disabled}
                />
              </div>
            ))}

            {arrayValue.length === 0 && (
              <Text type="secondary" style={{ fontStyle: 'italic' }}>
                No items in array. Click "Add Item" to start.
              </Text>
            )}
          </div>
        );

      case 'OBJECT':
        const objectType = type as ObjectType;
        const objectValue =
          typeof currentValue === 'object' && currentValue !== null
            ? currentValue
            : {};

        return (
          <div>
            <div className={styles.objectFieldsHeader}>
              <Text>Object Fields</Text>
            </div>

            {Object.entries(objectType.schema || {}).length === 0 ? (
              <Alert
                message="No fields defined"
                description="This object type has no defined fields"
                type="info"
                showIcon
              />
            ) : (
              <div className={styles.fieldsContainer}>
                {Object.entries(objectType.schema || {}).map(
                  ([fieldName, fieldType]) => (
                    <ObjectFieldValue
                      key={fieldName}
                      fieldName={fieldName}
                      fieldType={fieldType}
                      value={objectValue[fieldName]}
                      onChange={(field, val) => {
                        handleValueChange({
                          ...objectValue,
                          [field]: val,
                        });
                      }}
                      disabled={disabled}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <TextArea
            placeholder="Enter value as JSON"
            value={JSON.stringify(currentValue, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleValueChange(parsed);
              } catch {
                // Keep the raw text value for now
                handleValueChange(e.target.value);
              }
            }}
            rows={3}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div>
      <Card
        size="small"
        className={`${styles.valueBuilderCard} ${isValid ? styles.validState : styles.errorState}`}
        title={
          label ? (
            <Space>
              <Text strong>{label}</Text>
              <Text type="secondary">({type.name})</Text>
            </Space>
          ) : undefined
        }
      >
        <Space direction="vertical" className={styles.cardContent}>
          {type.description && (
            <Text
              type="secondary"
              style={{ fontSize: '12px', fontStyle: 'italic' }}
            >
              {type.description}
            </Text>
          )}

          {!isValid && validationError && (
            <Alert
              message="Invalid Value"
              description={validationError}
              type="error"
              showIcon
            />
          )}

          <div className={styles.valueRow}>{renderValueInput()}</div>

          {/* Value Preview */}
          <details>
            <summary
              style={{
                cursor: 'pointer',
                fontSize: '12px',
                color: '#666',
              }}
            >
              <CodeOutlined /> Show JSON Preview
            </summary>
            <div className={styles.valuePreview}>
              {JSON.stringify(currentValue, null, 2)}
            </div>
          </details>
        </Space>
      </Card>
    </div>
  );
};
