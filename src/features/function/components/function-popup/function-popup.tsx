import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import {
  ArrowRightOutlined,
  BuildFilled,
  CopyFilled,
  DeleteFilled,
  EditFilled,
  EyeFilled,
  PlayCircleFilled,
} from "@ant-design/icons";
import { Button, Modal, Space, Tag, Tooltip, Typography } from "antd";
import { type FC, type PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  FunctionDetailContextProvider,
  useFunctionDetailContext,
} from "../../contexts/function-detail-context";
import {
  useCompileFunctionMutation,
  useDeleteFunctionMutation,
} from "../../function-hooks";
import type { FunctionDetailDto } from "../../function-types";
import { getTypeColor } from "../../utils/color-utils";
import { getLanguageIcon } from "../../utils/icon-utils";
import { FunctionCompilationStatus } from "../function-card/function-card";
import { TypeTooltip } from "../type-tooltip";
import styles from "./function-popup.module.css";

const { Title, Text, Paragraph } = Typography;

export interface FunctionPopupProps extends PropsWithChildren {
  functionDetail: FunctionDetailDto;
  open: boolean;
  onClose: () => void;
}

export const FunctionPopup: FC<FunctionPopupProps> = ({
  functionDetail,
  open,
  onClose,
  children,
}) => {
  return (
    <FunctionDetailContextProvider functionDetail={functionDetail}>
      <Modal
        title={
          <div className={styles.modalHeader}>
            <FunctionLanguageIcon />
            <FunctionName />
          </div>
        }
        open={open}
        onCancel={onClose}
        width={800}
        footer={
          <div className={styles.modalFooter}>
            <FunctionCompileOrExecuteButton />
            <FunctionActionButtons />
          </div>
        }
        className={styles.functionModal}
      >
        <div className={styles.modalContent}>
          <FunctionDescription />
          <FunctionInputOutputTypes />
          <FunctionCompilationStatus />
          {children}
        </div>
      </Modal>
    </FunctionDetailContextProvider>
  );
};

const FunctionLanguageIcon: FC = () => {
  const { implementation } = useFunctionDetailContext();
  return getLanguageIcon(implementation.language);
};

const FunctionName: FC = () => {
  const { definition } = useFunctionDetailContext();
  return (
    <Title level={4} style={{ margin: 0 }}>
      {definition.name}
    </Title>
  );
};

const FunctionDescription: FC = () => {
  const { definition } = useFunctionDetailContext();

  return (
    <div className={styles.descriptionSection}>
      <Text strong>Description:</Text>
      <Paragraph className={styles.description}>
        {definition.description || "No description provided"}
      </Paragraph>
    </div>
  );
};

const FunctionInputOutputTypes: FC = () => {
  const { definition } = useFunctionDetailContext();
  const inputTypeColor = getTypeColor(definition.inputType);
  const outputTypeColor = getTypeColor(definition.outputType);

  return (
    <div className={styles.typesSection}>
      <Text strong>Input/Output Types:</Text>
      <div className={styles.typeFlow}>
        <TypeTooltip type={definition.inputType}>
          <Tag color={inputTypeColor} className={styles.typeTag}>
            {definition.inputType.name}
          </Tag>
        </TypeTooltip>
        <ArrowRightOutlined />
        <TypeTooltip type={definition.outputType}>
          <Tag color={outputTypeColor} className={styles.typeTag}>
            {definition.outputType.name}
          </Tag>
        </TypeTooltip>
      </div>
    </div>
  );
};

const FunctionCompileOrExecuteButton: FC = () => {
  const { compilationStatus } = useFunctionDetailContext();
  const canRun = compilationStatus === "SUCCESS";
  const needsCompilation = ["NOT_STARTED", "OUTDATED", "FAILED"].includes(
    compilationStatus,
  );

  if (canRun) {
    return <FunctionExecuteButton />;
  }

  if (needsCompilation) {
    return <FunctionCompileButton />;
  }

  return <FunctionCompileButton />;
};

const FunctionCompileButton: FC = () => {
  const { t } = useNamespacedTranslation();
  const { id } = useFunctionDetailContext();
  const compileMutation = useCompileFunctionMutation();

  const handleCompile = () => {
    compileMutation.mutate(id);
  };

  return (
    <Tooltip title={t("compile-function")}>
      <Button
        type="primary"
        icon={<BuildFilled />}
        onClick={handleCompile}
        loading={compileMutation.isPending}
      >
        {t("compile")}
      </Button>
    </Tooltip>
  );
};

const FunctionExecuteButton: FC = () => {
  const navigate = useNavigate();
  const { t } = useNamespacedTranslation();
  const { id } = useFunctionDetailContext();

  const handleExecute = () => {
    navigate(`/pipelines/new?functionId=${id}`);
  };

  return (
    <Tooltip title={t("execute-function")}>
      <Button
        type="primary"
        icon={<PlayCircleFilled />}
        onClick={handleExecute}
      >
        {t("execute")}
      </Button>
    </Tooltip>
  );
};

const FunctionActionButtons: FC = () => {
  const { t } = useTranslation();
  const { id } = useFunctionDetailContext();
  const navigate = useNavigate();
  const deleteMutation = useDeleteFunctionMutation();

  return (
    <Space>
      <Tooltip title="View Details">
        <Button
          icon={<EyeFilled />}
          onClick={() => navigate(`/functions/${id}`)}
        >
          {t("details")}
        </Button>
      </Tooltip>
      <Tooltip title="Edit Function">
        <Button
          icon={<EditFilled />}
          onClick={() => navigate(`/functions/${id}/edit`)}
        >
          {t("edit")}
        </Button>
      </Tooltip>
      <Tooltip title="Clone Function">
        <Button
          icon={<CopyFilled />}
          onClick={() => navigate(`/functions/${id}/clone`)}
        >
          {t("clone")}
        </Button>
      </Tooltip>
      <ConfirmDialog
        message="Are you sure you want to delete this function?"
        onConfirm={() => deleteMutation.mutate(id)}
      >
        <Button danger icon={<DeleteFilled />}>
          {t("delete")}
        </Button>
      </ConfirmDialog>
    </Space>
  );
};
