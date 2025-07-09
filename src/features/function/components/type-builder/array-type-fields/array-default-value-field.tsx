import type { ArrayValue, Type } from "@/features/function/types";
import { parseArrayJson } from "@/features/function/utils/parse-array-json";
import { UploadValueFileButton } from "@/features/function/components/upload-value-file-button";
import { Box } from "@mui/material";
import { Collapse, Typography } from "antd";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export interface ArrayDefaultValueFieldProps {
  elementType: Type;
  value?: ArrayValue;
  onChange?: (value?: ArrayValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const ArrayDefaultValueField: FC<ArrayDefaultValueFieldProps> = ({
  elementType,
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const { t } = useTranslation();

  const [arrayDefaultValue, setArrayDefaultValue] = useState<
    ArrayValue | undefined
  >(
    value || {
      typeName: "ARRAY",
      data: [],
    },
  );

  const handleFileUploaded = (response: any) => {
    const newArrayDefaultValue = {
      typeName: "ARRAY",
      id: response.id,
    } as ArrayValue;
    setArrayDefaultValue(newArrayDefaultValue);
    onChange?.(newArrayDefaultValue);
  };

  const handleFileRemoved = () => {
    setArrayDefaultValue(undefined);
    onChange?.(undefined);
  };

  const validateArrayFile = (content: string) => {
    parseArrayJson(content, elementType);
  };

  const renderCollapseChildren = () => {
    return <Text>{JSON.stringify(arrayDefaultValue?.data)}</Text>;
  };

  return readOnly ? (
    <Collapse
      items={[
        {
          key: "1",
          label: t("default-value"),
          children: renderCollapseChildren(),
        },
      ]}
    />
  ) : (
    <Box>
      <UploadValueFileButton
        onFileUploaded={handleFileUploaded}
        onFileRemoved={handleFileRemoved}
        validateFile={validateArrayFile}
        acceptedFileTypes=".json"
        disabled={disabled}
      />
    </Box>
  );
};
