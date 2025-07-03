import { Tooltip } from "antd";
import { type FC, type PropsWithChildren } from "react";

import type { Type } from "../../function-types";
import { getTypeRepresentation } from "../../utils/label-utils";
import styles from "./type-tooltip.module.css";

interface TypeTooltipProps extends PropsWithChildren {
  type: Type;
}

export const TypeTooltip: FC<TypeTooltipProps> = ({ type, children }) => {
  if (type.name !== "OBJECT" || !type.schema) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      title={<pre>{JSON.stringify(getTypeRepresentation(type), null, 2)}</pre>}
      placement="top"
      className={styles.typeTooltip}
    >
      {children}
    </Tooltip>
  );
};
