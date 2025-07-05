import { omit } from "lodash";
import { useState } from "react";

import type { Type } from "../../types";

interface UseDefaultValueProps {
  value?: Type;
  onChange?: (type: any) => void;
  disabled?: boolean;
}

export const useDefaultValue = ({
  value,
  onChange,
  disabled = false,
}: UseDefaultValueProps) => {
  const [hasDefaultValue, setHasDefaultValue] = useState(false);

  const handleHasDefaultValueChange = (checked: boolean) => {
    setHasDefaultValue(checked);
    if (!checked) {
      onChange?.(omit(value, "defaultValue"));
    }
  };

  const clearDefaultValue = () => {
    onChange?.(omit(value, "defaultValue"));
  };

  return {
    hasDefaultValue,
    setHasDefaultValue,
    handleHasDefaultValueChange,
    clearDefaultValue,
    isDisabled: disabled,
  };
};
