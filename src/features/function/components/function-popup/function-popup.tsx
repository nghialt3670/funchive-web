import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { tryCloneNodeWithOnClick } from "@/utils/element-utils";
import {
  ArrowRightOutlined,
  BuildFilled,
  CopyFilled,
  DeleteFilled,
  EditFilled,
  EyeFilled,
  PlayCircleFilled,
} from "@ant-design/icons";
import { Button, Modal, Space, Tooltip, Typography } from "antd";
import { type FC, type PropsWithChildren, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import type { FunctionDetailDto } from "../../function-types";
import {
  useCompileFunctionMutation,
  useDeleteFunctionMutation,
} from "../../hooks";
import { getLanguageIcon } from "../../utils/icon-utils";
import { FunctionStatusTag } from "../function-status-tag/function-status-tag";
import { TypeTag } from "../type-tag";
import styles from "./function-popup.module.css";

const { Title, Text, Paragraph } = Typography;

export interface FunctionPopupProps extends PropsWithChildren {
  functionDetail: FunctionDetailDto;
}

export const FunctionPopup: FC<FunctionPopupProps> = ({
  functionDetail,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { t: tNs } = useNamespacedTranslation();
  const navigate = useNavigate();
  const compileMutation = useCompileFunctionMutation();
  const deleteMutation = useDeleteFunctionMutation();

  const { id, definition, implementation, compilationStatus } = functionDetail;

  const canRun = compilationStatus === "SUCCESS";
  const needsCompilation = ["NOT_STARTED", "OUTDATED", "FAILED"].includes(
    compilationStatus,
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleCompile = () => {
    compileMutation.mutate(id);
  };

  const handleExecute = () => {
    navigate(`/pipelines/new?functionId=${id}`);
  };

  const clonedChildren = tryCloneNodeWithOnClick(children, (e) => {
    e.stopPropagation();
    setOpen(true);
  });

  return (
    <>
      {clonedChildren}
      <Modal
        title={
          <div className={styles.modalHeader}>
            {getLanguageIcon(implementation.language)}
            <Title level={4} style={{ margin: 0 }}>
              {definition.name}
            </Title>
          </div>
        }
        open={open}
        onCancel={handleClose}
        width={800}
        centered
        footer={
          <div className={styles.modalFooter}>
            {/* Primary Action Button */}
            {canRun ? (
              <Tooltip title={tNs("execute-function")}>
                <Button
                  type="primary"
                  icon={<PlayCircleFilled />}
                  onClick={handleExecute}
                >
                  {tNs("execute")}
                </Button>
              </Tooltip>
            ) : needsCompilation ? (
              <Tooltip title={tNs("compile-function")}>
                <Button
                  type="primary"
                  icon={<BuildFilled />}
                  onClick={handleCompile}
                  loading={compileMutation.isPending}
                >
                  {tNs("compile")}
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title={tNs("compile-function")}>
                <Button
                  type="primary"
                  icon={<BuildFilled />}
                  onClick={handleCompile}
                  loading={compileMutation.isPending}
                >
                  {tNs("compile")}
                </Button>
              </Tooltip>
            )}

            {/* Action Buttons */}
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
          </div>
        }
        className={styles.functionModal}
      >
        <div className={styles.modalContent}>
          {/* Description Section */}
          <div className={styles.descriptionSection}>
            <Text strong>{t("description")}:</Text>
            <Paragraph className={styles.description}>
              {definition.description}
            </Paragraph>
          </div>

          {/* Input/Output Types Section */}
          <div className={styles.typesSection}>
            <Text strong>{t("input-output")}:</Text>
            <div className={styles.typeFlow}>
              <TypeTag type={definition.inputType} />
              <ArrowRightOutlined />
              <TypeTag type={definition.outputType} />
            </div>
          </div>

          {/* Status Section */}
          <div className={styles.statusSection}>
            <Text strong>{t("status")}:</Text>
            <FunctionStatusTag functionDetail={functionDetail} />
          </div>
        </div>
      </Modal>
    </>
  );
};
