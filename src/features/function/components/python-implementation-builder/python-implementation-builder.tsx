import { EditableSection } from "@/components/ui/editable-section";
import type { FunctionDetailDto } from "@/features/function/types";
import { toSnakeCase } from "@/utils/code-utils";
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
  functionDetail?: FunctionDetailDto;
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
              className={styles.languageSelect}
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
              className={styles.codeContainer}
            >
              <div>
                {/* Fixed function signature */}
                <div className={styles.functionSignature}>
                  def{" "}
                  {functionName ? toSnakeCase(functionName) : "function_name"}
                  (input_data):
                </div>

                {/* Editable function body */}
                <TextArea
                  value={functionBody}
                  onChange={(e) => setFunctionBody(e.target.value)}
                  rows={18}
                  className={styles.functionBody}
                  placeholder="    # Write your function body here...\n    return input_data"
                  disabled={true}
                />
              </div>
            </Form.Item>
          </EditableSection>

          {functionDetail &&
            functionDetail.implementation.language === "PYTHON" &&
            (functionDetail.implementation as any).packages?.length > 0 && (
              <div>
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
              </div>
            )}
        </>
      ) : (
        // Create mode
        <Form form={form} layout="vertical">
          <Form.Item
            label="Programming Language"
            name="implementation.language"
            rules={[{ required: true }]}
            className={styles.languageSelect}
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
            className={styles.codeContainer}
          >
            <div>
              {/* Fixed function signature */}
              <div className={styles.functionSignature}>
                def {functionName ? toSnakeCase(functionName) : "function_name"}
                (input_data):
              </div>

              {/* Editable function body */}
              <TextArea
                value={functionBody}
                onChange={(e) => setFunctionBody(e.target.value)}
                rows={18}
                className={styles.functionBody}
                placeholder="    # Write your function body here...\n    return input_data"
                disabled={false}
              />
            </div>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};
