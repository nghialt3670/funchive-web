import type { StringValue } from "@/features/function/types";
import { UploadValueFileButton } from "@/features/function/components/upload-value-file-button";
import { Stack } from "@mui/material";
import {
  Collapse,
  Input,
  Typography,
} from "antd";
import { type ChangeEvent, type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMeasure } from "react-use";

const { TextArea } = Input;
const { Text } = Typography;

export interface StringDefaultValueFieldProps {
  value?: StringValue;
  onChange?: (value?: StringValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const StringDefaultValueField: FC<StringDefaultValueFieldProps> = ({
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const { t } = useTranslation();
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  const isSmallScreen = width && width < 550;

  const [stringDefaultValue, setStringDefaultValue] = useState<
    StringValue | undefined
  >(value);

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newStringValue = {
      typeName: "STRING",
      data: e.target.value,
    } as StringValue;
    setStringDefaultValue(newStringValue);
    onChange?.(newStringValue);
  };

  const handleFileUploaded = (response: any) => {
    const newStringValue = {
      typeName: "STRING",
      id: response.id,
    } as StringValue;
    setStringDefaultValue(newStringValue);
    onChange?.(newStringValue);
  };

  const handleFileRemoved = () => {
    setStringDefaultValue(undefined);
    onChange?.(undefined);
  };

  return readOnly ? (
    <Collapse
      items={[
        {
          key: "1",
          label: t("default-value"),
          children: <Text strong>{stringDefaultValue?.data}</Text>,
        },
      ]}
    />
  ) : (
    <Stack direction="row" gap={1} ref={ref}>
      <TextArea
        placeholder={t("default-value-placeholder")}
        value={stringDefaultValue?.data}
        onChange={handleTextAreaChange}
        disabled={disabled}
        readOnly={readOnly}
        autoSize={{ minRows: 1, maxRows: 5 }}
      />
      <UploadValueFileButton
        onFileUploaded={handleFileUploaded}
        onFileRemoved={handleFileRemoved}
        acceptedFileTypes=".txt"
        uploadButtonText={isSmallScreen ? undefined : t("upload-text-file")}
        disabled={disabled}
        showFileName={false}
      />
    </Stack>
  );
};
