import { Box } from "@mui/material";
import { Switch, Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface DefaultValueLabelProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const DefaultValueLabel: React.FC<DefaultValueLabelProps> = ({
  checked,
  onChange,
  disabled,
  readOnly,
}) => {
  const { t } = useTranslation();

  if (readOnly) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      gap={1}
      justifyContent="flex-start"
      alignItems="center"
    >
      <Text style={{ width: "fit-content", textWrap: "nowrap" }}>
        {t("default-value")}
      </Text>
      {!readOnly && (
        <Switch
          size="small"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{ alignItems: "baseline" }}
        />
      )}
    </Box>
  );
};
