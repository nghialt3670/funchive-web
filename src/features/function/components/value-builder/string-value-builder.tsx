import { type FC } from "react";

import type { StringValue } from "../../types";

export interface StringValueBuilderProps {
  value?: StringValue;
  onChange?: (value: StringValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const StringValueBuilder: FC<StringValueBuilderProps> = ({
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  return <div>StringValueBuilder</div>;
};
