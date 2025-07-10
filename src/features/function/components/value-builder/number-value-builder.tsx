import { type FC } from "react";

import type { NumberValue } from "../../types";

export interface NumberValueBuilderProps {
  value?: NumberValue;
  onChange?: (value: NumberValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const NumberValueBuilder: FC<NumberValueBuilderProps> = ({
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  return <div>NumberValueBuilder</div>;
};
