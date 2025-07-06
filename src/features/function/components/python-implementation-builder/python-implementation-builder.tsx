import { EditableSection } from "@/components/ui/editable-section";
import type { FunctionDetail } from "@/features/function/types";
import { toSnakeCase } from "@/utils/code-utils";
import { Box } from "@mui/material";
import { Card, Divider, Form, Input, Select, Space, Tag } from "antd";
import React from "react";

import styles from "./python-implementation-builder.module.css";

const { TextArea } = Input;
const { Option } = Select;

interface PythonImplementationBuilderProps {
  form: any;
  functionBody: string;
  setFunctionBody: (body: string) => void;
  functionName: string;
  mode: "create" | "view" | "edit";
  functionDetail?: FunctionDetail;
}

export const PythonImplementationBuilder: React.FC<
  PythonImplementationBuilderProps
> = ({
  form,
  functionBody,
  setFunctionBody,
  functionName,
  mode,
  functionDetail,
}) => {
  const isViewMode = mode === "view";

  return (
    <Card className={styles.tabCard}>
      {isViewMode ? (
        // View mode with editable sections
        <>
          <EditableSection
            title="Programming Language"
            disabled={true} // TODO: Implement language editing
          >
            <Form.Item
              label="Programming Language"
              name="implementation.language"
              rules={[{ required: true }]}
              style={{ width: "200px", marginBottom: "16px" }}
            >
              <Select disabled={true}>
                <Option value="python">Python</Option>
                <Option value="javascript">JavaScript</Option>
                <Option value="java">Java</Option>
                <Option value="go">Go</Option>
              </Select>
            </Form.Item>
          </EditableSection>

          <EditableSection
            title="Function Code"
            disabled={true} // TODO: Implement code editing
          >
            <Form.Item
              label="Function Code"
              rules={[
                {
                  required: true,
                  message: "Function code is required",
                },
              ]}
              style={{ marginBottom: "16px" }}
            >
              <Box>
                {/* Fixed function signature */}
                <Box
                  bgcolor="var(--color-background-secondary)"
                  padding="12px"
                  fontFamily="monospace"
                  fontSize="14px"
                  border="1px solid var(--color-border)"
                  borderBottom="none"
                  borderRadius="6px 6px 0 0"
                  color="var(--color-text-secondary)"
                >
                  def{" "}
                  {functionName ? toSnakeCase(functionName) : "function_name"}
                  (input_data):
                </Box>

                {/* Editable function body */}
                <TextArea
                  value={functionBody}
                  onChange={(e) => setFunctionBody(e.target.value)}
                  rows={18}
                  style={{
                    fontFamily: "monospace",
                    fontSize: "14px",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0 0 6px 6px",
                    resize: "vertical",
                    background: "var(--color-background-primary)",
                    color: "var(--color-text-primary)",
                  }}
                  placeholder="    # Write your function body here...\n    return input_data"
                  disabled={true}
                />
              </Box>
            </Form.Item>
          </EditableSection>

          {functionDetail &&
            functionDetail.implementation.language === "PYTHON" &&
            (functionDetail.implementation as any).packages?.length > 0 && (
              <Box>
                <Divider orientation="left">Dependencies</Divider>
                <Space wrap>
                  {(functionDetail.implementation as any).packages.map(
                    (pkg: any, index: number) => (
                      <Tag key={index} color="blue">
                        {pkg.name}@{pkg.version}
                      </Tag>
                    ),
                  )}
                </Space>
              </Box>
            )}
        </>
      ) : (
        // Create mode
        <Form form={form} layout="vertical">
          <Form.Item
            label="Programming Language"
            name="implementation.language"
            rules={[{ required: true }]}
            style={{ width: "200px", marginBottom: "16px" }}
          >
            <Select>
              <Option value="python">Python</Option>
              <Option value="javascript">JavaScript</Option>
              <Option value="java">Java</Option>
              <Option value="go">Go</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Function Code"
            rules={[
              {
                required: true,
                message: "Function code is required",
              },
            ]}
            style={{ marginBottom: "16px" }}
          >
            <Box>
              {/* Fixed function signature */}
              <Box
                bgcolor="var(--color-background-secondary)"
                padding="12px"
                fontFamily="monospace"
                fontSize="14px"
                border="1px solid var(--color-border)"
                borderBottom="none"
                borderRadius="6px 6px 0 0"
                color="var(--color-text-secondary)"
              >
                def {functionName ? toSnakeCase(functionName) : "function_name"}
                (input_data):
              </Box>

              {/* Editable function body */}
              <TextArea
                value={functionBody}
                onChange={(e) => setFunctionBody(e.target.value)}
                rows={18}
                style={{
                  fontFamily: "monospace",
                  fontSize: "14px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0 0 6px 6px",
                  resize: "vertical",
                  background: "var(--color-background-primary)",
                  color: "var(--color-text-primary)",
                }}
                placeholder="    # Write your function body here...\n    return input_data"
                disabled={false}
              />
            </Box>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};
