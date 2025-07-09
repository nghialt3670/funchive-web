import type { ObjectValue, Type } from "@/features/function/types";
import { parseObjectJson } from "@/features/function/utils/parse-object-json";
import { UploadValueFileButton } from "@/features/function/components/upload-value-file-button";
import { Box } from "@mui/material";
import { Collapse, Typography } from "antd";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export interface ObjectDefaultValueFieldProps {
  schema: Record<string, Type>;
  value?: ObjectValue;
  onChange?: (value?: ObjectValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const ObjectDefaultValueField: FC<ObjectDefaultValueFieldProps> = ({
  schema,
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const { t } = useTranslation();

  const [objectDefaultValue, setObjectDefaultValue] = useState<
    ObjectValue | undefined
  >(
    value || {
      typeName: "OBJECT",
      data: {},
    },
  );

  const handleFileUploaded = (response: any) => {
    const newObjectDefaultValue = {
      typeName: "OBJECT",
      id: response.id,
    } as ObjectValue;
    setObjectDefaultValue(newObjectDefaultValue);
    onChange?.(newObjectDefaultValue);
  };

  const handleFileRemoved = () => {
    setObjectDefaultValue(undefined);
    onChange?.(undefined);
  };

  const validateObjectFile = (content: string) => {
    parseObjectJson(content, schema);
  };

  const renderCollapseChildren = () => {
    return <Text>{JSON.stringify(objectDefaultValue?.data)}</Text>;
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
        validateFile={validateObjectFile}
        acceptedFileTypes=".json"
        disabled={disabled}
      />
    </Box>
  );
};
