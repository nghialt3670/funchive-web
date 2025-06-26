import React from 'react';
import { Form, Input, InputNumber } from 'antd';
import type { NumberType } from '@/features/function/function-types';
import styles from './number-type-builder.module.css';

interface NumberTypeBuilderProps {
  value?: NumberType;
  onChange?: (type: NumberType) => void;
  disabled?: boolean;
}

export const NumberTypeBuilder: React.FC<NumberTypeBuilderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const description = value?.description || '';
  const defaultValue = value?.defaultValue;

  const handleDescriptionChange = (newDescription: string) => {
    onChange?.({
      name: 'NUMBER',
      description: newDescription || undefined,
      defaultValue: value?.defaultValue,
    });
  };

  const handleDefaultValueChange = (newDefaultValue: number | null) => {
    onChange?.({
      name: 'NUMBER',
      description: value?.description,
      defaultValue: newDefaultValue || undefined,
    });
  };

  return (
    <div className={styles.numberTypeBuilder}>
      <Form.Item label="Description" className={styles.formItem}>
        <Input
          placeholder="Type description"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          disabled={disabled}
        />
      </Form.Item>

      <Form.Item label="Default Value" className={styles.formItem}>
        <InputNumber
          placeholder="Default number value"
          value={defaultValue}
          onChange={handleDefaultValueChange}
          className={styles.numberInput}
          disabled={disabled}
        />
      </Form.Item>
    </div>
  );
};
