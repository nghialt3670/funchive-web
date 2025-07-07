import type { ArrayType, Type } from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { UploadOutlined } from "@ant-design/icons";
import { Stack } from "@mui/material";
import { Button, Typography, Upload } from "antd";
import { useTranslation } from "react-i18next";

import { DefaultValueLabel } from "./default-value-label";
import { TypeBuilder } from "./type-builder";
import { useDefaultValue } from "./use-default-value";

const { Paragraph, Text } = Typography;

interface ArrayTypeBuilderProps {
  value?: ArrayType;
  defaultValue?: ArrayType;
  onChange?: (type: ArrayType) => void;
  depth?: number;
  maxDepth?: number;
  onDepthChange?: (depth: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const ArrayTypeBuilder: React.FC<ArrayTypeBuilderProps> = ({
  value,
  defaultValue,
  onChange,
  depth = 0,
  maxDepth = 5,
  onDepthChange,
  disabled,
  readOnly,
}) => {
  const { t } = useTranslation();
  const { t: nt } = useNamespacedTranslation();
  const { hasDefaultValue, handleHasDefaultValueChange, isDisabled } =
    useDefaultValue({
      value,
      onChange,
      disabled,
    });

  if (!value && defaultValue) {
    onChange?.(defaultValue);
  }

  if (!value?.elementType) {
    onChange?.({
      name: "ARRAY",
      elementType: { name: "STRING" },
    });
  }

  const handleElementTypeChange = (elementType: Type) => {
    onChange?.({
      name: "ARRAY",
      elementType,
    });
  };

  return (
    <Stack direction="column" width="100%" gap={2}>
      {readOnly ? (
        <TypeBuilder
          value={value?.elementType}
          onChange={handleElementTypeChange}
          label={nt("element-type")}
          disabled={isDisabled}
          depth={depth + 1}
          maxDepth={maxDepth}
          onDepthChange={onDepthChange}
          readOnly={readOnly}
        />
      ) : (
        <Stack direction="column" gap={1}>
          <Text>{nt("element-type")}</Text>
          <TypeBuilder
            value={value?.elementType}
            onChange={handleElementTypeChange}
            label=""
            disabled={isDisabled}
            depth={depth + 1}
            maxDepth={maxDepth}
            onDepthChange={onDepthChange}
            readOnly={readOnly}
          />
        </Stack>
      )}
      {readOnly ? (
        hasDefaultValue && (
          <Paragraph>{value?.defaultValue?.data as string}</Paragraph>
        )
      ) : (
        <Stack direction="column" width="100%" gap={1}>
          <DefaultValueLabel
            checked={hasDefaultValue}
            onChange={handleHasDefaultValueChange}
            disabled={isDisabled}
            readOnly={readOnly}
          />

          {hasDefaultValue && (
            <Upload
              showUploadList={false}
              disabled={isDisabled || !hasDefaultValue}
            >
              <Button
                icon={<UploadOutlined />}
                disabled={isDisabled || !hasDefaultValue}
              >
                {t("upload-json-file")}
              </Button>
            </Upload>
          )}
        </Stack>
      )}
    </Stack>
  );
};
