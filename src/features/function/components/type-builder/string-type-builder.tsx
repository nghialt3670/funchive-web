import type { StringType } from "@/features/function/types";
import { Form, Input } from "antd";
import React from "react";

import styles from "./string-type-builder.module.css";

interface StringTypeBuilderProps {
  value?: StringType;
  onChange?: (type: StringType) => void;
  disabled?: boolean;
}

export const StringTypeBuilder: React.FC<StringTypeBuilderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const description = value?.description || "";
  const defaultValue = value?.defaultValue || "";

  const handleDescriptionChange = (newDescription: string) => {
    onChange?.({
      name: "STRING",
      description: newDescription || undefined,
      defaultValue: value?.defaultValue,
    });
  };

  const handleDefaultValueChange = (newDefaultValue: string) => {
    onChange?.({
      name: "STRING",
      description: value?.description,
      defaultValue: newDefaultValue || undefined,
    });
  };

  return (
    <div className={styles.stringTypeBuilder}>
      <Form.Item label="Description" className={styles.formItem}>
        <Input
          placeholder="Type description"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          disabled={disabled}
        />
      </Form.Item>

      <Form.Item label="Default Value" className={styles.formItem}>
        <Input
          placeholder="Default string value"
          value={defaultValue}
          onChange={(e) => handleDefaultValueChange(e.target.value)}
          disabled={disabled}
        />
      </Form.Item>
    </div>
  );
};
