import { TypeBuilder } from "@/features/function/components/type-builder";
import type { Type } from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { Box, useMediaQuery } from "@mui/material";
import { Card, Col, Form, Input, Row, Typography } from "antd";
import React from "react";

const { TextArea } = Input;
const { Paragraph } = Typography;

const DEFAULT_TYPE = {
  name: "STRING" as const,
  description: "",
  defaultValue: undefined,
};

interface FunctionDefinitionTabProps {
  id?: string;
  form: any;
  functionDetail?: any;
  updateBasicInfoMutation: any;
  onSave?: (values: { name: string; description: string }) => Promise<void>;
}

export const FunctionDefinitionTab: React.FC<FunctionDefinitionTabProps> = ({
  id,
  form,
}) => {
  const { t: nt } = useNamespacedTranslation();
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Card size={isMobile ? "small" : "default"}>
      {id ? (
        // View/Edit mode with individual editable sections
        <Form layout="vertical">
          <Box display="flex" flexDirection="column" gap={2}>
            <Paragraph
              readOnly
              value={form.getFieldValue("description")}
              autoSize={{ minRows: 1, maxRows: 5 }}
            >
              {form.getFieldValue("description")}
            </Paragraph>
            <Box
              display="flex"
              flexDirection={isTablet ? "column" : "row"}
              gap={2}
            >
              <TypeBuilder
                label={nt("input-type")}
                value={form.getFieldValue("inputType")}
                readOnly
              />

              <TypeBuilder
                label={nt("output-type")}
                value={form.getFieldValue("outputType")}
                readOnly
              />
            </Box>
          </Box>
        </Form>
      ) : (
        // Create mode
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Function Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Function name is required",
                  },
                ]}
              >
                <Input placeholder="Enter function name" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Description" name="description">
                <TextArea
                  rows={3}
                  placeholder="Describe what this function does..."
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="inputType">
                <TypeBuilder
                  label={nt("input-type")}
                  defaultValue={DEFAULT_TYPE as Type}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="outputType">
                <TypeBuilder
                  label={nt("output-type")}
                  defaultValue={DEFAULT_TYPE as Type}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Card>
  );
};
