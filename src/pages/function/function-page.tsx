import { BackButton } from "@/components/ui/back-button/back-button";
import {
  FunctionLanguageIcon,
} from "@/features/function/components/function-language-icon/function-language-icon";
import { FunctionStatusTag } from "@/features/function/components/function-status-tag";
import { TypeBuilder } from "@/features/function/components/type-builder";
import { FunctionDetailContextProvider } from "@/features/function/contexts/function-detail-context";
import {
  useCompileFunctionMutation,
  useCreateFunctionMutation,
  useDeleteFunctionMutation,
  useExecuteFunctionMutation,
  useFunctionDetailQuery,
  useUpdateFunctionMutation,
} from "@/features/function/function-hooks.ts";
import type {
  FunctionCreateDto,
  FunctionUpdateDto,
} from "@/features/function/function-types.ts";
import { toSnakeCase } from "@/utils/code-utils.ts";
import {
  BuildFilled,
  CodeFilled,
  DeleteFilled,
  EditFilled,
  FileTextFilled,
  PlayCircleFilled,
  SaveFilled,
  SettingFilled,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  Tag,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import styles from "./function-page.module.css";

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
    data: functionDetail,
    isLoading,
    error,
    refetch,
  } = useFunctionDetailQuery(id!, !!id);

  const createMutation = useCreateFunctionMutation();
  const updateMutation = useUpdateFunctionMutation();
  const deleteMutation = useDeleteFunctionMutation();
  const compileMutation = useCompileFunctionMutation();
  const executeMutation = useExecuteFunctionMutation();

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
    if (functionDetail && mode !== "create") {
      form.setFieldsValue({
        "definition.name": functionDetail.definition.name,
        "definition.description": functionDetail.definition.description,
        "definition.inputType": functionDetail.definition.inputType,
        "definition.outputType": functionDetail.definition.outputType,
        "implementation.language": functionDetail.implementation.language,
      });
      setFunctionName(functionDetail.definition.name);

      const fullCode = functionDetail.implementation.code;
      const funcSignature = `def ${toSnakeCase(functionDetail.definition.name)}(input_data):`;
      const bodyStartIndex =
        fullCode.indexOf(funcSignature) + funcSignature.length;
      if (bodyStartIndex > funcSignature.length) {
        const body = fullCode.substring(bodyStartIndex).replace(/^\n/, "");
        setFunctionBody(body);
      } else {
        setFunctionBody(fullCode);
      }
    }
  }, [functionDetail, form, mode]);

  const watchedFunctionName = Form.useWatch("definition.name", form);

  useEffect(() => {
    if (watchedFunctionName !== functionName) {
      setFunctionName(watchedFunctionName || "");
    }
  }, [watchedFunctionName]);

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

  const getPageTitle = () => {
    switch (mode) {
      case "create":
        return "Create Function";
      case "edit":
        return `Edit Function: ${functionDetail?.definition.name || ""}`;
      case "view":
        return functionDetail?.definition.name || "Function";
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
          icon={<EditFilled />}
          onClick={() => setMode("edit")}
        >
          Edit
        </Button>,
      );

      if (functionDetail?.compilationStatus === "SUCCESS") {
        actions.push(
          <Button
            key="run"
            type="primary"
            icon={<PlayCircleFilled />}
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
            icon={<BuildFilled />}
            loading={compileMutation.isPending}
            onClick={handleCompile}
          >
            Compile
          </Button>,
        );
      }
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
          icon={<SaveFilled />}
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
          icon={<SaveFilled />}
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
        <BackButton />
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
    <FunctionDetailContextProvider functionDetail={functionDetail!!}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <BackButton />
          <Space>{getHeaderActions()}</Space>

          <div className={styles.headerContent}>
            <div className={styles.headerInfo}>
              <Title level={2}>{getPageTitle()}</Title>
              {mode !== "create" && functionDetail && (
                <Space>
                  <FunctionLanguageIcon functionDetail={functionDetail} />
                  <FunctionStatusTag functionDetail={functionDetail} />
                </Space>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.tabsContainer}>
          <Tabs
            defaultActiveKey="definition"
            className={styles.functionTabs}
            items={[
              {
                key: "definition",
                label: (
                  <span>
                    <FileTextFilled />
                    Definition
                  </span>
                ),
                children: (
                  <Form
                    form={form}
                    layout="vertical"
                    disabled={mode === "view"}
                  >
                    <Card className={styles.tabCard}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label="Function Name"
                            name="definition.name"
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
                          <Form.Item
                            label="Description"
                            name="definition.description"
                          >
                            <TextArea
                              rows={3}
                              placeholder="Describe what this function does..."
                            />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            label="Input Type"
                            name="definition.inputType"
                            rules={[
                              {
                                required: true,
                                message: "Input type is required",
                              },
                            ]}
                          >
                            <TypeBuilder disabled={mode === "view"} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
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
                    </Card>
                  </Form>
                ),
              },
              {
                key: "implementation",
                label: (
                  <span>
                    <CodeFilled />
                    Implementation
                  </span>
                ),
                children: (
                  <Form
                    form={form}
                    layout="vertical"
                    disabled={mode === "view"}
                  >
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
                        (functionDetail.implementation as any).packages?.length >
                          0 && (
                          <div>
                            <Divider orientation="left">Dependencies</Divider>
                            <Space wrap>
                              {(
                                functionDetail.implementation as any
                              ).packages.map((pkg: any, index: number) => (
                                <Tag key={index} color="blue">
                                  {pkg.name}@{pkg.version}
                                </Tag>
                              ))}
                            </Space>
                          </div>
                        )}
                    </Card>
                  </Form>
                ),
              },
              {
                key: "settings",
                label: (
                  <span>
                    <SettingFilled />
                    Settings
                  </span>
                ),
                children: (
                  <Card className={styles.tabCard}>
                    <div className={styles.settingsContent}>
                      {/* Metadata Section */}
                      {mode === "view" && functionDetail?.createdAt && (
                        <>
                          <div className={styles.metadataSection}>
                            <Title level={4}>Metadata</Title>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className={styles.metadataItem}>
                                  <Text type="secondary">Created:</Text>
                                  <br />
                                  <Text>
                                    {new Date(
                                      functionDetail.createdAt,
                                    ).toLocaleString()}
                                  </Text>
                                  <br />
                                  <Text type="secondary">
                                    by {functionDetail.createdBy}
                                  </Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className={styles.metadataItem}>
                                  <Text type="secondary">Last Updated:</Text>
                                  <br />
                                  <Text>
                                    {new Date(
                                      functionDetail.updatedAt,
                                    ).toLocaleString()}
                                  </Text>
                                  <br />
                                  <Text type="secondary">
                                    by {functionDetail.updatedBy}
                                  </Text>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          <Divider />
                        </>
                      )}

                      {/* Danger Zone */}
                      {mode === "view" && (
                        <div className={styles.dangerZone}>
                          <Title level={4} type="danger">
                            Danger Zone
                          </Title>
                          <div className={styles.dangerZoneContent}>
                            <div className={styles.dangerZoneDescription}>
                              <Text strong>Delete Function</Text>
                              <br />
                              <Text type="secondary">
                                Once you delete a function, there is no going
                                back. Please be certain.
                              </Text>
                            </div>
                            <Button
                              danger
                              icon={<DeleteFilled />}
                              onClick={handleDelete}
                              loading={deleteMutation.isPending}
                              className={styles.deleteButton}
                            >
                              Delete Function
                            </Button>
                          </div>
                        </div>
                      )}

                      {mode !== "view" && (
                        <div className={styles.noSettings}>
                          <Text type="secondary">
                            Settings are only available in view mode.
                          </Text>
                        </div>
                      )}
                    </div>
                  </Card>
                ),
              },
            ]}
          />
        </div>
      </div>
    </FunctionDetailContextProvider>
  );
};
