import React from "react";
import {
  Card,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Tag,
} from "antd";
import { toSnakeCase } from "@/utils/code-utils";
import type { FunctionDetailDto } from "@/features/function/function-types";

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

export const PythonImplementationBuilder: React.FC<PythonImplementationBuilderProps> = ({
  form,
  functionBody,
  setFunctionBody,
  functionName,
  mode,
  functionDetail,
}) => {

  return (
    <Form form={form} layout="vertical" disabled={mode === "view"}>
      <Card className={styles.tabCard}>
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
              def{" "}
              {functionName
                ? toSnakeCase(functionName)
                : "function_name"}
              (input_data):
            </div>

            {/* Editable function body */}
            <TextArea
              value={functionBody}
              onChange={(e) => setFunctionBody(e.target.value)}
              rows={18}
              className={styles.functionBody}
              placeholder="    # Write your function body here...\n    return input_data"
              disabled={mode === "view"}
            />
          </div>
        </Form.Item>

        {mode === "view" &&
          functionDetail &&
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
                  )
                )}
              </Space>
            </div>
          )}
      </Card>
    </Form>
  );
};
