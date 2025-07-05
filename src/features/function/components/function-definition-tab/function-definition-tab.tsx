import { EditableSection } from "@/components/ui/editable-section";
import { TypeBuilder } from "@/features/function/components/type-builder";
import type { Type } from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { Card, Col, Form, Input, Row } from "antd";
import React from "react";

const { TextArea } = Input;

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
  updateBasicInfoMutation,
  onSave,
}) => {
  const { t: nt } = useNamespacedTranslation();

  const handleUpdateBasicInfo = async (values: {
    name: string;
    description: string;
  }) => {
    if (onSave) {
      await onSave(values);
    }
  };

  return (
    <Card
      className="tabCard"
      style={{ border: "none", boxShadow: "none", borderRadius: 0 }}
    >
      {id ? (
        // View/Edit mode with editable sections
        <>
          <EditableSection
            title="Basic Information"
            onSave={async () => {
              const values = await form.validateFields();
              await handleUpdateBasicInfo({
                name: values.name,
                description: values.description,
              });
            }}
            loading={updateBasicInfoMutation.isPending}
          >
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
              </Row>
            </Form>
          </EditableSection>

          <EditableSection
            title="Input Type"
            disabled={true} // TODO: Implement type editing
          >
            <TypeBuilder label="Input Type" disabled={true} />
          </EditableSection>

          <EditableSection
            title="Output Type"
            disabled={true} // TODO: Implement type editing
          >
            <TypeBuilder label="Output Type" disabled={true} />
          </EditableSection>
        </>
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
