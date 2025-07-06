import { BackButton } from "@/components/ui/back-button/back-button";
import { EditableSection } from "@/components/ui/editable-section";
import { FormItemWithPageMode } from "@/components/ui/form-item-with-page-mode";
import { Loading } from "@/components/ui/loading/loading";
import { FunctionDefinitionTab } from "@/features/function/components/function-definition-tab";
import { FunctionDetailContextProvider } from "@/features/function/contexts/function-detail-context";
import {
  useCreateFunctionMutation,
  useGetFunctionDetailQuery,
  useUpdateFunctionMutation,
} from "@/features/function/hooks";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { usePageMode } from "@/hooks/use-page-mode";
import {
  CloseCircleFilled,
  EditFilled,
  InfoCircleFilled,
  SaveFilled,
  SettingFilled,
} from "@ant-design/icons";
import { Retry } from "@components/ui/retry";
import { Box } from "@mui/material";
import { Button, Form, Input, Tabs, Tooltip, Typography } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export const FunctionPage: React.FC = () => {
  const { t } = useTranslation();
  const { t: nt } = useNamespacedTranslation();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { pageMode, setPageMode } = usePageMode();

  const {
    data: functionDetail,
    isLoading: isGetDetailLoading,
    error: getDetailError,
    refetch,
  } = useGetFunctionDetailQuery(id!);

  const {
    mutate: updateFunction,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
  } = useUpdateFunctionMutation();

  const {
    mutate: createFunction,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess,
  } = useCreateFunctionMutation();

  useEffect(() => {
    if (functionDetail) {
      form.setFieldsValue(functionDetail);
    }
  }, [functionDetail]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setPageMode("view");
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isCreateSuccess) {
      setPageMode("view");
    }
  }, [isCreateSuccess]);

  const handleEditClick = () => {
    setPageMode("edit");
  };

  const handleCreateClick = () => {
    form.validateFields().then((values) => {
      createFunction({ data: values });
    });
  };

  const handleUpdateClick = () => {
    form.validateFields().then((values) => {
      updateFunction({
        functionId: id!,
        data: values,
      });
    });
  };

  const handleCancelClick = () => {
    setPageMode("view");
  };

  if (getDetailError && id) {
    return <Retry error={getDetailError} onRetry={refetch} />;
  }

  if (isGetDetailLoading && id) {
    return <Loading />;
  }

  return (
    <FunctionDetailContextProvider functionDetail={functionDetail}>
      <Form form={form} layout="vertical">
        <Box
          maxWidth="80rem"
          display="flex"
          flexDirection="column"
          margin="0 auto"
          padding="1rem"
          gap={2}
        >
          <Box display="flex" flexDirection="row" gap={1}>
            <Tooltip title={t("back")}>
              <BackButton />
            </Tooltip>
            {pageMode === "create" && (
              <Tooltip title={t("save")}>
                <Button
                  icon={<SaveFilled />}
                  onClick={handleCreateClick}
                  loading={isCreatePending}
                />
              </Tooltip>
            )}
            {pageMode === "view" && (
              <Tooltip title={t("edit")}>
                <Button icon={<EditFilled />} onClick={handleEditClick} />
              </Tooltip>
            )}
            {pageMode === "edit" && (
              <>
                <Tooltip title={t("save-changes")}>
                  <Button
                    icon={<SaveFilled />}
                    onClick={handleUpdateClick}
                    loading={isUpdatePending}
                  />
                </Tooltip>
                <Tooltip title={t("cancel-changes")}>
                  <Button
                    icon={<CloseCircleFilled />}
                    onClick={handleCancelClick}
                  />
                </Tooltip>
              </>
            )}
          </Box>

          <FormItemWithPageMode
            name="name"
            label={nt("function-name")}
            rules={[
              { required: true, message: nt("function-name-is-required") },
            ]}
          >
            <EditableSection>
              <Input
                placeholder={nt("enter-function-name-placeholder")}
                style={{ fontSize: "1.5rem", fontWeight: "bold" }}
              />
            </EditableSection>
          </FormItemWithPageMode>

          <Tabs
            defaultActiveKey="definition"
            items={[
              {
                key: "definition",
                label: (
                  <Box padding="0 0.5rem">
                    <InfoCircleFilled />
                    <Text style={{ color: "var(--color-text-secondary)" }}>{nt("definition")}</Text>
                  </Box>
                ),
                children: <FunctionDefinitionTab />,
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
                    <Text style={{ color: "var(--color-text-secondary)" }}>{nt("implementation")}</Text>
                  </Box>
                ),
                children: undefined,
              },
              {
                key: "settings",
                label: (
                  <Box padding="0 1rem">
                    <SettingFilled />
                    <Text style={{ color: "var(--color-text-secondary)" }}>{t("settings")}</Text>
                  </Box>
                ),
                children: undefined,
              },
            ]}
          />
        </Box>
      </Form>
    </FunctionDetailContextProvider>
  );
};
