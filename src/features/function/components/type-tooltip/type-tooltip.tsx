import { Tooltip } from "antd";
import React, { type PropsWithChildren } from "react";

import type { Type } from "../../function-types";
import { getTypeRepresentation } from "../../utils/label-utils";

interface TypeTooltipProps extends PropsWithChildren {
  type: Type;
}

export const TypeTooltip: React.FC<TypeTooltipProps> = ({ type, children }) => {
  if (type.name !== "OBJECT" || !type.schema) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      title={<pre>{JSON.stringify(getTypeRepresentation(type), null, 2)}</pre>}
      placement="top"
    >
      {children}
    </Tooltip>
  );
};
