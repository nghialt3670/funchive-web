import { BackButton } from "@/components/ui/back-button/back-button";
import { Loading } from "@/components/ui/loading/loading";
import { FunctionDefinitionTab } from "@/features/function/components/function-definition-tab";
import { FunctionImplementationTab } from "@/features/function/components/function-implementation-tab";
import { FunctionSettingTab } from "@/features/function/components/function-setting-tab";
import { FunctionStatusTag } from "@/features/function/components/function-status-tag";
import { FunctionDetailContextProvider } from "@/features/function/contexts/function-detail-context";
import {
  useCompileFunctionMutation,
  useCreateFunctionMutation,
  useDeleteFunctionMutation,
  useFunctionExecuteMutation,
  useGetFunctionDetailQuery,
  useUpdateFunctionBasicInfoMutation,
} from "@/features/function/hooks";
import type {
  FunctionCreateDto,
  FunctionUpdateDto,
} from "@/features/function/types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { toSnakeCase } from "@/utils/code-utils.ts";
import {
  BuildFilled,
  InfoCircleFilled,
  PlayCircleFilled,
  SettingFilled,
} from "@ant-design/icons";
import { Retry } from "@components/ui/retry";
import { Box } from "@mui/material";
import { Button, Form, Modal, Space, Tabs, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;

export const FunctionPage: React.FC = () => {
  const { t } = useTranslation();
  const { t: nt } = useNamespacedTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
  } = useGetFunctionDetailQuery(id!, !!id);

  const createMutation = useCreateFunctionMutation();
  const updateBasicInfoMutation = useUpdateFunctionBasicInfoMutation();
  const deleteMutation = useDeleteFunctionMutation();
  const compileMutation = useCompileFunctionMutation();
  const executeMutation = useFunctionExecuteMutation();

  useEffect(() => {
    if (id) {
      // Set default values for view mode
      if (functionDetail) {
        form.setFieldsValue({
          name: functionDetail.name,
          description: functionDetail.description,
          inputType: functionDetail.inputType,
          outputType: functionDetail.outputType,
        });
        setFunctionName(functionDetail.name);

        // Get the first implementation for editing (in real app, user would select which one)
        const firstImplementation = functionDetail.implementations[0];

        // For now, we'll handle Python implementations
        // In the future, this would need to handle different implementation types
        if (firstImplementation?.type === "PYTHON") {
          // Extract function body from the full code
          // This is a simplified extraction - in real app you'd want more robust parsing
          setFunctionBody(
            '    """\n    Implementation body\n    """\n    # Your code here\n    return input_data',
          );
        }
      }
    } else {
      // Set default values for create mode
      form.setFieldsValue({
        name: "",
        description: "",
        inputType: { name: "STRING" },
        outputType: { name: "STRING" },
      });
      setFunctionName("");
      setFunctionBody(
        '    """\n    Main function entry point\n    \n    Args:\n        input_data: The input data to process\n        \n    Returns:\n        The processed result\n    """\n    # Your code here\n    return input_data',
      );
    }
  }, [id, functionDetail, form]);

  const watchedFunctionName = Form.useWatch("name", form);

  useEffect(() => {
    if (watchedFunctionName !== functionName) {
      setFunctionName(watchedFunctionName || "");
    }
  }, [watchedFunctionName]);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      const funcName = toSnakeCase(values.name || "");
      const fullCode = `def ${funcName}(input_data):\n${functionBody}`;

      const payload: FunctionCreateDto = {
        name: values.name,
        description: values.description,
        inputType: values.inputType,
        outputType: values.outputType,
        implementations: [
          {
            type: "PYTHON",
            name: `${values.name} Python Implementation`,
            description: "Python implementation",
            version: "3.11",
            imports: [],
            packages: [],
            functionBody: fullCode,
          },
        ],
      };

      createMutation.mutate(payload, {
        onSuccess: () => {
          navigate("/functions");
        },
      });
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleUpdateBasicInfo = async (values: {
    name: string;
    description: string;
  }) => {
    const payload: FunctionUpdateDto = {
      name: values.name,
      description: values.description,
    };

    updateBasicInfoMutation.mutate(
      {
        functionId: id!,
        data: payload,
      },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  const handleCompile = () => {
    if (id && functionDetail?.implementations[0]) {
      compileMutation.mutate({
        functionId: id,
        implementationId: functionDetail.implementations[0].id,
      });
    }
  };

  const handleRun = () => {
    if (id && functionDetail?.implementations[0]) {
      executeMutation.mutate({
        functionId: id,
        implementationId: functionDetail.implementations[0].id,
        inputValueId: "default", // This would come from user input in real app
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
    if (!id) {
      return "Create Function";
    }
    return functionDetail?.name || "Function";
  };

  const getHeaderActions = () => {
    const actions = [];

    if (id) {
      // Check if any implementation is successfully compiled
      const hasCompiledImplementation = functionDetail?.implementations?.some(
        (impl) => impl.type === "PYTHON", // For now, assume compiled if it exists
      );

      if (hasCompiledImplementation) {
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
            disabled={!functionDetail?.implementations?.length}
          >
            Compile
          </Button>,
        );
      }
    } else {
      actions.push(
        <Button
          key="create"
          type="primary"
          loading={createMutation.isPending}
          onClick={handleCreate}
        >
          Create Function
        </Button>,
      );
    }

    return actions;
  };

  // Handle error state
  if (error && id) {
    return <Retry error={error} onRetry={refetch} />;
  }

  if (isLoading && id) {
    return <Loading />;
  }

  // Render content function
  const renderContent = () => (
    <Box maxWidth="80rem" margin="0 auto" padding="1rem">
      {/* Header */}
      <Box marginBottom="24px">
        <BackButton />
        <Space>{getHeaderActions()}</Space>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Title level={2}>{getPageTitle()}</Title>
            {id && functionDetail && (
              <Space>
                <FunctionStatusTag functionDetail={functionDetail} />
              </Space>
            )}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box marginTop="16px">
        <Tabs
          defaultActiveKey="definition"
          items={[
            {
              key: "definition",
              label: (
                <Box padding="0 1rem">
                  <InfoCircleFilled />
                  <Text>{nt("definition")}</Text>
                </Box>
              ),
              children: (
                <FunctionDefinitionTab
                  id={id}
                  form={form}
                  functionDetail={functionDetail}
                  updateBasicInfoMutation={updateBasicInfoMutation}
                  onSave={handleUpdateBasicInfo}
                />
              ),
            },
            {
              key: "implementation",
              label: (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={1}
                  padding="0 1rem"
                >
                  {/* TODO: Update ImplementationTypeIcon to work with new structure */}
                  <Text>{nt("implementation")}</Text>
                </Box>
              ),
              children: (
                <FunctionImplementationTab
                  id={id}
                  form={form}
                  functionBody={functionBody}
                  setFunctionBody={setFunctionBody}
                  functionName={functionName}
                  functionDetail={functionDetail}
                />
              ),
            },
            {
              key: "settings",
              label: (
                <Box padding="0 1rem">
                  <SettingFilled />
                  <Text>{t("settings")}</Text>
                </Box>
              ),
              children: (
                <FunctionSettingTab
                  id={id}
                  functionDetail={functionDetail}
                  deleteMutation={deleteMutation}
                  onDelete={handleDelete}
                />
              ),
            },
          ]}
        />
      </Box>
    </Box>
  );

  // For create mode, render without context provider
  if (!id) {
    return renderContent();
  }

  // For view/edit mode, wrap in context provider if we have function detail
  if (functionDetail) {
    return (
      <FunctionDetailContextProvider functionDetail={functionDetail}>
        {renderContent()}
      </FunctionDetailContextProvider>
    );
  }

  // Fallback - should not reach here due to loading check above
  return renderContent();
};
