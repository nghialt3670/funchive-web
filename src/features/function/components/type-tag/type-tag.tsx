import { Tag } from "antd";
import type { FC } from "react";

import type { TypeName } from "../../types";
import styles from "./type-tag.module.css";

export interface TypeTagProps {
  typeName: TypeName;
}

export const TypeTag: FC<TypeTagProps> = ({ typeName }) => {
  const getTypeClass = (typeName: TypeName) => {
    switch (typeName) {
      case "STRING":
        return "string";
      case "NUMBER":
        return "number";
      case "BOOLEAN":
        return "boolean";
      case "FILE":
        return "file";
      case "ARRAY":
        return "array";
      case "OBJECT":
        return "object";
      default:
        return "default";
    }
  };

  const typeClass = getTypeClass(typeName);

  return (
    <Tag className={`${styles.typeTag} ${styles[typeClass]}`}>{typeName}</Tag>
  );
};
