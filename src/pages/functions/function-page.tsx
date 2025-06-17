import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Badge,
  Tag,
  Modal,
  Spin,
  Alert,
} from "antd";
import {
  SaveOutlined,
  PlayCircleOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  CodeOutlined,
  RocketOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  useFunctionDetail,
  useCreateFunction,
  useUpdateFunction,
  useDeleteFunction,
  useCompileFunction,
  useExecuteFunction,
} from "@/features/function/function-hooks";
import type {
  CompilationStatus,
  FunctionCreateDto,
  FunctionUpdateDto,
} from "@/features/function/function-types";
import styles from "./function-page.module.css";
import { TypeBuilder } from "@/features/function/components/type-builder";
import { toSnakeCase } from "@/utils/code-utils";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

type PageMode = "create" | "view" | "edit";

export const FunctionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<PageMode>("create");
  const [form] = Form.useForm();
  const [functionBody, setFunctionBody] = useState(
    '    """\n    Main function entry point\n    \n    Args:\n        input_data: The input data to process\n        \n    Returns:\n        The processed result\n    """\n    # Your code here\n    return input_data',
  );
  const [functionName, setFunctionName] = useState("");

  // React Query hooks
  const {
    data: functionData,
    isLoading,
    error,
    refetch,
  } = useFunctionDetail(id!, !!id);

  const createMutation = useCreateFunction();
  const updateMutation = useUpdateFunction();
  const deleteMutation = useDeleteFunction();
  const compileMutation = useCompileFunction();
  const executeMutation = useExecuteFunction();

  useEffect(() => {
    if (id) {
      if (location.pathname.includes("/edit")) {
        setMode("edit");
      } else {
        setMode("view");
      }
    } else {
      setMode("create");
      // Set default values for create mode
      form.setFieldsValue({
        "definition.name": "",
        "definition.description": "",
        "definition.inputType": { name: "STRING" },
        "definition.outputType": { name: "STRING" },
        "implementation.language": "python",
      });
      setFunctionName("");
      setFunctionBody(
        '    """\n    Main function entry point\n    \n    Args:\n        input_data: The input data to process\n        \n    Returns:\n        The processed result\n    """\n    # Your code here\n    return input_data',
      );
    }
  }, [id, location.pathname, form]);

  useEffect(() => {
    if (functionData && mode !== "create") {
      form.setFieldsValue({
        "definition.name": functionData.definition.name,
        "definition.description": functionData.definition.description,
        "definition.inputType": functionData.definition.inputType,
        "definition.outputType": functionData.definition.outputType,
        "implementation.language": functionData.implementation.language,
      });
      setFunctionName(functionData.definition.name);

      const fullCode = functionData.implementation.code;
      const funcSignature = `def ${toSnakeCase(functionData.definition.name)}(input_data):`;
      const bodyStartIndex =
        fullCode.indexOf(funcSignature) + funcSignature.length;
      if (bodyStartIndex > funcSignature.length) {
        const body = fullCode.substring(bodyStartIndex).replace(/^\n/, "");
        setFunctionBody(body);
      } else {
        setFunctionBody(fullCode);
      }
    }
  }, [functionData, form, mode]);

  const watchedFunctionName = Form.useWatch("definition.name", form);

  useEffect(() => {
    if (watchedFunctionName !== functionName) {
      setFunctionName(watchedFunctionName || "");
    }
  }, [watchedFunctionName, functionName]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const funcName = toSnakeCase(values["definition.name"] || "");
      const fullCode = `def ${funcName}(input_data):\n${functionBody}`;

      const payload: FunctionCreateDto | FunctionUpdateDto = {
        definition: {
          name: values["definition.name"],
          description: values["definition.description"],
          inputType: values["definition.inputType"],
          outputType: values["definition.outputType"],
        },
        implementation: {
          language: values["implementation.language"],
          code: fullCode,
        },
      };

      if (mode === "create") {
        createMutation.mutate(
          { data: payload as FunctionCreateDto, compile: false },
          {
            onSuccess: () => {
              navigate("/functions");
            },
          },
        );
      } else {
        updateMutation.mutate(
          {
            functionId: id!,
            data: payload as FunctionUpdateDto,
            compile: false,
          },
          {
            onSuccess: () => {
              setMode("view");
              refetch();
            },
          },
        );
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCompile = () => {
    if (id) {
      compileMutation.mutate(id);
    }
  };

  const handleRun = () => {
    if (id) {
      // TODO: Navigate to function execution page or show execution modal
      executeMutation.mutate({
        functionId: id,
        executionData: { inputData: {} },
      });
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Function",
      content:
        "Are you sure you want to delete this function? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        if (id) {
          deleteMutation.mutate(id, {
            onSuccess: () => {
              navigate("/functions");
            },
          });
        }
      },
    });
  };

  const getStatusBadge = (status?: CompilationStatus) => {
    if (!status) return null;

    const statusConfig = {
      SUCCESS: { color: "success", text: "Compiled" },
      FAILED: { color: "error", text: "Failed" },
      IN_PROGRESS: { color: "processing", text: "Compiling" },
      OUTDATED: { color: "warning", text: "Outdated" },
      NOT_STARTED: { color: "default", text: "Not Compiled" },
    };

    const config = statusConfig[status];
    return <Badge status={config.color as any} text={config.text} />;
  };

  const getPageTitle = () => {
    switch (mode) {
      case "create":
        return "Create Function";
      case "edit":
        return `Edit Function: ${functionData?.definition.name || ""}`;
      case "view":
        return functionData?.definition.name || "Function";
      default:
        return "Function";
    }
  };

  const getHeaderActions = () => {
    const actions = [];

    if (mode === "view") {
      actions.push(
        <Button
          key="edit"
          icon={<EditOutlined />}
          onClick={() => setMode("edit")}
        >
          Edit
        </Button>,
      );

      if (functionData?.compilationStatus === "SUCCESS") {
        actions.push(
          <Button
            key="run"
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleRun}
            loading={executeMutation.isPending}
          >
            Run
          </Button>,
        );
      } else {
        actions.push(
          <Button
            key="compile"
            type="primary"
            icon={<RocketOutlined />}
            loading={compileMutation.isPending}
            onClick={handleCompile}
          >
            Compile
          </Button>,
        );
      }

      actions.push(
        <Button
          key="delete"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDelete}
          loading={deleteMutation.isPending}
        >
          Delete
        </Button>,
      );
    }

    if (mode === "edit") {
      actions.push(
        <Button key="cancel" onClick={() => setMode("view")}>
          Cancel
        </Button>,
      );
      actions.push(
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          loading={updateMutation.isPending}
          onClick={handleSave}
        >
          Save
        </Button>,
      );
    }

    if (mode === "create") {
      actions.push(
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          loading={createMutation.isPending}
          onClick={handleSave}
        >
          Create Function
        </Button>,
      );
    }

    return actions;
  };

  // Handle loading state
  if (isLoading && mode !== "create") {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  // Handle error state
  if (error && mode !== "create") {
    return (
      <div className={styles.container}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/functions")}
          className={styles.backButton}
        >
          Back to Functions
        </Button>
        <Alert
          message="Error loading function"
          description={error.message}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/functions")}
          className={styles.backButton}
        >
          Back to Functions
        </Button>

        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <Title level={1}>{getPageTitle()}</Title>
            {mode !== "create" && functionData && (
              <Space className={styles.headerMeta}>
                {getStatusBadge(functionData.compilationStatus)}
                <Tag icon={<CodeOutlined />} color="blue">
                  {functionData.implementation.language}
                </Tag>
              </Space>
            )}
          </div>
          <Space>{getHeaderActions()}</Space>
        </div>
      </div>

      {/* Main Content */}
      <Form form={form} layout="vertical" disabled={mode === "view"}>
        <Row gutter={24}>
          <Col span={24}>
            <Card title="Definition" className={styles.card}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Function Name"
                    name="definition.name"
                    rules={[
                      { required: true, message: "Function name is required" },
                    ]}
                  >
                    <Input placeholder="Enter function name" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Input Type"
                        name="definition.inputType"
                        rules={[
                          { required: true, message: "Input type is required" },
                        ]}
                      >
                        <TypeBuilder disabled={mode === "view"} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Output Type"
                        name="definition.outputType"
                        rules={[
                          {
                            required: true,
                            message: "Output type is required",
                          },
                        ]}
                      >
                        <TypeBuilder disabled={mode === "view"} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Form.Item label="Description" name="definition.description">
                <TextArea
                  rows={3}
                  placeholder="Describe what this function does..."
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Card title="Implementation">
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
                  { required: true, message: "Function code is required" },
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
                    disabled={mode === "view"}
                  />
                </div>
              </Form.Item>

              {mode === "view" &&
                functionData &&
                functionData.implementation.language === "python" &&
                (functionData.implementation as any).packages?.length > 0 && (
                  <div>
                    <Divider orientation="left">Dependencies</Divider>
                    <Space wrap>
                      {(functionData.implementation as any).packages.map(
                        (pkg: any, index: number) => (
                          <Tag key={index} color="blue">
                            {pkg.name}@{pkg.version}
                          </Tag>
                        ),
                      )}
                    </Space>
                  </div>
                )}
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Metadata (View mode only) */}
      {mode === "view" && functionData?.createdAt && (
        <Card title="Metadata" className={styles.metadataCard}>
          <Row gutter={16}>
            <Col span={12}>
              <Text type="secondary">Created:</Text>
              <br />
              <Text>{new Date(functionData.createdAt).toLocaleString()}</Text>
              <br />
              <Text type="secondary">by {functionData.createdBy}</Text>
            </Col>
            <Col span={12}>
              <Text type="secondary">Last Updated:</Text>
              <br />
              <Text>{new Date(functionData.updatedAt).toLocaleString()}</Text>
              <br />
              <Text type="secondary">by {functionData.updatedBy}</Text>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};
