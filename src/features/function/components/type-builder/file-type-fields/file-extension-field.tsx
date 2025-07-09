import { usePageMode } from "@/hooks/use-page-mode";
import { Stack } from "@mui/material";
import { Input, Typography } from "antd";
import { type ChangeEvent, type FC, useState } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface FileExtensionFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

export const FileExtensionField: FC<FileExtensionFieldProps> = ({
  value,
  onChange,
  readOnly,
  disabled,
}) => {
  const { t } = useTranslation();
  const { pageMode } = usePageMode();

  const [fileExtension, setFileExtension] = useState(value);

  const showLabel = !readOnly && (pageMode === "edit" || pageMode === "create");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileExtension(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <Stack direction="column" gap={1}>
      {showLabel && <Text>{t("file-extension")}</Text>}
      <Input
        value={fileExtension}
        onChange={handleChange}
        placeholder={t("file-extension-placeholder")}
        disabled={disabled}
        readOnly={readOnly}
      />
    </Stack>
  );
};
