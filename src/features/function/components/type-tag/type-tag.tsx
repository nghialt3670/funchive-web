import { Tag } from "antd";
import type { FC } from "react";

import type { Type } from "../../function-types";
import styles from "./type-tag.module.css";

export interface TypeTagProps {
  type: Type;
}

export const TypeTag: FC<TypeTagProps> = ({ type }) => {
  const getTypeClass = (typeName: string) => {
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

  const typeClass = getTypeClass(type.name);

  return (
      <Tag className={`${styles.typeTag} ${styles[typeClass]}`}>
        {type.name}
      </Tag>
  );
};
