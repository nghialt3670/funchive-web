import type { ObjectType, Type } from "@/features/function/types";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import { Button, Card, Form, Switch, Typography, Upload } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TypeBuilder } from "./type-builder";

const { Text } = Typography;

interface ObjectTypeBuilderProps {
  value?: ObjectType;
  onChange?: (type: Type) => void;
  disabled?: boolean;
}

export const ObjectTypeBuilder: React.FC<ObjectTypeBuilderProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation();
  const [hasDefaultValue, setHasDefaultValue] = useState(false);
  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Form.Item
        label={
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            justifyContent="center"
            alignItems="center"
          >
            <Text style={{ width: "fit-content", textWrap: "nowrap" }}>
              {t("data-fields")}
            </Text>
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                onChange?.({
                  name: "OBJECT",
                  schema: { ...value?.schema, field1: { name: "STRING" } },
                });
              }}
            />
          </Box>
        }
      >
        <Card size="small">
          {Object.entries(value?.schema || {}).map(([key, value]) => (
            <TypeBuilder
              key={key}
              value={value}
              onChange={onChange}
              disabled={disabled}
            />
          ))}
        </Card>
      </Form.Item>
      <Form.Item
        label={
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            justifyContent="center"
            alignItems="center"
          >
            <Text style={{ width: "fit-content", textWrap: "nowrap" }}>
              {t("default-value")}
            </Text>
            <Switch
              size="small"
              checked={hasDefaultValue}
              onChange={() => setHasDefaultValue(!hasDefaultValue)}
              disabled={disabled}
            />
          </Box>
        }
        style={{ width: "100%", marginBottom: 0 }}
      >
        <Upload showUploadList={false} disabled={disabled || !hasDefaultValue}>
          <Button
            icon={<UploadOutlined />}
            disabled={disabled || !hasDefaultValue}
          >
            {t("upload-json-file")}
          </Button>
        </Upload>
      </Form.Item>
    </Box>
  );
};
