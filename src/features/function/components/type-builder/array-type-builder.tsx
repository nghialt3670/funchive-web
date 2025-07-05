import type { ArrayType, Type } from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { UploadOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import { Button, Form, Typography, Upload } from "antd";
import { useTranslation } from "react-i18next";

import { DefaultValueLabel } from "./default-value-label";
import { TypeBuilder } from "./type-builder";
import { useDefaultValue } from "./use-default-value";

const { Paragraph } = Typography;

interface ArrayTypeBuilderProps {
  value?: ArrayType;
  onChange?: (type: ArrayType) => void;
  depth?: number;
  maxDepth?: number;
  onDepthChange?: (depth: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const ArrayTypeBuilder: React.FC<ArrayTypeBuilderProps> = ({
  value,
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
    <Box display="flex" flexDirection="column" width="100%">
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
      {readOnly ? (
        hasDefaultValue && (
          <Box display="flex" flexDirection="row" gap={1}>
            <Paragraph>{value?.defaultValue?.data as string}</Paragraph>
          </Box>
        )
      ) : (
        <Form.Item
          label={
            <DefaultValueLabel
              checked={hasDefaultValue}
              onChange={handleHasDefaultValueChange}
              disabled={isDisabled}
              readOnly={readOnly}
            />
          }
          style={{ width: "100%", marginBottom: hasDefaultValue ? 0 : -40 }}
        >
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
        </Form.Item>
      )}
    </Box>
  );
};
