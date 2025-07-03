import type { BooleanType } from "@/features/function/types";
import { Form, Input, Switch } from "antd";
import React from "react";

import styles from "./boolean-type-builder.module.css";

interface BooleanTypeBuilderProps {
  value?: BooleanType;
  onChange?: (type: BooleanType) => void;
  disabled?: boolean;
}

export const BooleanTypeBuilder: React.FC<BooleanTypeBuilderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const description = value?.description || "";
  const defaultValue = value?.defaultValue;

  const handleDescriptionChange = (newDescription: string) => {
    onChange?.({
      name: "BOOLEAN",
      description: newDescription || undefined,
      defaultValue: value?.defaultValue,
    });
  };

  const handleDefaultValueChange = (newDefaultValue: boolean) => {
    onChange?.({
      name: "BOOLEAN",
      description: value?.description,
      defaultValue: newDefaultValue,
    });
  };

  return (
    <div className={styles.booleanTypeBuilder}>
      <Form.Item label="Description" className={styles.formItem}>
        <Input
          placeholder="Type description"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          disabled={disabled}
        />
      </Form.Item>

      <Form.Item label="Default Value" className={styles.formItem}>
        <Switch
          checked={defaultValue}
          onChange={handleDefaultValueChange}
          disabled={disabled}
        />
      </Form.Item>
    </div>
  );
};
